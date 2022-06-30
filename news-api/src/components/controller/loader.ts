import {
    ArticlesResponse,
    Drawer,
    LoaderParams,
    RequestParams,
    SearchParams,
    SourcesResponse,
    UrlParams,
} from '../../types';

class Loader {
    baseLink: string;
    options: LoaderParams;

    constructor(baseLink: string, options: LoaderParams) {
        this.baseLink = baseLink;
        this.options = options;
    }

    getResp(
        { endpoint, options = {} }: RequestParams,
        callback: Drawer<ArticlesResponse> | Drawer<SourcesResponse> = () => {
            console.error('No callback for GET response');
        }
    ): void {
        this.load('GET', endpoint, callback, options);
    }

    errorHandler(res: Response): Response | never {
        if (!res.ok) {
            if (res.status === 401 || res.status === 404)
                console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
            throw Error(res.statusText);
        }

        return res;
    }

    makeUrl(options: SearchParams, endpoint: string) {
        const urlOptions: UrlParams = { ...this.options, ...options };
        let url = `${this.baseLink}${endpoint}?`;

        Object.entries(urlOptions).forEach(([key, value]) => {
            url += `${key}=${value}&`;
        });

        return url.slice(0, -1);
    }

    load(
        method: string,
        endpoint: string,
        callback: Drawer<ArticlesResponse> | Drawer<SourcesResponse>,
        options: SearchParams = {}
    ) {
        fetch(this.makeUrl(options, endpoint), { method })
            .then(this.errorHandler)
            .then((res) => res.json())
            .then((data) => callback(data))
            .catch((err) => console.error(err));
    }
}

export default Loader;
