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
}

export default AppView;
