import { IBike } from '../types/types';

export class Card {
  private htmlElement: HTMLLIElement;

  constructor(item: IBike) {
    const container: HTMLLIElement = document.createElement('li');
    container.classList.add('cards-list__item', 'bike');

    const image: HTMLImageElement = document.createElement('img');
    image.classList.add('bike__img');
    image.src = item.image;
    image.alt = item.model;

    const heading: HTMLHeadingElement = document.createElement('h2');
    heading.classList.add('bike__title');
    heading.textContent = item.model;

    const addButton: HTMLButtonElement = document.createElement('button');
    addButton.classList.add('add-button');
    addButton.textContent = 'Add to cart';

    const description: HTMLParagraphElement = document.createElement('p');
    description.classList.add('bike__description');
    description.innerHTML = `
      Manufacturer: ${item.manufacturer}<br>
      Type: ${item.type}<br>
      Color: ${item.color}<br>
      Quantity in stock: ${item.amount}<br>
      Year of manufacture: ${item.year}<br>
    `;

    const flameIcon: HTMLDivElement = document.createElement('div');
    if (item.isPopular) {
      flameIcon.classList.add('flame');
    }

    container.append(image, heading, addButton, description, flameIcon);
    this.htmlElement = container;
  }
  render(): void {
    (document.querySelector('.cards-list') as HTMLUListElement).append(this.htmlElement);
  }
}
