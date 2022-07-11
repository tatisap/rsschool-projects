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
    (document.querySelector('.form') as HTMLFormElement).addEventListener(
      'submit',
      (event: Event) => this.search(event)
    );
  }
  render<T extends Item>(goods: T[]): void {
    goods.forEach((item: T) => item.render());
  }
  search(event: Event): void {
    event.preventDefault();

    const searchValue: string = (event.target as HTMLFormElement).search.value;
    if (searchValue === '') return;
    (document.querySelector('.cards-list') as HTMLUListElement).innerHTML = '';
    console.log(this);
    const foundGoods: Item[] = this.searcher.getGoodsByName<Item>(searchValue, this.goods);
    console.log(foundGoods);
    this.render(foundGoods);
  }
}

export class BikeShop extends Shop<Bike> {
  constructor(goodsInfo: IBike[]) {
    const goods: Bike[] = goodsInfo.map((item: IBike) => new Bike(item));
    super(goods);
  }
}
