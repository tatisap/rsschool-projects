import './style.scss';
import renderPage from './ui/ui-utilities/render-page';
import getPageInfo from './utilities/get-page-info';

getPageInfo().then(renderPage);
