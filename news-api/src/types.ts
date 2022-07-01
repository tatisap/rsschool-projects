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

export interface RequestParams {
    endpoint: string;
    options?: SearchParams;
}

export type SearchParams = {
    sources?: string;
};

export type LoaderParams = {
    apiKey: string;
};

export type UrlParams = LoaderParams & SearchParams;

export interface Render<T> {
    (data: T): void;
}

export interface Renderer {
    draw(data: Article[] | Source[]): void;
}

export const nameof = <T>(name: keyof T) => name;
