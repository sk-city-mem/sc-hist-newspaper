import { Module } from '@nestjs/common';
import { PdfNewsDocModule } from '../pdf-news-doc/pdf-news-doc.module';
import { FileUploadService } from './file-upload.service';

@Module({
  imports: [FileUploadModule],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
