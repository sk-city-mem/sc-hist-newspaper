import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { createWorker, PSM } from 'tesseract.js';
import { PostSearchBody } from './pdf-news-doc.interface';

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
  public async addNewspaper(serialname: string, content: string) {
    const index = this.configService.get('ES_INDEX_NAME');
    const name = 'akşam';
    this.esService.index<PostSearchBody>({
      index: index,
      id: serialname + '-' + name,
      body: {
        serialname: serialname,
        content: content,
        date: this.getDateFromFileName(serialname), //TODO: convert string to date
        name: name,
      },
    });
  }
  async search(text: string) {
    const index = this.configService.get('ES_INDEX_NAME');
    const body = await this.esService.search<PostSearchBody>({
      index: index,
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ['content'],
            fuzziness: 'AUTO',
          },
        },
        highlight: {
          fields: {
            content: {},
          },
        },
      },
      fields: ['serialname', 'date', 'name'],
    });
    const hits = body.hits.hits;
    console.log(body.hits);
    console.log(hits.map((item) => item.highlight));
    return hits.map((item) => {
      return { result: item.fields, highlights: item.highlight };
    });
  }

  getDateFromFileName(name: string) {
    const tokens = name.split(' ');
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
