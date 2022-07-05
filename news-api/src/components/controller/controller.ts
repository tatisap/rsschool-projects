import { ENDPOINTS } from '../../constants';
import { IArticlesResponse, IRender, ISourcesResponse } from '../../types';
import AppLoader from './appLoader';
import { Numbers } from '../../enums';

class AppController extends AppLoader {
  public getSources(callback: IRender<ISourcesResponse>): void {
    super.getResponse(
      {
        endpoint: ENDPOINTS.sources,
      },
      callback,
    );
  }

  public getNews(event: Event, callback: IRender<IArticlesResponse>): void {
    let target = event.target as HTMLElement | null;
    const newsContainer = event.currentTarget as HTMLElement | null;
    if (newsContainer === null) return;

    while (target !== newsContainer) {
      if (target === null) return;
      if (target.classList.contains('source__item')) {
        const sourceId: string | null = target.getAttribute('data-source-id');
        if (sourceId === null) return;
        if (newsContainer.getAttribute('data-source') !== sourceId) {
          newsContainer.setAttribute('data-source', sourceId);
          super.getResponse(
            {
              endpoint: ENDPOINTS.everything,
              options: {
                sources: sourceId,
              },
            },
            callback,
          );
        }
        return;
      }
      target = target.parentElement;
    }
  }

  public openSources(): void {
    (document.querySelector('.sources') as HTMLDivElement).classList.add('open');
    (document.querySelector('.blackout') as HTMLDivElement).classList.add('on');
  }

  public closeSources(): void {
    const sources = document.querySelector('.sources') as HTMLDivElement;
    sources.classList.remove('open');
    sources.scrollTop = Numbers.Zero;
    (document.querySelector('.blackout') as HTMLDivElement).classList.remove('on');
  }
}

export default AppController;
