import { Article, ArticlesResponse, Source, SourcesResponse } from '../../types';
import News from './news/news';
import Sources from './sources/sources';

export class AppView {
    private news: News;
    private sources: Sources;

    constructor() {
        this.news = new News();
        this.sources = new Sources();
    }

    public drawNews(data: ArticlesResponse | undefined): void {
        const values: Article[] | [] = data?.articles ? data?.articles : [];
        this.news.draw(values);
    }

    public drawSources(data: SourcesResponse | undefined): void {
        const values: Source[] | [] = data?.sources ? data?.sources : [];
        this.sources.draw(values);
    }
}

export default AppView;
