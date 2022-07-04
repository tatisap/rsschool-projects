import { ArticlesResponse, Render, SourcesResponse } from '../../types';
import AppLoader from './appLoader';

class AppController extends AppLoader {
    public getSources(callback: Render<SourcesResponse>): void {
        super.getResp(
            {
                endpoint: 'sources',
            },
            callback
        );
    }

    public getNews(e: Event, callback: Render<ArticlesResponse>): void {
        let target = e.target as HTMLElement | null;
        const newsContainer = e.currentTarget as HTMLElement | null;
        if (newsContainer === null) return;

        while (target !== newsContainer) {
            if (target === null) return;
            if (target.classList.contains('source__item')) {
                const sourceId: string | null = target.getAttribute('data-source-id');
                if (sourceId === null) return;
                if (newsContainer.getAttribute('data-source') !== sourceId) {
                    newsContainer.setAttribute('data-source', sourceId);
                    super.getResp(
                        {
                            endpoint: 'everything',
                            options: {
                                sources: sourceId,
                            },
                        },
                        callback
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
        sources.scrollTop = 0;
        (document.querySelector('.blackout') as HTMLDivElement).classList.remove('on');
    }
}

export default AppController;
