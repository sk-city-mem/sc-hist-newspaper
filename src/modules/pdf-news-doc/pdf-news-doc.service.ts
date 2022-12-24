import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { createWorker, PSM } from 'tesseract.js';

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
}
