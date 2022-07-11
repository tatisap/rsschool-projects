import { IBike } from '../types/types';
import { Searcher } from './actions/search';
import { Bike, Item } from './item';

export class Shop<T extends Item> {
  private searcher: Searcher;
  public goods: T[];

  constructor(goods: T[]) {
    this.goods = goods;
    this.searcher = new Searcher();
  }
  init(): void {
    this.render(this.goods);
    (document.querySelector('.search') as HTMLFormElement).addEventListener(
      'input',
      (event: Event) => this.search(event)
    );
  }
  render<T extends Item>(goods: T[]): void {
    goods.forEach((item: T) => item.render());
  }
  search(event: Event): void {
    const searchValue: string = (event.target as HTMLFormElement).value.trim();

    const foundGoods: Item[] = this.searcher.getGoodsByName<Item>(searchValue, this.goods);
    (document.querySelector('.cards-list') as HTMLUListElement).innerHTML = '';
    if (foundGoods.length !== 0) {
      this.render(foundGoods);
    } else {
      (document.querySelector('.cards-list') as HTMLUListElement).append('No results');
    }
  }
}

export class BikeShop extends Shop<Bike> {
  constructor(goodsInfo: IBike[]) {
    const goods: Bike[] = goodsInfo.map((item: IBike) => new Bike(item));
    super(goods);
  }
}
