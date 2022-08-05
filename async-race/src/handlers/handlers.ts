import API from '../api/api';
import { MAX_CARS_PER_PAGE, MAX_WINNERS_PER_PAGE, NO_TEXT_CONTENT } from '../constants/constants';
import store from '../store/store';
import { Numbers } from '../types/enums';
import {
  AnimationId,
  Car,
  Info,
  MoveParameters,
  RaceResult,
  SortKey,
  SortOrder,
  Winner,
} from '../types/types';
import { createCarUIElement, makeTableContent } from '../ui/ui-components';
import { animate, getDistanceBetweenTwoElements } from '../utilities/animation';
import generateCar from '../utilities/generator';
import { createSectionTitleText } from '../utilities/ui-text-makers';

const getUserCarInput = (createForm: HTMLFormElement): Omit<Car, 'id'> => {
  return {
    name: createForm.text.value,
    color: createForm.color.value,
  };
};

const cleanCarsList = (): void => {
  (document.querySelector('.cars-list') as HTMLUListElement).innerHTML = NO_TEXT_CONTENT;
};

const updateGarageSection = async (): Promise<void> => {
  const carsInfo: Info<Car> = await API.getCars({
    _page: store.garageCurrentPage,
    _limit: MAX_CARS_PER_PAGE,
  });
  [store.cars, store.carsAmount] = [carsInfo.content, Number(carsInfo.totalAmount)];
  (document.querySelector('.garage__title') as HTMLHeadingElement).textContent =
    createSectionTitleText('GARAGE', carsInfo.totalAmount);
  (document.querySelector('.cars-list') as HTMLUListElement).append(
    ...carsInfo.content.map(createCarUIElement)
  );
};

const updateWinnersSection = async (sortKey: SortKey, sortOrder: SortOrder): Promise<void> => {
  const carsInfo: Info<Car> = await API.getCars({
    _page: store.garageCurrentPage,
    _limit: MAX_CARS_PER_PAGE,
  });
  const winnersInfo: Info<Winner> = await API.getWinners({
    _page: store.winnersCurrentPage,
    _limit: MAX_WINNERS_PER_PAGE,
    _sort: sortKey,
    _order: sortOrder,
  });
  const winnersCarInfo: (Winner & Car)[] = winnersInfo.content.map((info) => {
    return Object.assign(
      info,
      carsInfo.content.find((car) => car.id === info.id)
    );
  });
  [store.winners, store.winnersAmount] = [winnersInfo.content, Number(winnersInfo.totalAmount)];
  (document.querySelector('.winners__title') as HTMLHeadingElement).textContent =
    createSectionTitleText('WINNERS', winnersInfo.totalAmount);
  const winnerTable: HTMLTableElement = document.querySelector('.winners-list') as HTMLTableElement;
  winnerTable.lastChild?.remove();
  winnerTable.append(makeTableContent(winnersCarInfo));
};

export const createHandler = async (event: Event): Promise<void> => {
  event.preventDefault();
  const createForm: HTMLFormElement = event.target as HTMLFormElement;
  await API.createCar(getUserCarInput(createForm));
  createForm.reset();
  cleanCarsList();
  await updateGarageSection();
};

export const updateHandler = async (event: Event): Promise<void> => {
  event.preventDefault();
  const updateForm: HTMLFormElement = event.target as HTMLFormElement;
  await API.updateCar(updateForm.dataset.currentId as string, getUserCarInput(updateForm));
  updateForm.reset();
  cleanCarsList();
  await updateGarageSection();
};

export const selectCar = async (event: Event): Promise<void> => {
  const updateForm: HTMLFormElement = document.querySelector('.update-form') as HTMLFormElement;
  const carId: string = ((event.target as HTMLButtonElement).closest('.car') as HTMLLIElement)
    .id as string;
  const carInfo = await API.getCarById(carId);
  updateForm.dataset.currentId = carId;
  updateForm.text.value = carInfo.name;
  updateForm.color.value = carInfo.color;
};

export const deleteHandler = async (event: Event): Promise<void> => {
  const id = ((event.target as HTMLButtonElement).closest('.car') as HTMLLIElement).id as string;
  await API.deleteCar(id);
  await API.deleteWinner(id);
  cleanCarsList();
  await updateGarageSection();
  await updateWinnersSection('id', 'ASC');
};

const startCar = async (carElement: HTMLLIElement): Promise<RaceResult> => {
  const car: HTMLLIElement = carElement;
  (car.querySelector('.start-button') as HTMLButtonElement).setAttribute('disabled', 'true');
  (car.querySelector('.stop-button') as HTMLButtonElement).removeAttribute('disabled');
  const startPoint: HTMLDivElement = car.querySelector('.car__start-point') as HTMLDivElement;
  const finishPoint: HTMLDivElement = car.querySelector('.car__finish-point') as HTMLDivElement;
  const moveParameters: MoveParameters = await API.startEngine(Number(car.id));
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
  await API.createCar(generateCar());
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
  document.querySelector('.reset-button')?.removeAttribute('disabled');
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
  await updateWinnersSection('id', 'ASC');
};

export const resetRaceHandler = (): void => {
  document.querySelector('.reset-button')?.setAttribute('disabled', 'true');
  document.querySelector('.race-button')?.removeAttribute('disabled');
  document
    .querySelectorAll('.car')
    .forEach((car) => car.querySelector('.stop-button')?.dispatchEvent(new Event('click')));
};

export const sortTableHandler = async (event: Event): Promise<void> => {
  const tableHeadCell: HTMLTableCellElement = event.target as HTMLTableCellElement;
  const sortOrder: SortOrder = tableHeadCell.dataset.order === 'ASC' ? 'DESC' : 'ASC';
  tableHeadCell.dataset.order = sortOrder;
  (document.querySelectorAll('th') as NodeListOf<HTMLTableCellElement>).forEach(
    (cell: HTMLTableCellElement) => cell.classList.remove('ascending', 'descending')
  );
  tableHeadCell.classList.add(sortOrder === 'ASC' ? 'ascending' : 'descending');
  if (tableHeadCell.classList.contains('car-wins')) {
    await updateWinnersSection('wins', sortOrder);
  } else if (tableHeadCell.classList.contains('car-time')) {
    await updateWinnersSection('time', sortOrder);
  }
};
