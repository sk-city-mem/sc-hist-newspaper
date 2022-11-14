import { Test, TestingModule } from '@nestjs/testing';
import { PdfNewsDocController } from './pdf-news-doc.controller';

describe('PdfNewsDocController', () => {
  let controller: PdfNewsDocController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PdfNewsDocController],
    }).compile();

    controller = module.get<PdfNewsDocController>(PdfNewsDocController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
