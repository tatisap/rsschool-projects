import { Cart } from './cart';
import { Item } from './item';

export class Shop<T extends Item> {
  public goods: T[];
  protected readonly cart: Cart;

  constructor(goods: T[]) {
    this.goods = goods;
    this.cart = new Cart();
  }
  public init(): void {
    this.cart.init();
  }
  public render<T extends Item>(goods: T[]): void {
    this.clear();
    goods.forEach((goodsItem: T): void => goodsItem.render());
  }
  private clear(): void {
    (document.querySelector('.cards-list') as HTMLUListElement).innerHTML = '';
  }
}
