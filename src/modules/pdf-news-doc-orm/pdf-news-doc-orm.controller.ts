import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PdfNewsDocOrmService } from './pdf-news-doc-orm.service';
const editFileName = (req, file, callback) => {
  callback(null, file.originalname);
};
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
  ) {
    console.log(file);
    this.pdfNewsDocOrmService.convertPdfToReadablePdf(
      file.path,
      file.originalname,
    );
  }
}
