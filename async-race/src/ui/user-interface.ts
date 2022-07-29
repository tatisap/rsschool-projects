import { getCars, getWinners } from '../api';
import { BUTTON_TEXT, MAX_CARS_PER_PAGE, WINNERS_TABLE_COLUMN_NAMES } from '../constants/constants';
import { FormType, Info, Car, Winner, ButtonAction } from '../types/types';

export const createTitleText = (text: string, totalAmount: string): string =>
  `${text}(${totalAmount})`;

export const createPageNumberText = (currentValue: number): string => `Page #${currentValue}`;

export const createInput = (type: string, className: string, name: string): HTMLInputElement => {
  const input = document.createElement('input');
  input.type = type;
  input.classList.add(className);
  input.name = name;
  return input;
};

export const createElementWithInnerText = <T extends HTMLElement>(tag: string) => {
  return (classNames: string[], innerText = ''): T => {
    const element = document.createElement(tag) as T;
    element.classList.add(...classNames);
    element.textContent = innerText;
    return element;
  };
};

export const createActionButton = (action: ButtonAction): HTMLElement =>
  createElementWithInnerText('button')(['button', `${action}-button`], BUTTON_TEXT[action]);

export const createParentElement = <T extends HTMLElement>(tag: string) => {
  return (classNames: string[], children: HTMLElement[], id?: number): T => {
    const parentElement = document.createElement(tag) as T;
    parentElement.classList.add(...classNames);
    parentElement.append(...children);
    if (id) parentElement.dataset.id = `${id}`;
    return parentElement;
  };
};

export const createSection = (
  id: string,
  classNames: string[],
  children: HTMLElement[]
): HTMLElement => {
  const section = createParentElement('section')(classNames, children);
  section.id = id;
  return section;
};

export const createTableRow = (cellTag: string, cellsInnerText: string[]): HTMLTableRowElement => {
  const row = document.createElement('tr');
  row.append(
    ...cellsInnerText.map((cellText) => {
      const cell = document.createElement(cellTag);
      cell.textContent = cellText;
      return cell;
    })
  );
  return row;
};

export const createTabsPanelElement = (tabsText: string[]): HTMLElement =>
  createParentElement<HTMLElement>('header')(
    ['tabs'],
    tabsText.map((tabText) => createElementWithInnerText('button')(['tab-button'], tabText))
  );

export const createForm = (formType: FormType): HTMLFormElement =>
  createParentElement<HTMLFormElement>('form')(
    ['form', `${formType}-form`],
    [
      createInput('text', 'form__text-input', 'text'),
      createInput('color', 'form__color-input', 'color'),
      createActionButton(formType),
    ]
  );

export const createGarageSectionHeader = (): HTMLDivElement =>
  createParentElement<HTMLDivElement>('div')(
    ['section__header'],
    [
      createForm('create'),
      createForm('update'),
      createActionButton('race'),
      createActionButton('reset'),
      createActionButton('generate'),
    ]
  );

export const createCarControlButtons = (): HTMLDivElement =>
  createParentElement<HTMLDivElement>('div')(
    ['control-buttons'],
    [
      createActionButton('select'),
      createActionButton('remove'),
      createActionButton('start'),
      createActionButton('stop'),
    ]
  );

export const createCarElement = (name: string, color: string, id: number): HTMLLIElement => {
  const carImageElement = document.createElement('div');
  carImageElement.classList.add('car__image');
  carImageElement.style.backgroundColor = color;
  return createParentElement<HTMLLIElement>('li')(
    ['cars-list__item', 'car'],
    [
      createCarControlButtons(),
      createElementWithInnerText('div')(['car__name'], name),
      carImageElement,
    ],
    id
  );
};

export const createPagination = (): HTMLDivElement =>
  createParentElement<HTMLDivElement>('div')(
    ['pagination'],
    [createActionButton('previous'), createActionButton('next')]
  );

export const createGarageSection = (garageInfo: Info<Car>, pageNumber: number) =>
  createSection(
    'garage',
    ['section'],
    [
      createGarageSectionHeader(),
      createElementWithInnerText('h2')(
        ['section__title'],
        createTitleText('GARAGE', garageInfo.totalAmount)
      ),
      createElementWithInnerText('div')(['page-number'], createPageNumberText(pageNumber)),
      createParentElement('ul')(
        ['cars-list'],
        garageInfo.content.map((carInfo) =>
          createCarElement(carInfo.name, carInfo.color, carInfo.id)
        )
      ),
      createPagination(),
    ]
  );

export const createWinnersTable = (winnersCarInfo: (Winner & Car)[]): HTMLTableElement => {
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  thead.append(createTableRow('th', WINNERS_TABLE_COLUMN_NAMES));
  tbody.append(
    ...winnersCarInfo.map((winnerInfo, index) =>
      createTableRow('td', [
        `${index}`,
        '',
        winnerInfo.name,
        `${winnerInfo.wins}`,
        `${winnerInfo.time}`,
      ])
    )
  );
  return createParentElement<HTMLTableElement>('table')(['winners-list'], [thead, tbody]);
};

export const createWinnersSection = (
  winnersCarInfo: (Winner & Car)[],
  totalAmount: string,
  pageNumber: number
) =>
  createSection(
    'winners',
    ['section'],
    [
      createElementWithInnerText('h2')(['section__title'], createTitleText('WINNERS', totalAmount)),
      createElementWithInnerText('div')(['page-number'], createPageNumberText(pageNumber)),
      createWinnersTable(winnersCarInfo),
      createPagination(),
    ]
  );

export const renderMainPage = async (): Promise<void> => {
  const carsInfo: Info<Car> = await getCars({ _page: 1, _limit: MAX_CARS_PER_PAGE });
  const winnerInfo: Info<Winner> = await getWinners({ _page: 1, _limit: 10 });
  const winnersCarInfo: (Winner & Car)[] = winnerInfo.content.map((info) =>
    Object.assign(
      info,
      carsInfo.content.find((car) => car.id === info.id)
    )
  );
  const main = document.createElement('main');
  main.append(
    createTabsPanelElement([BUTTON_TEXT.garage, BUTTON_TEXT.winners]),
    createGarageSection(carsInfo, 1),
    createWinnersSection(winnersCarInfo, winnerInfo.totalAmount, 1)
  );
  document.body.append(main);
};
