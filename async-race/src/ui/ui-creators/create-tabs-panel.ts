import { Numbers } from '../../types/enums';
import openTabContent from '../ui-utilities/open-tab-content';
import { createParentUIElement, createUIElement } from './create-general-element';

export default (tabsText: string[]): HTMLElement =>
  createParentUIElement<HTMLElement>({
    tag: 'header',
    classNames: ['tabs'],
    children: tabsText.map((tabText: string, index: number): HTMLButtonElement => {
      const tab: HTMLButtonElement = createUIElement<HTMLButtonElement>({
        tag: 'button',
        classNames: ['tab-button'],
        innerText: tabText,
      });
      if (index === Numbers.Zero) tab.classList.add('tab-button_active');
      return tab;
    }),
    listenerInfo: { eventName: 'click', callback: openTabContent },
  });
