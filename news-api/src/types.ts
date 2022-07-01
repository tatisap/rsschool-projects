export interface Article {
    readonly source: Source;
    readonly author: string;
    readonly title: string;
    readonly description: string;
    readonly url: string;
    readonly urlToImage: string;
    readonly publishedAt: string;
}

export interface Source {
    readonly id: string;
    readonly name: string;
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

export enum StatusCode {
    Unauthorized = 401,
    NotFound = 404,
}
