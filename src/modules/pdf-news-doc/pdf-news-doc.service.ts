import {
  QueryDslBoolQuery,
  QueryDslQueryContainer,
} from '@elastic/elasticsearch/lib/api/typesWithBodyKey';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { createWorker, PSM } from 'tesseract.js';
import {
  NewspaperUpdateDTO,
  PostSearchBody,
  SearchQuery,
} from './pdf-news-doc.interface';

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
      id: fileKey,
      body: {
        serialname: serialname,
        content: content,
        date: this.getDateFromFileName(serialname), //TODO: convert string to date
        name: name,
        fileURL: new URL(
          //this.configService.get('AWS_ENDPOINT') + 'newspaperbucket/' + fileKey,
          this.configService.get('SERVER_ENDPOINT') + fileKey,
        ),
      },
    });
  }
  async search(searchQuery: SearchQuery) {
    const index = this.configService.get('ES_INDEX_NAME');
    Logger.log(searchQuery.from);
    const esSearchQuery: QueryDslQueryContainer[] = [];
    const esShouldhQuery: QueryDslQueryContainer[] = [];
    const esMustNotQuery: QueryDslQueryContainer[] = [];
    if (searchQuery.content)
      esSearchQuery.push({
        multi_match: {
          query: searchQuery.content,
          fields: ['content'],
          fuzziness: searchQuery.fuzzy ? 'AUTO' : 0,
        },
      });

    if (searchQuery.should)
      searchQuery.should.forEach((val) => {
        esShouldhQuery.push({
          match: {
            content: {
              query: val,
            },
          },
        });
      });
    if (searchQuery.must)
      searchQuery.must.forEach((val) => {
        esSearchQuery.push({
          match: {
            content: {
              query: val,
            },
          },
        });
      });
    if (searchQuery.mustNot)
      searchQuery.mustNot.forEach((val) => {
        esMustNotQuery.push({
          match: {
            content: {
              query: val,
            },
          },
        });
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
            should: esShouldhQuery,
            must_not: esMustNotQuery,
          },
        },
        highlight: {
          fields: {
            content: {},
          },
        },
        track_scores: true,
        sort: [
          '_score',
          { date: { order: 'asc', format: 'strict_date_optional_time_nanos' } },
        ],
      },
      fields: ['serialname', 'date', 'name', 'fileURL'],
    });
    const hits = body.hits.hits;
    console.log('hhiiit', body.hits);
    console.log(hits.map((item) => item.highlight));
    const matches = hits.map((item) => {
      return {
        result: item.fields,
        highlights: item.highlight,
        id: item._id,
      };
    });

    return { matches: matches, total: body.hits.total.valueOf() };
  }

  public async deleteById(id: string) {
    const index = this.configService.get('ES_INDEX_NAME');
    await this.esService.delete({ index: index, id: id, refresh: 'wait_for' });
  }

  public async findPdfIdById(id: string) {
    const index = this.configService.get('ES_INDEX_NAME');
    const body = await this.esService.get({ index: index, id: id });
    console.log(body);
  }

  public async update(id: string, body: NewspaperUpdateDTO) {
    console.log(id, body);
    const index = this.configService.get('ES_INDEX_NAME');
    const res = await this.esService.update({
      index: index,
      refresh: 'wait_for',
      id: id,
      doc: { name: body.name, date: body.date },
    });
    console.log(res);
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
