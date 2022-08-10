import { Numbers } from '../../types/enums';
import { Handler } from '../../types/types';
import createActionButton from './create-action-button';
import { createParentUIElement } from './create-general-element';

export default (callback: Handler, currentPage: number, maxPage: number): HTMLDivElement => {
  const previousButton: HTMLButtonElement = createActionButton('previous');
  if (currentPage <= Numbers.One) previousButton.setAttribute('disabled', 'true');
  const nextButton: HTMLButtonElement = createActionButton('next');
  if (currentPage >= maxPage) nextButton.setAttribute('disabled', 'true');
  return createParentUIElement<HTMLDivElement>({
    tag: 'div',
    classNames: ['pagination'],
    children: [previousButton, nextButton],
    listenerInfo: { eventName: 'click', callback },
  });
};
