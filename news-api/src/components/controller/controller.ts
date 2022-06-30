import { ArticlesResponse, Drawer, SourcesResponse } from '../../types';
import AppLoader from './appLoader';

class AppController extends AppLoader {
    public getSources(callback: Drawer<SourcesResponse>) {
        super.getResp(
            {
                endpoint: 'sources',
            },
            callback
        );
    }

    public getNews(e: Event, callback: Drawer<ArticlesResponse>) {
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
}

export default AppController;
