import { NO_CONTENT } from '../../constants/others-constants';
import { Numbers } from '../../types/enums';
import { IUIElementParameters } from '../../types/types';

export const createUIElement = <T extends HTMLElement>(parameters: IUIElementParameters): T => {
  const { tag, classNames, innerText = NO_CONTENT, listenerInfo, attributeInfo } = parameters;
  const element: T = document.createElement(tag) as T;
  element.classList.add(...classNames);
  element.textContent = innerText;
  if (listenerInfo) {
    element.addEventListener(listenerInfo.eventName, listenerInfo.callback);
  }
  if (attributeInfo) {
    element.setAttribute(attributeInfo[Numbers.Zero], attributeInfo[Numbers.One]);
  }
  return element;
};

export const createParentUIElement = <T extends HTMLElement>(
  parameters: IUIElementParameters
): T => {
  const { children = [], id } = parameters;
  const parentElement: T = createUIElement<T>(parameters);
  parentElement.append(...children);
  if (id !== undefined) parentElement.id = id;
  return parentElement;
};
