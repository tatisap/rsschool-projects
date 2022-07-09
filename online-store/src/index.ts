import './style.scss';
import bikes from './data/bikes.json';
import { Shop } from './components/shop';

const shop: Shop = new Shop(bikes);
shop.init();
