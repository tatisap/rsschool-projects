import { IBike } from '../types/types';
import { Item } from './item';

export class Shop {
  private goods: Item[];

  constructor(goods: IBike[]) {
    this.goods = goods.map((item: IBike) => new Item(item));
  }

  init(): void {
    this.goods.forEach((item: Item) => item.card.render());
  }
}
