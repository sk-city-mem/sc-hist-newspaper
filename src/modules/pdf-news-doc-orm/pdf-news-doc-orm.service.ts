import { Injectable, OnModuleInit } from '@nestjs/common';
import { createWorker, PSM } from 'tesseract.js';
import { PdfNewsDocService } from '../pdf-news-doc/pdf-news-doc.service';

@Injectable()
export class PdfNewsDocOrmService implements OnModuleInit {
  private readonly tesseractWorker = createWorker();
  constructor(private readonly pdfNewsDocService: PdfNewsDocService) {}
  public async onModuleInit() {
    await this.tesseractWorker.load();
    await this.tesseractWorker.loadLanguage('tur+osd');
    await this.tesseractWorker.initialize('tur+osd');
    await this.tesseractWorker.setParameters({
      tessedit_pageseg_mode: PSM.AUTO_OSD,
      tessedit_char_whitelist: 
    });
  }

  public async analyseImage(){
    const { data: { text } } = await worker.recognize('foo.jpg');
    console.log("here")
    const { data } = await worker.getPDF("a")
    fs.writeFileSync("tesseract-ocr-result.pdf", Buffer.from(data));
    console.log(text);
    await worker.terminate();
  }
}
