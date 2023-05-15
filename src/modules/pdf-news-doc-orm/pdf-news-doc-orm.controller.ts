import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
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
const editFileName = (req, file, callback) => {
  callback(null, file.originalname);
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
      file.originalname,
      newspaperInfoDto.name.toLocaleLowerCase(),
    );
  }

  @Get('find-position-in-queue/:id')
  findPositionInQueue(@Param('id') id: string) {
    return this.pdfNewsDocOrmService.findPositionInQueue(id);
  }
}
