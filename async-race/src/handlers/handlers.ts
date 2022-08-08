import API from '../api/api';
import {
  BLACK_COLOR,
  GENERATOR_COUNTER,
  MAX_CARS_PER_PAGE,
  MAX_WINNERS_PER_PAGE,
  NO_CONTENT,
  SORT_ORDER,
  TEXT_MESSAGE_CONTENT,
} from '../constants/constants';
import store from '../store/store';
import { Numbers } from '../types/enums';
import { Car, RaceResult, SortOrder } from '../types/types';
import textMessage from '../ui/text-message';
import generateCar from '../utilities/generator';
import {
  updateGarageSection,
  updateWinnersSection,
  updatePaginationDisabledStatus,
} from '../ui/update-ui-components';
import { race, startCar } from '../utilities/car-actions';
import cleanCarsList from '../ui/clean-cars-list';
import getUserInput from '../utilities/get-user-input';

export const createHandler = async (event: Event): Promise<void> => {
  event.preventDefault();
  if (store.isRaceStarted) {
    textMessage.open(TEXT_MESSAGE_CONTENT.raceInProgress);
    return;
  }
  const createForm: HTMLFormElement = event.target as HTMLFormElement;
  if (createForm.text.value.trim() === NO_CONTENT) {
    textMessage.open(TEXT_MESSAGE_CONTENT.noInput);
    return;
  }
  await API.createCar(getUserInput(createForm));
  createForm.text.value = NO_CONTENT;
  createForm.color.value = BLACK_COLOR;
  cleanCarsList();
  await updateGarageSection();
};

export const updateHandler = async (event: Event): Promise<void> => {
  event.preventDefault();
  if (store.isRaceStarted) {
    textMessage.open(TEXT_MESSAGE_CONTENT.raceInProgress);
    return;
  }
  const updateForm: HTMLFormElement = event.target as HTMLFormElement;
  if (!updateForm.hasAttribute('data-current-id')) {
    textMessage.open(TEXT_MESSAGE_CONTENT.noSelectedCar);
    return;
  }
  await API.updateCar(updateForm.dataset.currentId as string, getUserInput(updateForm));
  updateForm.text.value = NO_CONTENT;
  updateForm.color.value = BLACK_COLOR;
  updateForm.removeAttribute('data-current-id');
  cleanCarsList();
  await updateGarageSection();
};

export const selectHandler = async (event: Event): Promise<void> => {
  if (store.isRaceStarted) {
    textMessage.open(TEXT_MESSAGE_CONTENT.raceInProgress);
    return;
  }
  const updateForm: HTMLFormElement = document.querySelector('.update-form') as HTMLFormElement;
  const carId: string = ((event.target as HTMLButtonElement).closest('.car') as HTMLLIElement)
    .id as string;
  const carInfo = await API.getCarById(carId);
  updateForm.dataset.currentId = carId;
  updateForm.text.value = carInfo.name;
  updateForm.color.value = carInfo.color;
};

export const deleteHandler = async (event: Event): Promise<void> => {
  if (store.isRaceStarted) {
    textMessage.open(TEXT_MESSAGE_CONTENT.raceInProgress);
    return;
  }
  const id = ((event.target as HTMLButtonElement).closest('.car') as HTMLLIElement).id as string;
  await API.deleteCar(id);
  if (await API.isWinnerExist(id)) await API.deleteWinner(id);
  cleanCarsList();
  await updateGarageSection();
  await updateWinnersSection();
};

export const startHandler = async (event: Event): Promise<void> => {
  const car: HTMLLIElement = (event.target as HTMLButtonElement).closest('.car') as HTMLLIElement;
  await startCar(car);
};

export const stopHandler = async (event: Event): Promise<void> => {
  const target = event.target as HTMLButtonElement;
  target.setAttribute('disabled', 'true');
  const car: HTMLLIElement = (event.target as HTMLButtonElement).closest('.car') as HTMLLIElement;
  const carImage: HTMLDivElement = car.querySelector('.car__image') as HTMLDivElement;
  await API.stopEngine(Number(car.id));
  window.cancelAnimationFrame(store.animate[car.id].value);
  carImage.style.transform = NO_CONTENT;
  (car.querySelector('.start-button') as HTMLButtonElement).removeAttribute('disabled');
};

export const generateHandler = async (): Promise<void> => {
  if (store.isRaceStarted) {
    textMessage.open(TEXT_MESSAGE_CONTENT.raceInProgress);
    return;
  }
  await Promise.all(
    new Array(GENERATOR_COUNTER)
      .fill(generateCar)
      .map((generator: () => Car): Promise<Car> => API.createCar(generator()))
  );
  cleanCarsList();
  await updateGarageSection();
};

