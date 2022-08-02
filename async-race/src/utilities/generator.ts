import {
  CAR_BRANDS,
  HASH_SYMBOL,
  HEXADECIMAL_BASE,
  MAX_DECIMAL_NUMBER,
} from '../constants/constants';
import { Numbers } from '../types/enums';
import { Car } from '../types/types';

const generateRandomCarBrand = (brandsList: string[]): string =>
  brandsList[Math.floor(Math.random() * brandsList.length)];

const generateColor = (): string => {
  let color = HASH_SYMBOL;
  for (let i = Numbers.Zero; i < Numbers.Three; i += Numbers.One) {
    color += `${Math.floor(Math.random() * MAX_DECIMAL_NUMBER).toString(HEXADECIMAL_BASE)}`;
  }
  return color;
};

export default (): Omit<Car, 'id'> => {
  return {
    name: generateRandomCarBrand(CAR_BRANDS),
    color: generateColor(),
  };
};
