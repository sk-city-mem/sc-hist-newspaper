import {
  QueryDslBoolQuery,
  QueryDslQueryContainer,
} from '@elastic/elasticsearch/lib/api/typesWithBodyKey';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { createWorker, PSM } from 'tesseract.js';
import { PostSearchBody, SearchQuery } from './pdf-news-doc.interface';

@Injectable()
export class PdfNewsDocService {
  constructor(
    private readonly esService: ElasticsearchService,
    private readonly configService: ConfigService,
  ) {}
  public async createIndex() {
    const index = this.configService.get('ES_INDEX_NAME');
    const checkIndex = await this.esService.indices.exists({ index });
    if (!checkIndex) {
      this.esService.indices.create({
        index,
      });
    }
  }
  /*
  if (!checkIndex) {
      this.esService.indices.create({
        index,
        body: {
          mappings: {
            properties: {
              content: {
                type: 'text',
                analyzer: 'NGramAnalyzer',
              },
            },
          },
          settings: {
            analysis: {
              filter: {
                ngram: {
                  type: 'edge_ngram',
                  min_gram: 1,
                  max_gram: 50,
                },
              },
              analyzer: {
                NGramAnalyzer: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: ['lowercase', 'ngram'],
                },
              },
            },
          },
        },
      });
    }
  */
  public async addNewspaper(
    serialname: string,
    content: string,
    fileKey: string,
    name: string,
  ) {
    const index = this.configService.get('ES_INDEX_NAME');
    this.esService.index<PostSearchBody>({
      index: index,
      id: serialname + '-' + name,
      body: {
        serialname: serialname,
        content: content,
        date: this.getDateFromFileName(serialname), //TODO: convert string to date
        name: name,
        fileURL: new URL(
          this.configService.get('AWS_ENDPOINT') + 'newspaperbucket/' + fileKey,
        ),
      },
    });
  }
  async search(searchQuery: SearchQuery) {
    const index = this.configService.get('ES_INDEX_NAME');
    Logger.log(searchQuery.from);
    const esSearchQuery: QueryDslQueryContainer[] = [];
    if (searchQuery.content)
      esSearchQuery.push({
        multi_match: {
          query: searchQuery.content,
          fields: ['content'],
          fuzziness: 'AUTO',
        },
      });
    if (searchQuery.from && searchQuery.to)
      esSearchQuery.push({
        range: {
          date: {
            gte: searchQuery.from,
            lte: searchQuery.to,
          },
        },
      });
    else if (searchQuery.from)
      esSearchQuery.push({
        range: {
          date: {
            gte: searchQuery.from,
          },
        },
      });
    else if (searchQuery.to)
      esSearchQuery.push({
        range: {
          date: {
            lte: searchQuery.to,
          },
        },
      });

    if (searchQuery.name)
      esSearchQuery.push({
        multi_match: {
          query: searchQuery.name,
          fields: ['name'],
          fuzziness: 'AUTO',
        },
      });

    if (searchQuery.serialname)
      esSearchQuery.push({
        multi_match: {
          query: searchQuery.serialname,
          fields: ['serialname'],
          fuzziness: 'AUTO',
        },
      });

    Logger.log(searchQuery);

    const body = await this.esService.search<PostSearchBody>({
      from: (searchQuery.pageNo || 0) * (searchQuery.pageSize || 25),
      size: searchQuery.pageSize || 25,
      index: index,
      body: {
        query: {
          bool: {
            must: esSearchQuery,
          },
        },
        highlight: {
          fields: {
            content: {},
          },
        },
      },
      fields: ['serialname', 'date', 'name', 'fileURL'],
    });
    const hits = body.hits.hits;
    console.log(body.hits);
    console.log(hits.map((item) => item.highlight));
    return hits.map((item) => {
      return { result: item.fields, highlights: item.highlight };
    });
  }

  getDateFromFileName(name: string) {
    const tokens = name.split(/_|-| /);
    Logger.log(tokens);
    return new Date(
      Number(tokens[2]),
      turkishMonths[tokens[1].toLocaleLowerCase()],
      Number(tokens[0]),
    );
  }
}

const turkishMonths = {
  ocak: 0,
  şubat: 1,
  mart: 2,
  nisan: 3,
  mayıs: 4,
  haziran: 5,
  temmuz: 6,
  ağustos: 7,
  eylül: 8,
  ekim: 9,
  kasım: 10,
  aralık: 11,
};