export const raceHandler = async (): Promise<void> => {
  document.querySelector('.race-button')?.setAttribute('disabled', 'true');
  store.isRaceStarted = true;
  const carsElements = Array.from(document.querySelectorAll('.car') as NodeListOf<HTMLLIElement>);
  const raceCarsPromises = carsElements.map(startCar);
  const {
    success,
    id: winnerId,
    time: winnerTime,
  }: RaceResult = (await race(
    raceCarsPromises,
    carsElements.map((element: HTMLLIElement): string => element.id)
  )) as Required<RaceResult>;

  if (!success) return;
  if (!(await API.isCarExist(winnerId))) return;

  if (await API.isWinnerExist(winnerId)) {
    const { wins, time } = await API.getWinnerById(winnerId);
    const newWinsValue = wins + Numbers.One;
    const newBestTime = time < winnerTime ? time : winnerTime;
    await API.updateWinner(winnerId, { wins: newWinsValue, time: newBestTime });
  } else {
    await API.createWinner({ id: Number(winnerId), wins: Numbers.One, time: winnerTime });
  }
  document.querySelector('.reset-button')?.removeAttribute('disabled');
  textMessage.open(
    `${TEXT_MESSAGE_CONTENT.showWinner} ${(await API.getCarById(winnerId)).name} (${winnerTime}s)`
  );
  await updateWinnersSection();
};

export const resetRaceHandler = (): void => {
  document.querySelector('.reset-button')?.setAttribute('disabled', 'true');
  document.querySelector('.race-button')?.removeAttribute('disabled');
  store.isRaceStarted = false;
  (document.querySelectorAll('.car') as NodeListOf<HTMLLIElement>).forEach(
    (car: HTMLLIElement): void => {
      car.querySelector('.stop-button')?.dispatchEvent(new Event('click'));
    }
  );
};

export const sortTableHandler = async (event: Event): Promise<void> => {
  const tableHeadCell: HTMLTableCellElement = event.target as HTMLTableCellElement;
  if (
    !(tableHeadCell.classList.contains('car-wins') || tableHeadCell.classList.contains('car-time'))
  )
    return;
  const sortOrder: SortOrder =
    tableHeadCell.dataset.order === SORT_ORDER.ascending
      ? SORT_ORDER.descending
      : SORT_ORDER.ascending;
  tableHeadCell.dataset.order = sortOrder;
  (document.querySelectorAll('th') as NodeListOf<HTMLTableCellElement>).forEach(
    (cell: HTMLTableCellElement): void => cell.classList.remove('ascending', 'descending')
  );
  tableHeadCell.classList.add(sortOrder === SORT_ORDER.ascending ? 'ascending' : 'descending');
  if (tableHeadCell.classList.contains('car-wins')) {
    store.sortKey = 'wins';
    store.sortOrder = sortOrder;
  } else if (tableHeadCell.classList.contains('car-time')) {
    store.sortKey = 'time';
    store.sortOrder = sortOrder;
  }
  await updateWinnersSection();
};

export const garagePaginationHandler = async (event: Event): Promise<void> => {
  const target: HTMLElement = event.target as HTMLElement;
  if (!(target instanceof HTMLButtonElement)) return;
  if (store.isRaceStarted) {
    textMessage.open(TEXT_MESSAGE_CONTENT.raceInProgress);
    return;
  }
  if (target.classList.contains('next-button')) {
    store.garageCurrentPage += Numbers.One;
  }
  if (target.classList.contains('previous-button')) {
    store.garageCurrentPage -= Numbers.One;
  }
  cleanCarsList();
  await updateGarageSection();
  updatePaginationDisabledStatus(
    target.closest('.pagination') as HTMLDivElement,
    store.garageCurrentPage,
    Math.ceil(store.carsAmount / MAX_CARS_PER_PAGE)
  );
};

export const winnersPaginationHandler = async (event: Event): Promise<void> => {
  const target: HTMLElement = event.target as HTMLElement;
  if (!(target instanceof HTMLButtonElement)) return;
  if (target.classList.contains('next-button')) {
    store.winnersCurrentPage += Numbers.One;
  }
  if (target.classList.contains('previous-button')) {
    store.winnersCurrentPage -= Numbers.One;
  }
  await updateWinnersSection();
  updatePaginationDisabledStatus(
    target.closest('.pagination') as HTMLDivElement,
    store.winnersCurrentPage,
    Math.ceil(store.winnersAmount / MAX_WINNERS_PER_PAGE)
  );
};
