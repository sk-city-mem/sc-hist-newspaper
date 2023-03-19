import { Injectable, OnModuleInit } from '@nestjs/common';
import { PdfNewsDocService } from '../pdf-news-doc/pdf-news-doc.service';
import { execSync } from 'child_process';

@Injectable()
export class PdfNewsDocOrmService {
  constructor(private readonly pdfNewsDocService: PdfNewsDocService) {}
  public convertPdfToReadablePdf() {
    const output = execSync(
      'docker run --rm  -i --user "$(id -u):$(id -g)" --workdir /data -v "$PWD:/data" scmem-ocrmypdf ' +
        '--tesseract-config tes.cfg --tesseract-pagesegmode 3 -l tur+osd --sidecar output.txt "26 Haziran 1997 Perşembe Textless.pdf" lastout.pdf',
      { encoding: 'utf-8' },
    );

    console.log('output', output);
  }
}
