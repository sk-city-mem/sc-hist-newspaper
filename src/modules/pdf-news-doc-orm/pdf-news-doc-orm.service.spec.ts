import { Test, TestingModule } from '@nestjs/testing';
import { PdfNewsDocOrmService } from './pdf-news-doc-orm.service';

describe('PdfNewsDocOrmService', () => {
  let service: PdfNewsDocOrmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PdfNewsDocOrmService],
    }).compile();

    service = module.get<PdfNewsDocOrmService>(PdfNewsDocOrmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
