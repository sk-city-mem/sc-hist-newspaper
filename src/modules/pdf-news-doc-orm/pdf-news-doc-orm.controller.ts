import { Controller, Post } from '@nestjs/common';
import { PdfNewsDocOrmService } from './pdf-news-doc-orm.service';

@Controller('pdf-news-doc-orm')
export class PdfNewsDocOrmController {
  constructor(private readonly pdfNewsDocOrmService: PdfNewsDocOrmService) {}
  @Post('/convert')
  public convert() {
    this.pdfNewsDocOrmService.convertPdfToReadablePdf();
  }
}
