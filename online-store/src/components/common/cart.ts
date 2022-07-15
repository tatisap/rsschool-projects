import { MAX_ITEMS_IN_CART, WARNING_MESSAGE_TEXT } from '../../constants/constants';
import { Numbers } from '../../types/enums';
import { WarningMessage } from './warning-message';

export class Cart {
  private readonly counterElement: HTMLSpanElement;
  private readonly htmlElement: HTMLDivElement;
  private readonly warningMessage: WarningMessage;
  private counter: number;

  constructor() {
    this.counter = Numbers.Zero;
    this.htmlElement = document.querySelector('.shopping-cart') as HTMLDivElement;
    this.counterElement = document.querySelector('.shopping-cart__counter') as HTMLSpanElement;
    this.warningMessage = new WarningMessage(WARNING_MESSAGE_TEXT.fullCartText);
  }
  init(): void {
    this.warningMessage.init();
    this.htmlElement.addEventListener('add-to-cart', (): void => this.add());
    this.htmlElement.addEventListener('remove-from-cart', (): void => this.remove());
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
}
