import { Test, TestingModule } from '@nestjs/testing';
import { PdfNewsDocOrmController } from './pdf-news-doc-orm.controller';

describe('PdfNewsDocOrmController', () => {
  let controller: PdfNewsDocOrmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PdfNewsDocOrmController],
    }).compile();

    controller = module.get<PdfNewsDocOrmController>(PdfNewsDocOrmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
