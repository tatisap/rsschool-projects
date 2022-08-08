import { Numbers } from '../types/enums';
import { AnimationId } from '../types/types';
import { createTranslateValueText } from './text-makers';

export const getDistanceBetweenTwoElements = (
  elementA: HTMLElement,
  elementB: HTMLElement
): number => {
  return Math.abs(elementA.getBoundingClientRect().x - elementB.getBoundingClientRect().x);
};

export const animate = (
  car: HTMLDivElement,
  totalDistance: number,
  totalMoveTime: number
): AnimationId => {
  const carElement: HTMLDivElement = car;
  let start: number = Numbers.Zero;
  const animationFrameId: AnimationId = { value: Numbers.Zero };
  const moveCar = (timestamp: number): void => {
    if (!start) start = timestamp;
    const passedTime: number = timestamp - start;
    const passedDistance: number = Math.floor((passedTime * totalDistance) / totalMoveTime);
    carElement.style.transform = createTranslateValueText(Math.min(passedDistance, totalDistance));
    if (passedDistance < totalDistance) {
      animationFrameId.value = window.requestAnimationFrame(moveCar);
    }
  };
  animationFrameId.value = window.requestAnimationFrame(moveCar);
  return animationFrameId;
};
