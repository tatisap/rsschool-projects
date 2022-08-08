import { Numbers } from '../types/enums';
import { AnimationId } from '../types/types';
import { createTranslateValueText } from './text-makers';

export const getDistanceBetweenTwoElements = (
  elementA: HTMLElement,
  elementB: HTMLElement
): number => {
  return Math.abs(elementA.getBoundingClientRect().x - elementB.getBoundingClientRect().x);
};

export const animate = (car: HTMLDivElement, distance: number, moveTime: number): AnimationId => {
  const carElement = car;
  let start: number = Numbers.Zero;
  const id: AnimationId = { value: Numbers.Zero };
  const move = (timestamp: number): void => {
    if (!start) start = timestamp;
    const time: number = timestamp - start;
    const passedDistance: number = Math.floor((time * distance) / moveTime);
    carElement.style.transform = createTranslateValueText(Math.min(passedDistance, distance));
    if (passedDistance < distance) {
      id.value = window.requestAnimationFrame(move);
    }
  };
  id.value = window.requestAnimationFrame(move);
  return id;
};
