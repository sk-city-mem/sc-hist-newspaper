import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { PdfNewsDocService } from './pdf-news-doc.service';
import { NewspaperUpdateDTO, SearchQuery } from './pdf-news-doc.interface';

@Controller('pdf-news-doc')
export class PdfNewsDocController {
  constructor(private readonly pdfNewsDocService: PdfNewsDocService) {}
  @Get()
  public search(@Query() SearchQuery: SearchQuery) {
    return this.pdfNewsDocService.search(SearchQuery);
  }

  @Patch(':id')
  public update(@Param('id') id, @Body() updateDTO: NewspaperUpdateDTO) {
    return this.pdfNewsDocService.update(id, updateDTO);
  }
}
