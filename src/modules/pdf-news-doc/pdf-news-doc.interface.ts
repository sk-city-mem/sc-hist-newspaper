import { IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';

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

export class SearchQuery {
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
