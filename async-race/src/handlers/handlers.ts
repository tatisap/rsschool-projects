import API from '../api/api';
import {
  GENERATOR_COUNTER,
  MAX_CARS_PER_PAGE,
  MAX_WINNERS_PER_PAGE,
  NO_TEXT_CONTENT,
  TEXT_MESSAGE_CONTENT,
} from '../constants/constants';
import store from '../store/store';
import { Numbers } from '../types/enums';
import {
  AnimationId,
  Car,
  Info,
  MoveParameters,
  RaceResult,
  SortOrder,
  Winner,
} from '../types/types';
import textMessage from '../ui/text-message';
import { createCarUIElement, makeTableContent } from '../ui/ui-components';
import { animate, getDistanceBetweenTwoElements } from '../utilities/animation';
import generateCar from '../utilities/generator';
import { createPageNumberText, createSectionTitleText } from '../utilities/ui-text-makers';

const getUserCarInput = (createForm: HTMLFormElement): Omit<Car, 'id'> => {
  return {
    name: createForm.text.value,
    color: createForm.color.value,
  };
};

const cleanCarsList = (): void => {
  (document.querySelector('.cars-list') as HTMLUListElement).innerHTML = NO_TEXT_CONTENT;
};

const updatePaginationDisabledStatus = (
  paginationContainer: HTMLDivElement,
  currentPage: number,
  maxPage: number
): void => {
  const previousButton = paginationContainer.querySelector('.previous-button') as HTMLButtonElement;
  const nextButton = paginationContainer.querySelector('.next-button') as HTMLButtonElement;
  [previousButton, nextButton].forEach((button: HTMLButtonElement): void =>
    button.removeAttribute('disabled')
  );
  if (currentPage <= Numbers.One) previousButton.setAttribute('disabled', 'true');
  if (currentPage >= maxPage) nextButton.setAttribute('disabled', 'true');
};

const updateGarageSection = async (): Promise<void> => {
  const carsInfo: Info<Car> = await API.getCars({
    _page: store.garageCurrentPage,
    _limit: MAX_CARS_PER_PAGE,
  });
  [store.cars, store.carsAmount] = [carsInfo.content, Number(carsInfo.totalAmount)];
  const section: HTMLElement = document.getElementById('garage') as HTMLElement;
  (document.querySelector('.garage__title') as HTMLHeadingElement).textContent =
    createSectionTitleText('GARAGE', carsInfo.totalAmount);
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

const updateWinnersSection = async (): Promise<void> => {
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
    createSectionTitleText('WINNERS', winnersInfo.totalAmount);
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

export const createHandler = async (event: Event): Promise<void> => {
  event.preventDefault();
  if (store.isRaceStarted) {
    textMessage.open(TEXT_MESSAGE_CONTENT.raceInProgress);
    return;
  }
  const createForm: HTMLFormElement = event.target as HTMLFormElement;
  if (createForm.text.value.trim() === NO_TEXT_CONTENT) {
    textMessage.open(TEXT_MESSAGE_CONTENT.noInput);
    return;
  }
  await API.createCar(getUserCarInput(createForm));
  createForm.reset();
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
  await API.updateCar(updateForm.dataset.currentId as string, getUserCarInput(updateForm));
  updateForm.reset();
  updateForm.removeAttribute('data-current-id');
  cleanCarsList();
  await updateGarageSection();
};

export const selectCar = async (event: Event): Promise<void> => {
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

const startCar = async (carElement: HTMLLIElement): Promise<RaceResult> => {
  const car: HTMLLIElement = carElement;
  (car.querySelector('.start-button') as HTMLButtonElement).setAttribute('disabled', 'true');
  const startPoint: HTMLDivElement = car.querySelector('.car__start-point') as HTMLDivElement;
  const finishPoint: HTMLDivElement = car.querySelector('.car__finish-point') as HTMLDivElement;
  const moveParameters: MoveParameters = await API.startEngine(Number(car.id));
  (car.querySelector('.stop-button') as HTMLButtonElement).removeAttribute('disabled');
  const time: number = moveParameters.distance / moveParameters.velocity;
  const distance: number = getDistanceBetweenTwoElements(startPoint, finishPoint);
  const id: AnimationId = animate(startPoint, distance, time);
  store.animate[car.id] = id;
  const { success } = await API.switchEngineToDriveMode(Number(car.id));
  if (!success) {
    window.cancelAnimationFrame(id.value);
    return { success, id: car.id };
  }
  return { success, id: car.id, time: +(time / 1000).toFixed(Numbers.Three) };
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
  carImage.style.transform = NO_TEXT_CONTENT;
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
      .map((generator: () => Car) => API.createCar(generator()))
  );
  cleanCarsList();
  await updateGarageSection();
};

export const race = async (
  carsPromises: Promise<RaceResult>[],
  ids: string[]
): Promise<RaceResult> => {
  const firstResult: RaceResult = await Promise.race(carsPromises);
  if (!firstResult.success) {
    const restCarsPromises = carsPromises.filter(
      (promise: Promise<RaceResult>, index: number): boolean => ids[index] !== firstResult.id
    );
    return race(
      restCarsPromises,
      ids.filter((id: string): boolean => id !== firstResult.id)
    );
  }
  return firstResult;
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
  document
    .querySelectorAll('.car')
    .forEach((car) => car.querySelector('.stop-button')?.dispatchEvent(new Event('click')));
};

export const sortTableHandler = async (event: Event): Promise<void> => {
  const tableHeadCell: HTMLTableCellElement = event.target as HTMLTableCellElement;
  if (
    !(tableHeadCell.classList.contains('car-wins') || tableHeadCell.classList.contains('car-time'))
  )
    return;
  const sortOrder: SortOrder = tableHeadCell.dataset.order === 'ASC' ? 'DESC' : 'ASC';
  tableHeadCell.dataset.order = sortOrder;
  (document.querySelectorAll('th') as NodeListOf<HTMLTableCellElement>).forEach(
    (cell: HTMLTableCellElement) => cell.classList.remove('ascending', 'descending')
  );
  tableHeadCell.classList.add(sortOrder === 'ASC' ? 'ascending' : 'descending');
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
