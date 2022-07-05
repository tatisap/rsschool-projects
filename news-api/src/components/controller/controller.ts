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
    let target = event.target as HTMLElement;
    const newsContainer = event.currentTarget as HTMLElement;

    while (target !== newsContainer) {
      if (target.classList.contains('source__item')) {
        const sourceId: string = target.getAttribute('data-source-id') as string;
        if (sourceId && newsContainer.getAttribute('data-source') !== sourceId) {
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
      target = target.parentElement as HTMLElement;
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
