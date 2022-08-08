import API from '../../api/api';
import { MAX_CARS_PER_PAGE, SECTION_TITLE_TEXT } from '../../constants/others-constants';
import store from '../../store/store';
import { ICar, IInfo } from '../../types/types';
import createCarUiElement from '../ui-creators/create-car-ui-element';
import { createPageNumberText, createSectionTitleText } from '../../utilities/text-makers';
import updatePaginationDisabledStatus from './update-pagination-disabled-status';

export default async (): Promise<void> => {
  const carsInfo: IInfo<ICar> = await API.getCars({
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
    ...carsInfo.content.map(createCarUiElement)
  );
  updatePaginationDisabledStatus(
    section.querySelector('.pagination') as HTMLDivElement,
    store.garageCurrentPage,
    Math.ceil(store.carsAmount / MAX_CARS_PER_PAGE)
  );
};
