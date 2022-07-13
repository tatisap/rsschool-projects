import { Item } from './item';

export class Shop<T extends Item> {
  protected goods: T[];

  constructor(goods: T[]) {
    this.goods = goods;
  }
  init(): void {
    this.render(this.goods);
  }
  render<T extends Item>(goods: T[]): void {
    goods.forEach((item: T) => item.render());
  }
}
