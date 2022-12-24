import { Module, OnModuleInit } from '@nestjs/common';
import { PdfNewsDocController } from './pdf-news-doc.controller';
import { PdfNewsDocService } from './pdf-news-doc.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ES_HOST'),
        auth: {
          username: configService.get('ES_USER'),
          password: configService.get('ES_PASS'),
        },
        maxRetries: 10,
        requestTimeout: 60000,
        tls: { rejectUnauthorized: false },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [PdfNewsDocController],
  providers: [PdfNewsDocService],
  exports: [ElasticsearchModule, PdfNewsDocService],
})
export class PdfNewsDocModule implements OnModuleInit {
  constructor(private readonly pdfNewsDocService: PdfNewsDocService) {}
  public async onModuleInit() {
    await this.pdfNewsDocService.createIndex();
  }
}
