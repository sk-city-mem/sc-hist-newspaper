import { Test, TestingModule } from '@nestjs/testing';
import { PdfNewsDocService } from './pdf-news-doc.service';

describe('PdfNewsDocService', () => {
  let service: PdfNewsDocService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PdfNewsDocService],
    }).compile();

    service = module.get<PdfNewsDocService>(PdfNewsDocService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
