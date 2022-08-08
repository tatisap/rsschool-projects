import API from '../api/api';
import {
  MAX_CARS_PER_PAGE,
  MAX_WINNERS_PER_PAGE,
  SECTION_TITLE_TEXT,
} from '../constants/constants';
import store from '../store/store';
import { Numbers } from '../types/enums';
import { Car, Info, Winner } from '../types/types';
import { createCarUIElement, makeTableContent } from './create-ui-components';
import { createPageNumberText, createSectionTitleText } from '../utilities/text-makers';

export const updatePaginationDisabledStatus = (
  paginationContainer: HTMLDivElement,
  currentPage: number,
  maxPage: number
): void => {
  const previousButton: HTMLButtonElement = paginationContainer.querySelector(
    '.previous-button'
  ) as HTMLButtonElement;
  const nextButton: HTMLButtonElement = paginationContainer.querySelector(
    '.next-button'
  ) as HTMLButtonElement;
  [previousButton, nextButton].forEach((button: HTMLButtonElement): void =>
    button.removeAttribute('disabled')
  );
  if (currentPage <= Numbers.One) previousButton.setAttribute('disabled', 'true');
  if (currentPage >= maxPage) nextButton.setAttribute('disabled', 'true');
};

export const updateGarageSection = async (): Promise<void> => {
  const carsInfo: Info<Car> = await API.getCars({
    _page: store.garageCurrentPage,
    _limit: MAX_CARS_PER_PAGE,
  });
  [store.cars, store.carsAmount] = [carsInfo.content, Number(carsInfo.totalAmount)];
  const section: HTMLElement = document.getElementById('garage') as HTMLElement;
  (document.querySelector('.garage__title') as HTMLHeadingElement).textContent =
    createSectionTitleText(SECTION_TITLE_TEXT.garage, carsInfo.totalAmount);
  (document.querySelector('.garage__page-number') as HTMLHeadingElement).textContent =
    createPageNumberText(store.garageCurrentPage);
  (document.querySelector('.cars-list') as HTMLUListElement).append(
    ...carsInfo.content.map(createCarUIElement)
  );
  updatePaginationDisabledStatus(
    section.querySelector('.pagination') as HTMLDivElement,
    store.garageCurrentPage,
    Math.ceil(store.carsAmount / MAX_CARS_PER_PAGE)
  );
};

export const updateWinnersSection = async (): Promise<void> => {
  const winnersInfo: Info<Winner> = await API.getWinners({
    _page: store.winnersCurrentPage,
    _limit: MAX_WINNERS_PER_PAGE,
    _sort: store.sortKey,
    _order: store.sortOrder,
  });
  const winnersCarInfo: (Winner & Car)[] = await Promise.all(
    winnersInfo.content.map(async (winner: Winner): Promise<Winner & Car> => {
      return Object.assign(winner, (await API.getCarById(String(winner.id))) as Car);
    })
  );
  [store.winners, store.winnersAmount] = [winnersInfo.content, Number(winnersInfo.totalAmount)];
  const section: HTMLElement = document.getElementById('winners') as HTMLElement;
  (document.querySelector('.winners__title') as HTMLHeadingElement).textContent =
    createSectionTitleText(SECTION_TITLE_TEXT.winners, winnersInfo.totalAmount);
  (document.querySelector('.winners__page-number') as HTMLHeadingElement).textContent =
    createPageNumberText(store.winnersCurrentPage);
  const winnerTable: HTMLTableElement = document.querySelector('.winners-list') as HTMLTableElement;
  winnerTable.lastChild?.remove();
  winnerTable.append(makeTableContent(winnersCarInfo));
  updatePaginationDisabledStatus(
    section.querySelector('.pagination') as HTMLDivElement,
    store.winnersCurrentPage,
    Math.ceil(store.winnersAmount / MAX_WINNERS_PER_PAGE)
  );
};
