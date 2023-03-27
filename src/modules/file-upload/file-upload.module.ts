import { Module, OnModuleInit } from '@nestjs/common';
import { S3, Endpoint } from 'aws-sdk';
import { PdfNewsDocModule } from '../pdf-news-doc/pdf-news-doc.module';
import { FileUploadService } from './file-upload.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [FileUploadModule, ConfigModule],
  providers: [
    {
      useFactory: (configService: ConfigService) => {
        return new FileUploadService(
          new S3({
            region: 'eu-west-1',
            accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
            endpoint: new Endpoint(configService.get('AWS_ENDPOINT')),
            s3ForcePathStyle: true,
          }),
        );
      },
      provide: FileUploadService,
      inject: [ConfigService],
    },
  ],
  exports: [FileUploadService],
})
export class FileUploadModule implements OnModuleInit {
  constructor(private readonly fileUploadService: FileUploadService) {}
  public async onModuleInit() {
    await this.fileUploadService.createBucket('newspaperbucket');
  }
}
