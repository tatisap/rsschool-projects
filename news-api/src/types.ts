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

export type UrlParams = {
    apiKey: string;
    sources: string;
};

export type LoaderParams = Pick<UrlParams, 'apiKey'>;
export type SearchParams = Partial<Pick<UrlParams, 'sources'>>;

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

export enum Numbers {
    Zero = 0,
    One = 1,
    Two = 2,
    Ten = 10,
}
