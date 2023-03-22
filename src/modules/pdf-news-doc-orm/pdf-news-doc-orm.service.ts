import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PdfNewsDocService } from '../pdf-news-doc/pdf-news-doc.service';
import { execSync } from 'child_process';
import { unlink, readFileSync } from 'fs';
import { StringifyOptions } from 'querystring';

@Injectable()
export class PdfNewsDocOrmService {
  constructor(private readonly pdfNewsDocService: PdfNewsDocService) {}
  public convertPdfToReadablePdf(filePath: string, fileName: string) {
    const output = execSync(
      `docker run --rm  -i --user "$(id -u):$(id -g)" --workdir /data -v "$PWD:/data" scmem-ocrmypdf ` +
        `--tesseract-config tes.cfg --tesseract-pagesegmode 3 -l tur+osd --sidecar tempout/output.txt "${filePath}" tempout/searhable.pdf`,
      { encoding: 'utf-8' },
    );
    Logger.log(output);
    unlink(filePath, (err) => {
      if (err) {
        throw err;
      }
      Logger.log('Delete File successfully.');
    });

    const content = readFileSync('tempout/output.txt', 'utf8');

    this.pdfNewsDocService.addNewspaper(fileName, content);
  }
}
