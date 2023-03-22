import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { createWorker, PSM } from 'tesseract.js';

interface PostSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: PostSearchBody;
    }>;
  };
}

export interface PostSearchBody {
  name: string;
  content: string;
  date: Date;
  brand: string;
}

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
        body: {},
      });
    }
  }
  public async addNewspaper(name: string, content: string) {
    const index = this.configService.get('ES_INDEX_NAME');
    this.esService.index<PostSearchBody>({
      index: index,
      body: {
        name: name,
        content: content,
        date: new Date(), //TODO: convert string to date
        brand: 'akşam',
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
      },
    });
    const hits = body.hits.hits;
    return hits.map((item) => item._source);
  }
}
