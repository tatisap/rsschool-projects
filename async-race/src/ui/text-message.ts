import { createParentUIElement, createUIElement } from './create-ui-components';

const close = (event: Event): void => {
  const message: HTMLDivElement = (event.target as HTMLButtonElement).closest(
    '.blackout'
  ) as HTMLDivElement;
  message.remove();
};

const open = (text: string): void => {
  const closeButton: HTMLButtonElement = createUIElement({
    tag: 'button',
    classNames: ['close-button'],
    listenerInfo: { eventName: 'click', callback: close },
  });
  const message: HTMLDivElement = createParentUIElement({
    tag: 'div',
    classNames: ['text-message'],
    innerText: text,
    children: [closeButton],
  });
  const blackoutContainer: HTMLDivElement = createParentUIElement({
    tag: 'div',
    classNames: ['blackout'],
    children: [message],
  });
  document.body.append(blackoutContainer);
};

export default {
  open,
  close,
};
