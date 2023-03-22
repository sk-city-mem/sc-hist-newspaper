import { Controller, Get, Query } from '@nestjs/common';
import { PdfNewsDocService } from './pdf-news-doc.service';

@Controller('pdf-news-doc')
export class PdfNewsDocController {
  constructor(private readonly pdfNewsDocService: PdfNewsDocService) {}
  @Get()
  public search(
    @Query('name') name: string,
    @Query('content') content: string,
  ) {
    return this.pdfNewsDocService.search(name);
  }
}
