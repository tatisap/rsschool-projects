import { IArticlesResponse, ISourcesResponse, nameof } from '../../types';
import NewsRenderer from './news/news';
import SourcesRenderer from './sources/sources';

export class AppView {
  private readonly news: NewsRenderer;
  private readonly sources: SourcesRenderer;

  constructor() {
    this.news = new NewsRenderer();
    this.sources = new SourcesRenderer();
  }

  public render<T extends IArticlesResponse | ISourcesResponse>(data: T): void {
    if (nameof<IArticlesResponse>('articles') in data) this.news.draw(data.articles);
    if (nameof<ISourcesResponse>('sources') in data) this.sources.draw(data.sources);
  }
}

export default AppView;
