import { IBike } from '../types/types';
import { Item } from './common/item';
import { ButtonWithCounter } from './counter-button';

export class Bike extends Item {
  public readonly info: IBike;
  constructor(bikeInfo: IBike) {
    const container: HTMLLIElement = document.createElement('li');
    container.classList.add('cards-list__item', 'bike');

    const image: HTMLImageElement = document.createElement('img');
    image.classList.add('bike__img');
    image.src = bikeInfo.image;
    image.alt = bikeInfo.name;

    const heading: HTMLHeadingElement = document.createElement('h2');
    heading.classList.add('bike__title');
    heading.textContent = bikeInfo.name;

    const counterButton = new ButtonWithCounter('Add to cart', bikeInfo.amount);
    counterButton.init();

    const description: HTMLParagraphElement = document.createElement('p');
    description.classList.add('bike__description');
    description.innerHTML = `
      Manufacturer: ${bikeInfo.manufacturer}<br>
      Type: ${bikeInfo.type}<br>
      Color: ${bikeInfo.color}<br>
      Quantity in stock: ${bikeInfo.amount}<br>
      Year of manufacture: ${bikeInfo.year}<br>
    `;

    const flameIcon: HTMLDivElement = document.createElement('div');
    if (bikeInfo.isPopular) {
      flameIcon.classList.add('flame');
    }

    container.append(image, heading, counterButton.wrapper, description, flameIcon);
    super(container);
    this.info = bikeInfo;
  }
}
