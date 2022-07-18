import { BikeShop } from './bike-shop';
import info from '../data/bikes.json';

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

describe('BikeShop', () => {
  it('When render method called', () => {
    shop.render(shop.goods);
    expect(document.body.lastElementChild?.children.length).toBe(12);
  });
  it('When filterByRangeHandler method called with value: [5, 5] and sliderId: "amount"', () => {
    shop.filterByRangeHandler([5, 5], 'amount');
    expect(document.body.lastElementChild?.children.length).toBe(2);
  });
  it('When filterByRangeHandler method called with value: [2013, 2018] and sliderId: "year"', () => {
    shop.filterByRangeHandler([2013, 2018], 'year');
    expect(document.body.lastElementChild?.children.length).toBe(1);
  });
  it('When get sort parameters from localStorage', () => {
    localStorage.setItem('sort-parameters', '["name", "ascending"]');
    const parameters = shop.getParametersFromLocalStorage('sort-parameters');
    expect(parameters).toEqual(['name', 'ascending']);
  });
  it('When resetSettings method is called', () => {
    localStorage.setItem('test-key', 'test-value');
    shop.resetSettings();
    expect(localStorage.length).toBe(0);
  });
});
