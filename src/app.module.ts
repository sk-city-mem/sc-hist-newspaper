import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PdfNewsDocModule } from './modules/pdf-news-doc/pdf-news-doc.module';

@Module({
  imports: [ConfigModule.forRoot(), PdfNewsDocModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
