import {
    ArticlesResponse,
    Render,
    LoaderParams,
    RequestParams,
    SearchParams,
    SourcesResponse,
    UrlParams,
    StatusCode,
    Endpoint,
} from '../../types';

class Loader {
    private readonly baseLink: string;
    private readonly options: LoaderParams;

    constructor(baseLink: string, options: LoaderParams) {
        this.baseLink = baseLink;
        this.options = options;
    }

    public getResponse(
        { endpoint, options = {} }: RequestParams,
        callback: Render<ArticlesResponse> | Render<SourcesResponse> = (): void => {
            console.error('No callback for GET response');
        }
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

    private makeUrl(options: SearchParams, endpoint: Endpoint): string {
        const urlOptions: Partial<UrlParams> = { ...this.options, ...options };
        let url = `${this.baseLink}${endpoint}?`;

        Object.entries(urlOptions).forEach(([key, value]: [string, string]) => {
            url += `${key}=${value}&`;
        });

        return url.slice(0, -1);
    }

    private load(
        method: string,
        endpoint: Endpoint,
        callback: Render<ArticlesResponse> | Render<SourcesResponse>,
        options: SearchParams = {}
    ) {
        fetch(this.makeUrl(options, endpoint), { method })
            .then(this.errorHandler)
            .then((response: Response) => response.json())
            .then((data: (ArticlesResponse & SourcesResponse) | undefined): void => {
                if (data === undefined) return;
                callback(data);
            })
            .catch((error: Error) => console.error(error));
    }
}

export default Loader;
