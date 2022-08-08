import { ICar } from '../../types/types';
import createActionButton from './create-action-button';
import { createParentUIElement, createUIElement } from './create-general-element';

const createCarControlButtons = (): HTMLDivElement =>
  createParentUIElement<HTMLDivElement>({
    tag: 'div',
    classNames: ['control-buttons'],
    children: [
      createActionButton('select'),
      createActionButton('remove'),
      createActionButton('start'),
      createActionButton('stop', undefined, ['disabled', 'true']),
    ],
  });

export default ({ name, color, id }: ICar): HTMLLIElement => {
  const carImageElement: HTMLDivElement = createUIElement<HTMLDivElement>({
    tag: 'div',
    classNames: ['car__image', 'car__start-point'],
  });
  carImageElement.style.backgroundColor = color;
  return createParentUIElement<HTMLLIElement>({
    tag: 'li',
    classNames: ['cars-list__item', 'car'],
    children: [
      createCarControlButtons(),
      createUIElement<HTMLDivElement>({ tag: 'div', classNames: ['car__name'], innerText: name }),
      carImageElement,
      createUIElement<HTMLDivElement>({ tag: 'div', classNames: ['car__finish-point'] }),
    ],
    id: `${id}`,
  });
};
