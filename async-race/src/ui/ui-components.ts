import {
  createHandler,
  deleteHandler,
  generateHandler,
  raceHandler,
  resetRaceHandler,
  selectCar,
  startHandler,
  stopHandler,
  updateHandler,
} from '../handlers/handlers';
import { BUTTON_TEXT, NO_TEXT_CONTENT, WINNERS_TABLE_COLUMN_NAMES } from '../constants/constants';
import { Numbers } from '../types/enums';
import {
  Action,
  Car,
  FormType,
  Info,
  ListenerInfo,
  UIElementParameters,
  Winner,
} from '../types/types';
import { createPageNumberText, createSectionTitleText } from '../utilities/ui-text-makers';
import { openTabContent } from './open-tab-content';

export const createUIElement = <T extends HTMLElement>(parameters: UIElementParameters): T => {
  const { tag, classNames, innerText = NO_TEXT_CONTENT, listenerInfo, attributeInfo } = parameters;
  const element = document.createElement(tag) as T;
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
  const parentElement = createUIElement<T>(parameters);
  parentElement.append(...children);
  if (id !== undefined) parentElement.id = id;
  return parentElement;
};

export const createInput = (type: string, className: string, name: string): HTMLInputElement => {
  const input = document.createElement('input');
  input.type = type;
  input.name = name;
  input.classList.add(className);
  if (type === 'text') {
    input.setAttribute('autocomplete', 'off');
  }
  return input;
};

export const createActionButton = (
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

export const createTabsPanel = (tabsText: string[]): HTMLElement =>
  createParentUIElement<HTMLElement>({
    tag: 'header',
    classNames: ['tabs'],
    children: tabsText.map((tabText, index) => {
      const tab = createUIElement<HTMLButtonElement>({
        tag: 'button',
        classNames: ['tab-button'],
        innerText: tabText,
      });
      if (index === Numbers.Zero) tab.classList.add('tab-button_active');
      return tab;
    }),
    listenerInfo: { eventName: 'click', callback: openTabContent },
  });

export const createPagination = (): HTMLDivElement =>
  createParentUIElement<HTMLDivElement>({
    tag: 'div',
    classNames: ['pagination'],
    children: [createActionButton('previous'), createActionButton('next')],
  });

const createForm = (formType: FormType, listenerInfo?: ListenerInfo): HTMLFormElement =>
  createParentUIElement<HTMLFormElement>({
    tag: 'form',
    classNames: ['form', `${formType}-form`],
    children: [
      createInput('text', 'form__text-input', 'text'),
      createInput('color', 'form__color-input', 'color'),
      createActionButton(formType),
    ],
    listenerInfo,
  });

const createCarControlButtons = (): HTMLDivElement =>
  createParentUIElement<HTMLDivElement>({
    tag: 'div',
    classNames: ['control-buttons'],
    children: [
      createActionButton('select', { eventName: 'click', callback: selectCar }),
      createActionButton('remove', { eventName: 'click', callback: deleteHandler }),
      createActionButton('start', { eventName: 'click', callback: startHandler }),
      createActionButton('stop', { eventName: 'click', callback: stopHandler }, [
        'disabled',
        'true',
      ]),
    ],
  });

export const createCarUIElement = ({ name, color, id }: Car): HTMLLIElement => {
  const carImageElement = createUIElement({
    tag: 'div',
    classNames: ['car__image', 'car__start-point'],
  });
  carImageElement.style.backgroundColor = color;
  return createParentUIElement<HTMLLIElement>({
    tag: 'li',
    classNames: ['cars-list__item', 'car'],
    children: [
      createCarControlButtons(),
      createUIElement({ tag: 'div', classNames: ['car__name'], innerText: name }),
      carImageElement,
      createUIElement({ tag: 'div', classNames: ['car__finish-point'] }),
    ],
    id: `${id}`,
  });
};

const createGarageSectionHeader = (): HTMLDivElement =>
  createParentUIElement<HTMLDivElement>({
    tag: 'div',
    classNames: ['section__header'],
    children: [
      createForm('create', { eventName: 'submit', callback: createHandler }),
      createForm('update', { eventName: 'submit', callback: updateHandler }),
      createActionButton('race', { eventName: 'click', callback: raceHandler }),
      createActionButton('reset', { eventName: 'click', callback: resetRaceHandler }, [
        'disabled',
        'true',
      ]),
      createActionButton('generate', { eventName: 'click', callback: generateHandler }),
    ],
  });

export const createGarageSection = (garageInfo: Info<Car>, pageNumber: number) =>
  createParentUIElement({
    tag: 'section',
    id: 'garage',
    classNames: ['section'],
    children: [
      createGarageSectionHeader(),
      createUIElement({
        tag: 'h2',
        classNames: ['section__title', 'garage__title'],
        innerText: createSectionTitleText('GARAGE', garageInfo.totalAmount),
      }),
      createUIElement({
        tag: 'div',
        classNames: ['page-number'],
        innerText: createPageNumberText(pageNumber),
      }),
      createParentUIElement({
        tag: 'ul',
        classNames: ['cars-list'],
        children: garageInfo.content.map((carInfo) => createCarUIElement(carInfo)),
      }),
      createPagination(),
    ],
  });

export const createTableRow = (
  cellTag: string,
  cellsInnerText: string[],
  cellColor: string
): HTMLTableRowElement => {
  const row = document.createElement('tr');
  row.append(
    ...cellsInnerText.map((cellText: string, index: number) => {
      const cell = document.createElement(cellTag);
      cell.textContent = cellText;
      if (index === Numbers.One) cell.style.backgroundColor = cellColor;
      return cell;
    })
  );
  return row;
};

export const makeTableContent = (winnersCarInfo: (Winner & Car)[]): HTMLElement[] => {
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  thead.append(createTableRow('th', WINNERS_TABLE_COLUMN_NAMES, NO_TEXT_CONTENT));
  tbody.append(
    ...winnersCarInfo.map((winnerInfo, index) =>
      createTableRow(
        'td',
        [
          `${index + Numbers.One}`,
          '',
          `${winnerInfo.name}`,
          `${winnerInfo.wins}`,
          `${winnerInfo.time}`,
        ],
        winnerInfo.color
      )
    )
  );
  return [thead, tbody];
};

const createWinnersTable = (winnersCarInfo: (Winner & Car)[]): HTMLTableElement => {
  return createParentUIElement<HTMLTableElement>({
    tag: 'table',
    classNames: ['winners-list'],
    children: makeTableContent(winnersCarInfo),
  });
};

export const createWinnersSection = (
  winnersCarInfo: (Winner & Car)[],
  totalAmount: string,
  pageNumber: number
) =>
  createParentUIElement({
    tag: 'section',
    id: 'winners',
    classNames: ['section'],
    children: [
      createUIElement({
        tag: 'h2',
        classNames: ['section__title', 'winners__title'],
        innerText: createSectionTitleText('WINNERS', totalAmount),
      }),
      createUIElement({
        tag: 'div',
        classNames: ['page-number'],
        innerText: createPageNumberText(pageNumber),
      }),
      createWinnersTable(winnersCarInfo),
      createPagination(),
    ],
  });
