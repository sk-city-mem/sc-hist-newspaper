import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

interface PostSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: PostSearchBody;
    }>;
  };
}

export interface PostSearchBody {
  serialname: string;
  content: string;
  date: Date;
  name: string;
  fileURL: URL;
}

export class NewspaperUpdateDTO {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  date: string;
}

export class SearchQuery {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  fuzzy: boolean;

  @IsOptional()
  @IsArray()
  must: string[];

  @IsOptional()
  @IsArray()
  mustNot: string[];

  @IsOptional()
  @IsArray()
  should: string[];

  @IsOptional()
  @IsString()
  serialname: string;
  @IsOptional()
  @IsString()
  content: string;
  @IsOptional()
  @IsString()
  from: string;
  @IsOptional()
  @IsString()
  to: string;
  @IsOptional()
  @IsString()
  name: string;
  @IsOptional()
  @IsNumberString()
  pageSize: number;
  @IsOptional()
  @IsNumberString()
  pageNo: number;
}
