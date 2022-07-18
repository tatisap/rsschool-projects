import { Cart } from './cart';
import { Item } from './item';

export class Shop<T extends Item> {
  public goods: T[];
  protected cart: Cart;

  constructor(goods: T[]) {
    this.goods = goods;
    this.cart = new Cart();
  }
  init(): void {
    this.cart.init();
  }
  render<T extends Item>(goods: T[]): void {
    this.clear();
    goods.forEach((item: T): void => item.render());
  }
  clear(): void {
    (document.querySelector('.cards-list') as HTMLUListElement).innerHTML = '';
  }
}
