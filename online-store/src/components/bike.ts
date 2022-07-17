import { IBike } from '../types/types';
import { Item } from './common/item';
import { ButtonWithCounter } from './common/counter-button';
import { BUTTON_TEXT } from '../constants/constants';
import { Numbers } from '../types/enums';

export class Bike extends Item {
  public readonly info: IBike;
  constructor(bikeInfo: IBike) {
    const container: HTMLLIElement = document.createElement('li');
    container.classList.add('cards-list__item', 'bike');
    container.addEventListener('click', (event: Event): void => {
      if ((event.target as HTMLElement).closest('.button-with-counter')) {
        this.updateCart();
      }
    });

    const image: HTMLImageElement = document.createElement('img');
    image.classList.add('bike__img');
    image.src = bikeInfo.image;
    image.alt = bikeInfo.name;

    const heading: HTMLHeadingElement = document.createElement('h2');
    heading.classList.add('bike__title');
    heading.textContent = bikeInfo.name;

    const quantityInCart: number = localStorage.getItem('shopping-list')
      ? JSON.parse(localStorage.getItem('shopping-list') as string)[`${bikeInfo.id}`]
      : Numbers.Zero;

    const counterButton = new ButtonWithCounter(
      BUTTON_TEXT.counterText,
      bikeInfo.amount,
      quantityInCart
    );
    counterButton.init();

    const description: HTMLUListElement = document.createElement('ul');
    description.classList.add('bike__description');
    description.innerHTML = `
      <li>Manufacturer: ${bikeInfo.manufacturer}</li>
      <li>Type: ${bikeInfo.type}</li>
      <li>Color: ${bikeInfo.color}</li>
      <li>Quantity in stock: ${bikeInfo.amount}</li>
      <li>Year of manufacture: ${bikeInfo.year}</li>
    `;

    container.append(image, heading, counterButton.wrapper, description);

    if (bikeInfo.isPopular) {
      const flameIcon: HTMLDivElement = document.createElement('div');
      flameIcon.classList.add('flame');
      container.append(flameIcon);
    }

    super(container);
    this.info = bikeInfo;
  }
  updateCart(): void {
    const quantity = Number(
      (this.htmlElement.querySelector('.button-with-counter__counter') as HTMLDivElement)
        .textContent
    );
    (document.querySelector('.shopping-cart') as HTMLDivElement).dispatchEvent(
      new CustomEvent('update-cart', {
        detail: {
          itemId: this.info.id,
          quantity: quantity,
        },
      })
    );
  }
}
