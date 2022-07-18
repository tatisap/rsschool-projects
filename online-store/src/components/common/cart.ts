import {
  CUSTOM_EVENT_NAMES,
  LOCAL_STORAGE_KEYS,
  MAX_ITEMS_IN_CART,
  WARNING_MESSAGE_TEXT,
} from '../../constants/constants';
import { Numbers } from '../../types/enums';
import { IShoppingList, IShoppingListItem } from '../../types/types';
import { WarningMessage } from './warning-message';

export class Cart {
  private readonly counterElement: HTMLSpanElement;
  private readonly htmlElement: HTMLDivElement;
  private readonly warningMessage: WarningMessage;
  public counter: number;

  constructor() {
    this.counter = localStorage.getItem(LOCAL_STORAGE_KEYS.cartCounter)
      ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.cartCounter) as string)
      : Numbers.Zero;
    this.htmlElement = document.querySelector('.shopping-cart') as HTMLDivElement;
    this.counterElement = document.querySelector('.shopping-cart__counter') as HTMLSpanElement;
    this.warningMessage = new WarningMessage(WARNING_MESSAGE_TEXT.fullCartText);
  }
  public init(): void {
    this.counterElement.textContent = String(this.counter);
    this.htmlElement.addEventListener(CUSTOM_EVENT_NAMES.addToCart, (): void => this.add());
    this.htmlElement.addEventListener(CUSTOM_EVENT_NAMES.removeFromCart, (): void => this.remove());
    this.htmlElement.addEventListener(CUSTOM_EVENT_NAMES.updateCart, (event: Event): void =>
      this.update(event as CustomEvent)
    );
    this.htmlElement.addEventListener(CUSTOM_EVENT_NAMES.overflow, (): void => this.showMessage());
  }
  public add(): void {
    if (this.isFull()) return;
    this.counterElement.textContent = String(++this.counter);
  }
  public remove(): void {
    this.counterElement.textContent = String(--this.counter);
  }
  public isFull(): boolean {
    return this.counter === MAX_ITEMS_IN_CART;
  }
  private showMessage(): void {
    this.warningMessage.open();
  }
  public update(event: CustomEvent<IShoppingListItem>): void {
    const shoppingList: IShoppingList = localStorage.getItem(LOCAL_STORAGE_KEYS.shoppingList)
      ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.shoppingList) as string)
      : {};
    if (event.detail.quantity) {
      shoppingList[`${event.detail.itemId}`] = event.detail.quantity;
    } else {
      delete shoppingList[`${event.detail.itemId}`];
    }
    localStorage.setItem(LOCAL_STORAGE_KEYS.shoppingList, JSON.stringify(shoppingList));
  }
}
