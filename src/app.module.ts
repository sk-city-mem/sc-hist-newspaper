import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PdfNewsDocModule } from './modules/pdf-news-doc/pdf-news-doc.module';
import { PdfNewsDocOrmModule } from './modules/pdf-news-doc-orm/pdf-news-doc-orm.module';
import { AuthModule } from './modules/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PdfNewsDocModule,
    PdfNewsDocOrmModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'resources'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
