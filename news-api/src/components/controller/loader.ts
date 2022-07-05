import {
  IArticlesResponse,
  IRender,
  LoaderParameters,
  IRequestParameters,
  SearchParameters,
  ISourcesResponse,
  UrlParameters,
} from '../../types';
import { StatusCode, Numbers } from '../../enums';

class Loader {
  private readonly baseLink: string;
  private readonly options: LoaderParameters;

  constructor(baseLink: string, options: LoaderParameters) {
    this.baseLink = baseLink;
    this.options = options;
  }

  public getResponse(
    { endpoint, options = {} }: IRequestParameters,
    callback: IRender<IArticlesResponse> | IRender<ISourcesResponse> = (): void => {
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

    Object.entries(urlOptions).forEach(([key, value]: [string, string]): void => {
      url += `${key}=${value}&`;
    });
    return url.slice(Numbers.Zero, -Numbers.One);
  }

  private load(
    method: string,
    endpoint: string,
    callback: IRender<IArticlesResponse> | IRender<ISourcesResponse>,
    options: SearchParameters = {},
  ): void {
    fetch(this.makeUrl(options, endpoint), { method })
      .then(this.errorHandler)
      .then((response: Response): Promise<IArticlesResponse & ISourcesResponse> => response.json())
      .then((data: IArticlesResponse & ISourcesResponse): void => callback(data))
      .catch((error: Error): void => console.error(error));
  }
}

export default Loader;
