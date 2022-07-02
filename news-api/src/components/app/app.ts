import AppController from '../controller/controller';
import { AppView } from '../view/appView';
import { ArticlesResponse, SourcesResponse } from '../../types';

class App {
    private readonly controller: AppController;
    private readonly view: AppView;

    constructor() {
        this.controller = new AppController();
        this.view = new AppView();
    }

    public start(): void {
        (document.querySelector('.sources') as HTMLDivElement).addEventListener('click', (e: MouseEvent) =>
            this.controller.getNews(e, (data: ArticlesResponse) => this.view.render(data))
        );
        this.controller.getSources((data: SourcesResponse) => this.view.render(data));

        (document.querySelector('.open-sources') as HTMLButtonElement).addEventListener(
            'click',
            this.controller.openSources
        );
        (document.querySelector('.close-sources') as HTMLButtonElement).addEventListener(
            'click',
            this.controller.closeSources
        );
        (document.querySelector('.blackout') as HTMLButtonElement).addEventListener(
            'click',
            this.controller.closeSources
        );
        (document.querySelector('.sources') as HTMLDivElement).addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement | null;
            if (target?.closest('.source__item')) this.controller.closeSources();
        });
    }
}

export default App;
