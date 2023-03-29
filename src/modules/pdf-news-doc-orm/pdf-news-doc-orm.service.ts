import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PdfNewsDocService } from '../pdf-news-doc/pdf-news-doc.service';
import { execSync, exec } from 'child_process';
import { unlink, readFileSync } from 'fs';
import { StringifyOptions } from 'querystring';
import { FileUploadService } from '../file-upload/file-upload.service';
import {
  Mutex,
  MutexInterface,
  Semaphore,
  SemaphoreInterface,
  withTimeout,
} from 'async-mutex';

@Injectable()
export class PdfNewsDocOrmService {
  private mutex = new Mutex();
  private processQueue: TrackableRuntimeQueue<OCRRequest> =
    new TrackableRuntimeQueue<OCRRequest>();
  constructor(
    private readonly pdfNewsDocService: PdfNewsDocService,
    private readonly fileUploadService: FileUploadService,
  ) {}
  public async runOCR(oCRRequest: OCRRequest) {
    await exec(
      `docker run --rm  -i --user "$(id -u):$(id -g)" --workdir /data -v "$PWD:/data" scmem-ocrmypdf ` +
        `--tesseract-config tes.cfg --tesseract-pagesegmode 3 -l tur+osd --sidecar tempout/output.txt "${oCRRequest.filePath}" tempout/searchable.pdf`,
      { encoding: 'utf-8' },
      async (error, stdout, stderr) => {
        this.mutex.release();
        const content = readFileSync('tempout/output.txt', 'utf8');

        await this.pdfNewsDocService.addNewspaper(
          oCRRequest.fileName,
          content,
          oCRRequest.fileName,
        );

        const pdf = readFileSync('tempout/searchable.pdf');
        await this.fileUploadService.uploadS3(
          pdf,
          'newspaperbucket',
          oCRRequest.fileName,
        );

        unlink(oCRRequest.filePath, (err) => {
          if (err) {
            throw err;
          }
          Logger.log('Delete File successfully.');
        });
      },
    );
  }

  public async handleOCRRequest(filePath: string, fileName: string) {
    const newOCRRequest = new OCRRequest(
      new Date().toISOString() + fileName,
      filePath,
      fileName,
    );
    this.processQueue.enqueue(newOCRRequest);

    await this.mutex.waitForUnlock();
    await this.mutex.acquire();
    const nextOCRRequest = this.processQueue.dequeue();
    Logger.log('started to ocr', nextOCRRequest);
    await this.runOCR(nextOCRRequest);
  }
}

interface Trackable {
  id: string;
}

class OCRRequest implements Trackable {
  constructor(
    readonly id: string,
    readonly filePath: string,
    readonly fileName: string,
  ) {}
}
interface ITrackableRuntimeQueue<T extends Trackable> {
  enqueue(item: T): void;
  dequeue(): T | undefined;
  size(): number;
}
class TrackableRuntimeQueue<T extends Trackable>
  implements ITrackableRuntimeQueue<T>
{
  private storage: T[] = [];

  constructor(private capacity: number = Infinity) {}

  enqueue(item: T): void {
    if (this.size() === this.capacity) {
      throw Error('Queue has reached max capacity, you cannot add more items');
    }
    this.storage.push(item);
  }
  dequeue(): T | undefined {
    return this.storage.shift();
  }
  size(): number {
    return this.storage.length;
  }

  exist(id: string): boolean {
    return this.storage.some((val: T) => val.id === id);
  }
}
