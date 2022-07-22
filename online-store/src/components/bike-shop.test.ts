import { BikeShop } from './bike-shop';
import info from '../data/bikes.json';
import { Numbers } from '../types/enums';
import {
  DEFAULT_SORT_PARAMETERS,
  LOCAL_STORAGE_KEYS,
  SLIDER_ELEMENTS_ID,
} from '../constants/constants';
import { RangeProperty } from '../types/types';

document.body.innerHTML = `
  <div class="shopping-cart">
    <span class="shopping-cart__counter">0</span>
  </div>
  <div id="amount-start" class="slider-value">1</div>
  <div id="amount"></div>
  <div id="amount-end" class="slider-value">10</div>
  <div id="year-start" class="slider-value">2010</div>
  <div id="year"></div>
  <div id="year-end" class="slider-value">2022</div>
  <ul class="cards-list"></ul>
`;

const shop: BikeShop = new BikeShop(info);

describe('BikeShop behavior', () => {
  it('Should render bikes on the page', () => {
    shop.render(shop.goods);
    expect(document.body.lastElementChild?.children.length).toBe(info.length);
  });
  it('Should render filtered bikes by amount 5', () => {
    shop.filterByRangeHandler([5, 5], SLIDER_ELEMENTS_ID.amountSlider.containerId as RangeProperty);
    expect(document.body.lastElementChild?.children.length).toBe(Numbers.Two);
  });
  it('Should render filtered bikes by year from 2013 to 2018', () => {
    shop.filterByRangeHandler(
      [2013, 2018],
      SLIDER_ELEMENTS_ID.yearSlider.containerId as RangeProperty
    );
    expect(document.body.lastElementChild?.children.length).toBe(Numbers.One);
  });
  it('Should get sort parameters from localStorage', () => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.sortParameters,
      JSON.stringify(DEFAULT_SORT_PARAMETERS)
    );
    const parameters = shop.localStorageManager.getParametersFromLocalStorage(
      LOCAL_STORAGE_KEYS.sortParameters
    );
    expect(parameters).toEqual(DEFAULT_SORT_PARAMETERS);
  });
});
