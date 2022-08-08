import { NO_CONTENT } from '../../constants/others-constants';
import { Numbers } from '../../types/enums';
import { UIElementParameters } from '../../types/types';

export const createUIElement = <T extends HTMLElement>(parameters: UIElementParameters): T => {
  const { tag, classNames, innerText = NO_CONTENT, listenerInfo, attributeInfo } = parameters;
  const element: T = document.createElement(tag) as T;
  element.classList.add(...classNames);
  element.textContent = innerText;
  if (listenerInfo !== undefined) {
    element.addEventListener(listenerInfo.eventName, listenerInfo.callback);
  }
  if (attributeInfo !== undefined) {
    element.setAttribute(attributeInfo[Numbers.Zero], attributeInfo[Numbers.One]);
  }
  return element;
};

export const createParentUIElement = <T extends HTMLElement>(
  parameters: UIElementParameters
): T => {
  const { children = [], id } = parameters;
  const parentElement: T = createUIElement<T>(parameters);
  parentElement.append(...children);
  if (id !== undefined) parentElement.id = id;
  return parentElement;
};
