import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PdfNewsDocService } from './pdf-news-doc.service';
import { NewspaperUpdateDTO, SearchQuery } from './pdf-news-doc.interface';
import { AuthGuard } from '../auth/auth.guard';

@Controller('pdf-news-doc')
export class PdfNewsDocController {
  constructor(private readonly pdfNewsDocService: PdfNewsDocService) {}
  @Get()
  public search(@Query() SearchQuery: SearchQuery) {
    return this.pdfNewsDocService.search(SearchQuery);
  }
}
