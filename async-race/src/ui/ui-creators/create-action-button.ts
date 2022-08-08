import { BUTTON_TEXT } from '../../constants/constants';
import { Action, ListenerInfo } from '../../types/types';
import { createUIElement } from './create-general-element';

export default (
  action: Action,
  listenerInfo?: ListenerInfo,
  attributeInfo?: [string, string]
): HTMLButtonElement =>
  createUIElement<HTMLButtonElement>({
    tag: 'button',
    classNames: ['button', `${action}-button`],
    innerText: BUTTON_TEXT[action],
    listenerInfo,
    attributeInfo,
  });
