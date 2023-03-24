import { Controller, Get, Query } from '@nestjs/common';
import { PdfNewsDocService } from './pdf-news-doc.service';
import { SearchQuery } from './pdf-news-doc.interface';

@Controller('pdf-news-doc')
export class PdfNewsDocController {
  constructor(private readonly pdfNewsDocService: PdfNewsDocService) {}
  @Get()
  public search(@Query() SearchQuery: SearchQuery) {
    return this.pdfNewsDocService.search(SearchQuery);
  }
}
