import {
  CUSTOM_EVENT_NAMES,
  MAX_ITEMS_IN_CART,
  STYLE_DISPLAY_VALUE,
} from '../../constants/constants';
import { Numbers } from '../../types/enums';

export class ButtonWithCounter {
  private readonly mainButton: HTMLButtonElement;
  private readonly addButton: HTMLButtonElement;
  private readonly removeButton: HTMLButtonElement;
  private readonly counterElement: HTMLDivElement;
  private readonly maxValue: number;
  public readonly wrapper: HTMLDivElement;
  private counter: number;

  constructor(content: string, maxValue: number, initialValue = Numbers.Zero) {
    const wrapper: HTMLDivElement = document.createElement('div');
    wrapper.classList.add('button-with-counter');

    const mainButton: HTMLButtonElement = document.createElement('button');
    mainButton.classList.add('button-with-counter__main');
    mainButton.textContent = content;

    const removeButton: HTMLButtonElement = document.createElement('button');
    removeButton.classList.add('button-with-counter__remove');
    removeButton.textContent = '-';

    const addButton: HTMLButtonElement = document.createElement('button');
    addButton.classList.add('button-with-counter__add');
    addButton.textContent = '+';

    const counterElement: HTMLDivElement = document.createElement('div');
    counterElement.classList.add('button-with-counter__counter');
    counterElement.textContent = String(initialValue);

    if (initialValue) {
      this.setDisplayValue(STYLE_DISPLAY_VALUE.none, mainButton);
      this.setDisplayValue(STYLE_DISPLAY_VALUE.flex, removeButton, addButton, counterElement);
    }

    wrapper.append(mainButton, removeButton, counterElement, addButton);
    this.wrapper = wrapper;
    this.mainButton = mainButton;
    this.removeButton = removeButton;
    this.addButton = addButton;
    this.counterElement = counterElement;
    this.counter = initialValue;
    this.maxValue = maxValue;
  }
  public init(): void {
    this.mainButton.addEventListener('click', (): void => this.add());
    this.addButton.addEventListener('click', (): void => this.add());
    this.removeButton.addEventListener('click', (): void => this.remove());
  }
  public add(): void {
    if (this.isCartFull()) {
      (document.querySelector('.shopping-cart') as HTMLDivElement).dispatchEvent(
        new Event(CUSTOM_EVENT_NAMES.overflow)
      );
    } else {
      if (this.maxValue === this.counter) return;
      if (this.counter === Numbers.Zero) {
        this.setDisplayValue(STYLE_DISPLAY_VALUE.none, this.mainButton);
        this.setDisplayValue(
          STYLE_DISPLAY_VALUE.flex,
          this.removeButton,
          this.addButton,
          this.counterElement
        );
      }
      this.counterElement.textContent = String(++this.counter);
      (document.querySelector('.shopping-cart') as HTMLDivElement).dispatchEvent(
        new Event(CUSTOM_EVENT_NAMES.addToCart)
      );
    }
  }
  public remove(): void {
    this.counter--;
    if (this.counter === Numbers.Zero) {
      this.setDisplayValue(
        STYLE_DISPLAY_VALUE.none,
        this.removeButton,
        this.addButton,
        this.counterElement
      );
      this.setDisplayValue(STYLE_DISPLAY_VALUE.block, this.mainButton);
    }
    this.counterElement.textContent = String(this.counter);
    (document.querySelector('.shopping-cart') as HTMLDivElement).dispatchEvent(
      new Event(CUSTOM_EVENT_NAMES.removeFromCart)
    );
  }
  private isCartFull(): boolean {
    return (
      Number((document.querySelector('.shopping-cart__counter') as HTMLSpanElement).textContent) ===
      MAX_ITEMS_IN_CART
    );
  }
  private setDisplayValue(value: string, ...buttons: HTMLElement[]): void {
    buttons.forEach((button: HTMLElement): void => {
      button.style.display = value;
    });
  }
}
