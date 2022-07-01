import AppController from '../controller/controller';
import { AppView } from '../view/appView';
import { ArticlesResponse, SourcesResponse } from '../../types';

class App {
    private controller: AppController;
    private view: AppView;

    constructor() {
        this.controller = new AppController();
        this.view = new AppView();
    }

    public start(): void {
        (document.querySelector('.sources') as HTMLDivElement).addEventListener('click', (e: MouseEvent) =>
            this.controller.getNews(e, (data: ArticlesResponse | undefined) => this.view.drawNews(data))
        );
        this.controller.getSources((data: SourcesResponse | undefined) => this.view.drawSources(data));
    }
}

export default App;
