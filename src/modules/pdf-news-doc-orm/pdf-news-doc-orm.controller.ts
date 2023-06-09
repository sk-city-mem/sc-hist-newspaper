import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from '../auth/auth.guard';
import { PdfNewsDocOrmService } from './pdf-news-doc-orm.service';
import { NewspaperInfoDTO } from './pdf-news-doc-orm.dto';
import { NewspaperUpdateDTO } from '../pdf-news-doc/pdf-news-doc.interface';
const editFileName = (req, file, callback) => {
  callback(null, Buffer.from(file.originalname, 'latin1').toString('utf8'));
};
@UseGuards(AuthGuard)
@Controller('pdf-news-doc-orm')
export class PdfNewsDocOrmController {
  constructor(private readonly pdfNewsDocOrmService: PdfNewsDocOrmService) {}
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './temp',
        filename: editFileName,
      }),
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 50000000 }),
          new FileTypeValidator({ fileType: 'pdf' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() newspaperInfoDto: NewspaperInfoDTO,
  ) {
    console.log(file);
    return this.pdfNewsDocOrmService.handleOCRRequest(
      file.path,
      Buffer.from(file.originalname, 'latin1').toString('utf8'),
      newspaperInfoDto.name.toLocaleLowerCase(),
    );
  }

  @Get('find-position-in-queue/:id')
  findPositionInQueue(@Param('id') id: string) {
    return this.pdfNewsDocOrmService.findPositionInQueue(id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  public delete(@Param('id') id: string) {
    return this.pdfNewsDocOrmService.deleteById(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  public update(@Param('id') id, @Body() updateDTO: NewspaperUpdateDTO) {
    return this.pdfNewsDocOrmService.update(id, updateDTO);
  }
}
