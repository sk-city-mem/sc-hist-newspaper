import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PdfNewsDocService } from '../pdf-news-doc/pdf-news-doc.service';
import { execSync } from 'child_process';
import { unlink, readFileSync } from 'fs';
import { StringifyOptions } from 'querystring';
import { FileUploadService } from '../file-upload/file-upload.service';

@Injectable()
export class PdfNewsDocOrmService {
  constructor(
    private readonly pdfNewsDocService: PdfNewsDocService,
    private readonly fileUploadService: FileUploadService,
  ) {}
  public async convertPdfToReadablePdf(filePath: string, fileName: string) {
    /*const output = execSync(
      `docker run --rm  -i --user "$(id -u):$(id -g)" --workdir /data -v "$PWD:/data" scmem-ocrmypdf ` +
        `--tesseract-config tes.cfg --tesseract-pagesegmode 3 -l tur+osd --sidecar tempout/output.txt "${filePath}" tempout/searchable.pdf`,
      { encoding: 'utf-8' },
    );
    Logger.log(output);*/

    const content = readFileSync('tempout/output.txt', 'utf8');

    await this.pdfNewsDocService.addNewspaper(fileName, content, fileName);

    const pdf = readFileSync('tempout/searchable.pdf');
    await this.fileUploadService.uploadS3(pdf, 'newspaperbucket', fileName);

    unlink(filePath, (err) => {
      if (err) {
        throw err;
      }
      Logger.log('Delete File successfully.');
    });
  }
}

function toBuffer(arrayBuffer) {
  const buffer = Buffer.alloc(arrayBuffer.byteLength);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i];
  }
  return buffer;
}
