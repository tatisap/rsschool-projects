import {
  ArticlesResponse,
  Render,
  LoaderParameters,
  RequestParameters,
  SearchParameters,
  SourcesResponse,
  UrlParameters,
  StatusCode,
  Numbers,
} from '../../types';

class Loader {
  private readonly baseLink: string;
  private readonly options: LoaderParameters;

  constructor(baseLink: string, options: LoaderParameters) {
    this.baseLink = baseLink;
    this.options = options;
  }

  public getResponse(
    { endpoint, options = {} }: RequestParameters,
    callback: Render<ArticlesResponse> | Render<SourcesResponse> = (): void => {
      console.error('No callback for GET response');
    },
  ): void {
    this.load('GET', endpoint, callback, options);
  }

  private errorHandler(response: Response): Response | never {
    if (!response.ok) {
      if (response.status === StatusCode.Unauthorized || response.status === StatusCode.NotFound)
        console.log(`Sorry, but there is ${response.status} error: ${response.statusText}`);
      throw Error(response.statusText);
    }

    return response;
  }

  private makeUrl(options: SearchParameters, endpoint: string): string {
    const urlOptions: Partial<UrlParameters> = { ...this.options, ...options };
    let url = `${this.baseLink}${endpoint}?`;

    Object.entries(urlOptions).forEach(([key, value]: [string, string]) => {
      url += `${key}=${value}&`;
    });

    return url.slice(Numbers.Zero, -Numbers.One);
  }

  private load(
    method: string,
    endpoint: string,
    callback: Render<ArticlesResponse> | Render<SourcesResponse>,
    options: SearchParameters = {},
  ) {
    fetch(this.makeUrl(options, endpoint), { method })
      .then(this.errorHandler)
      .then((response: Response) => response.json())
      .then((data?: ArticlesResponse & SourcesResponse): void => {
        if (!data) return;
        callback(data);
      })
      .catch((error: Error) => console.error(error));
  }
}

export default Loader;
