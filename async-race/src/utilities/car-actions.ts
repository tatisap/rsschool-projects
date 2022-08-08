import API from '../api/api';
import { MSEC_PER_SEC, NO_CONTENT } from '../constants/constants';
import store from '../store/store';
import { Numbers } from '../types/enums';
import { AnimationId, MoveParameters, RaceResult } from '../types/types';
import { animate, getDistanceBetweenTwoElements } from './animation';

export const startCar = async (carElement: HTMLLIElement): Promise<RaceResult> => {
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
  return { success, id: car.id, time: Number((time / MSEC_PER_SEC).toFixed(Numbers.Three)) };
};

export const stopCar = async (carElement: HTMLLIElement): Promise<void> => {
  (carElement.querySelector('.stop-button') as HTMLButtonElement).setAttribute('disabled', 'true');
  const carImage: HTMLDivElement = carElement.querySelector('.car__image') as HTMLDivElement;
  await API.stopEngine(Number(carElement.id));
  window.cancelAnimationFrame(store.animate[carElement.id].value);
  carImage.style.transform = NO_CONTENT;
  (carElement.querySelector('.start-button') as HTMLButtonElement).removeAttribute('disabled');
};

export const race = async (
  carsPromises: Promise<RaceResult>[],
  ids: string[]
): Promise<RaceResult> => {
  if (carsPromises.length === Numbers.Zero) return { success: false };
  const firstResult: RaceResult = await Promise.race(carsPromises);
  if (!firstResult.success) {
    const restCarsPromises: Promise<RaceResult>[] = carsPromises.filter(
      (promise: Promise<RaceResult>, index: number): boolean => ids[index] !== firstResult.id
    );
    return race(
      restCarsPromises,
      ids.filter((id: string): boolean => id !== firstResult.id)
    );
  }
  return firstResult;
};
