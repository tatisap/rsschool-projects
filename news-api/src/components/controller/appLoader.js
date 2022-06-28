import Loader from './loader';

class AppLoader extends Loader {
    constructor() {
        super('https://newsapi.org/v2/', {
            apiKey: 'ae0779a14dfa4ba681add4b5b8b30fdd',
        });
    }
}

export default AppLoader;
