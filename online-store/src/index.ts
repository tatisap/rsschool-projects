import './style.scss';
import bikes from './data/bikes.json';
import { BikeShop } from './components/shop';
import { IBike } from './types/types';

const shop: BikeShop = new BikeShop(bikes as IBike[]);
shop.init();
