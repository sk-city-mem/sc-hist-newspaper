import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PdfNewsDocModule } from './modules/pdf-news-doc/pdf-news-doc.module';
import { PdfNewsDocOrmModule } from './modules/pdf-news-doc-orm/pdf-news-doc-orm.module';

@Module({
  imports: [ConfigModule.forRoot(), PdfNewsDocModule, PdfNewsDocOrmModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
