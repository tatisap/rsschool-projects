import { Cart } from './cart';
import { Item } from './item';

export class Shop<T extends Item> {
  protected goods: T[];
  private cart: Cart;

  constructor(goods: T[]) {
    this.goods = goods;
    this.cart = new Cart();
  }
  init(): void {
    this.cart.init();
  }
  render<T extends Item>(goods: T[]): void {
    goods.forEach((item: T): void => item.render());
  }
}
