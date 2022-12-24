import { Module } from '@nestjs/common';
import { PdfNewsDocModule } from '../pdf-news-doc/pdf-news-doc.module';
import { PdfNewsDocOrmController } from './pdf-news-doc-orm.controller';
import { PdfNewsDocOrmService } from './pdf-news-doc-orm.service';

@Module({
  imports: [PdfNewsDocModule],
  controllers: [PdfNewsDocOrmController],
  providers: [PdfNewsDocOrmService],
})
export class PdfNewsDocOrmModule {}
