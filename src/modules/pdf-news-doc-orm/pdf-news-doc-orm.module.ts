import { Module } from '@nestjs/common';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { PdfNewsDocModule } from '../pdf-news-doc/pdf-news-doc.module';
import { PdfNewsDocOrmController } from './pdf-news-doc-orm.controller';
import { PdfNewsDocOrmService } from './pdf-news-doc-orm.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PdfNewsDocModule,
    FileUploadModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get('SERVER_SECRET'),
        signOptions: { expiresIn: '60s' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [PdfNewsDocOrmController],
  providers: [PdfNewsDocOrmService],
})
export class PdfNewsDocOrmModule {}
