import { HASH_SYMBOL, HEXADECIMAL_BASE } from '../constants/others-constants';
import CAR_BRANDS from '../constants/car-brands';
import CAR_MODELS from '../constants/car-models';
import { Numbers } from '../types/enums';
import { Car } from '../types/types';

const generateRandomCarName = (brandsList: string[], modelsList: string[]): string =>
  `${brandsList[Math.floor(Math.random() * brandsList.length)]} ${
    modelsList[Math.floor(Math.random() * modelsList.length)]
  }`;

const generateRandomColor = (): string => {
  let color: string = HASH_SYMBOL;
  for (let i = Numbers.Zero; i < Numbers.Six; i += Numbers.One) {
    color += `${Math.floor(Math.random() * HEXADECIMAL_BASE).toString(HEXADECIMAL_BASE)}`;
  }
  return color;
};

export default (): Omit<Car, 'id'> => {
  return {
    name: generateRandomCarName(CAR_BRANDS, CAR_MODELS),
    color: generateRandomColor(),
  };
};
