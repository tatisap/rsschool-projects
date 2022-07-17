import { MAX_ITEMS_IN_CART, WARNING_MESSAGE_TEXT } from '../../constants/constants';
import { Numbers } from '../../types/enums';
import { IShoppingList } from '../../types/types';
import { WarningMessage } from './warning-message';

export class Cart {
  private readonly counterElement: HTMLSpanElement;
  private readonly htmlElement: HTMLDivElement;
  private readonly warningMessage: WarningMessage;
  public counter: number;

  constructor() {
    this.counter = localStorage.getItem('cart-counter')
      ? JSON.parse(localStorage.getItem('cart-counter') as string)
      : Numbers.Zero;
    this.htmlElement = document.querySelector('.shopping-cart') as HTMLDivElement;
    this.counterElement = document.querySelector('.shopping-cart__counter') as HTMLSpanElement;
    this.warningMessage = new WarningMessage(WARNING_MESSAGE_TEXT.fullCartText);
  }
  init(): void {
    this.counterElement.textContent = String(this.counter);
    this.htmlElement.addEventListener('add-to-cart', (): void => this.add());
    this.htmlElement.addEventListener('remove-from-cart', (): void => this.remove());
    this.htmlElement.addEventListener('update-cart', (event: Event): void =>
      this.update(event as CustomEvent)
    );
    this.htmlElement.addEventListener('overflow', (): void => this.showMessage());
  }
  add(): void {
    if (this.isFull()) return;
    this.counterElement.textContent = String(++this.counter);
  }
  remove(): void {
    this.counterElement.textContent = String(--this.counter);
  }
  isFull(): boolean {
    return this.counter === MAX_ITEMS_IN_CART;
  }
  showMessage(): void {
    this.warningMessage.open();
  }
  update(event: CustomEvent): void {
    const shoppingList: IShoppingList = localStorage.getItem('shopping-list')
      ? JSON.parse(localStorage.getItem('shopping-list') as string)
      : {};
    if (event.detail.quantity) {
      shoppingList[`${event.detail.itemId}`] = event.detail.quantity;
    } else {
      delete shoppingList[`${event.detail.itemId}`];
    }
    localStorage.setItem('shopping-list', JSON.stringify(shoppingList));
  }
}
