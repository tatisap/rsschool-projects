export interface IArticle {
  readonly source: ISource;
  readonly author: string;
  readonly title: string;
  readonly description: string;
  readonly url: string;
  readonly urlToImage: string;
  readonly publishedAt: string;
}

export interface ISource {
  readonly id: string;
  readonly name: string;
}

export interface IArticlesResponse {
  articles: IArticle[];
}

export interface ISourcesResponse {
  sources: ISource[];
}

export interface IRequestParameters {
  endpoint: string;
  options?: SearchParameters;
}

export type UrlParameters = {
  apiKey: string;
  sources: string;
};

export type LoaderParameters = Pick<UrlParameters, 'apiKey'>;
export type SearchParameters = Partial<Pick<UrlParameters, 'sources'>>;

export interface IRender<T> {
  (data: T): void;
}

export interface IRenderer {
  draw(data: IArticle[] | ISource[]): void;
}

export const nameof = <T>(name: keyof T): keyof T => name;
