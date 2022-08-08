import { CAR_BRANDS, CAR_MODELS, HASH_SYMBOL, HEXADECIMAL_BASE } from '../constants/constants';
import { Numbers } from '../types/enums';
import { Car } from '../types/types';

const generateRandomCarBrand = (brandsList: string[], modelsList: string[]): string =>
  `${brandsList[Math.floor(Math.random() * brandsList.length)]} ${
    modelsList[Math.floor(Math.random() * modelsList.length)]
  }`;

const generateColor = (): string => {
  let color: string = HASH_SYMBOL;
  for (let i = Numbers.Zero; i < Numbers.Six; i += Numbers.One) {
    color += `${Math.floor(Math.random() * HEXADECIMAL_BASE).toString(HEXADECIMAL_BASE)}`;
  }
  return color;
};

export default (): Omit<Car, 'id'> => {
  return {
    name: generateRandomCarBrand(CAR_BRANDS, CAR_MODELS),
    color: generateColor(),
  };
};
