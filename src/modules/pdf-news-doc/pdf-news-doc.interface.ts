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
  serialname: string;
  content: string;
  from: string;
  to: string;
  name: string;
}
