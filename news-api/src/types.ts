export interface Article {
    source: Source;
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
}

export interface Source {
    id: string;
    name: string;
}

export interface ArticlesResponse {
    articles: Article[];
}

export interface SourcesResponse {
    sources: Source[];
}
