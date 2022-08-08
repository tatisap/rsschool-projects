import API from '../api/api';
import { MSEC_PER_SEC, NO_CONTENT } from '../constants/others-constants';
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
  const totalMoveTime: number = moveParameters.distance / moveParameters.velocity;
  const totalDistance: number = getDistanceBetweenTwoElements(startPoint, finishPoint);
  const animationFrameId: AnimationId = animate(startPoint, totalDistance, totalMoveTime);
  store.animate[car.id] = animationFrameId;
  const { success } = await API.switchEngineToDriveMode(Number(car.id));
  if (!success) {
    window.cancelAnimationFrame(animationFrameId.value);
    return { success, id: car.id };
  }
  return {
    success,
    id: car.id,
    time: Number((totalMoveTime / MSEC_PER_SEC).toFixed(Numbers.Three)),
  };
};

export const stopCar = async (carElement: HTMLLIElement): Promise<void> => {
  (carElement.querySelector('.stop-button') as HTMLButtonElement).setAttribute('disabled', 'true');
  await API.stopEngine(Number(carElement.id));
  window.cancelAnimationFrame(store.animate[carElement.id].value);
  const carImage: HTMLDivElement = carElement.querySelector('.car__image') as HTMLDivElement;
  carImage.style.transform = NO_CONTENT;
  (carElement.querySelector('.start-button') as HTMLButtonElement).removeAttribute('disabled');
};

export const race = async (
  carsPromises: Promise<RaceResult>[],
  carsIds: string[]
): Promise<RaceResult> => {
  if (carsPromises.length === Numbers.Zero) return { success: false };
  const firstResult: RaceResult = await Promise.race(carsPromises);
  if (!firstResult.success) {
    const restCarsPromises: Promise<RaceResult>[] = carsPromises.filter(
      (_, index: number): boolean => carsIds[index] !== firstResult.id
    );
    return race(
      restCarsPromises,
      carsIds.filter((id: string): boolean => id !== firstResult.id)
    );
  }
  return firstResult;
};
