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

export interface RequestParameters {
  endpoint: string;
  options?: SearchParameters;
}

export type UrlParameters = {
  apiKey: string;
  sources: string;
};

export type LoaderParameters = Pick<UrlParameters, 'apiKey'>;
export type SearchParameters = Partial<Pick<UrlParameters, 'sources'>>;

export interface Render<T> {
  (data: T): void;
}

export interface Renderer {
  draw(data: Article[] | Source[]): void;
}

export const nameof = <T>(name: keyof T): keyof T => name;

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
