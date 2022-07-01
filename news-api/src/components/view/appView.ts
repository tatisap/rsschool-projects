import { ArticlesResponse, SourcesResponse, nameof } from '../../types';
import NewsRenderer from './news/news';
import SourcesRenderer from './sources/sources';

export class AppView {
    private readonly news: NewsRenderer;
    private readonly sources: SourcesRenderer;

    constructor() {
        this.news = new NewsRenderer();
        this.sources = new SourcesRenderer();
    }

    public render<T extends ArticlesResponse | SourcesResponse>(data: T) {
        if (nameof<ArticlesResponse>('articles') in data) this.news.draw(data.articles);
        if (nameof<SourcesResponse>('sources') in data) this.sources.draw(data.sources);
    }

    // public drawNews(data: ArticlesResponse | undefined): void {
    //     const values: Article[] = data?.articles ? data.articles : [];
    //     this.news.draw(values);
    // }

    // public drawSources(data: SourcesResponse | undefined): void {
    //     const values: Source[] = data?.sources ? data.sources : [];
    //     this.sources.draw(values);
    // }
}

export default AppView;
