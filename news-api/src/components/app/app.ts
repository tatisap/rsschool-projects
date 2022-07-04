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
        (document.querySelector('.sources') as HTMLDivElement).addEventListener('click', (event: MouseEvent) =>
            this.controller.getNews(event, (data: ArticlesResponse) => this.view.render(data))
        );
        this.controller.getSources((data: SourcesResponse) => this.view.render(data));

        (document.querySelector('.sources__button_open') as HTMLButtonElement).addEventListener(
            'click',
            this.controller.openSources
        );
        (document.querySelector('.sources__button_close') as HTMLButtonElement).addEventListener(
            'click',
            this.controller.closeSources
        );
        (document.querySelector('.blackout') as HTMLButtonElement).addEventListener(
            'click',
            this.controller.closeSources
        );
        (document.querySelector('.sources') as HTMLDivElement).addEventListener('click', (event: Event) => {
            const target = event.target as HTMLElement | null;
            if (target?.closest('.source__item')) this.controller.closeSources();
        });
    }
}

export default App;
