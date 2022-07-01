import {
    ArticlesResponse,
    Render,
    LoaderParams,
    RequestParams,
    SearchParams,
    SourcesResponse,
    UrlParams,
} from '../../types';

class Loader {
    private baseLink: string;
    private options: LoaderParams;

    constructor(baseLink: string, options: LoaderParams) {
        this.baseLink = baseLink;
        this.options = options;
    }

    public getResp(
        { endpoint, options = {} }: RequestParams,
        callback: Render<ArticlesResponse> | Render<SourcesResponse> = (): void => {
            console.error('No callback for GET response');
        }
    ): void {
        this.load('GET', endpoint, callback, options);
    }

    private errorHandler(res: Response): Response | never {
        if (!res.ok) {
            if (res.status === 401 || res.status === 404)
                console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
            throw Error(res.statusText);
        }

        return res;
    }

    private makeUrl(options: SearchParams, endpoint: string): string {
        const urlOptions: UrlParams = { ...this.options, ...options };
        let url = `${this.baseLink}${endpoint}?`;

        Object.entries(urlOptions).forEach(([key, value]: [string, string]) => {
            url += `${key}=${value}&`;
        });

        return url.slice(0, -1);
    }

    private load(
        method: string,
        endpoint: string,
        callback: Render<ArticlesResponse> | Render<SourcesResponse>,
        options: SearchParams = {}
    ) {
        fetch(this.makeUrl(options, endpoint), { method })
            .then(this.errorHandler)
            .then((res: Response) => res.json())
            .then((data: (ArticlesResponse & SourcesResponse) | undefined): void => callback(data))
            .catch((err: Error) => console.error(err));
    }
}

export default Loader;
