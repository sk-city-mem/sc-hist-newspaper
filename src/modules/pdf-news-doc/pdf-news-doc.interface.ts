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
}
