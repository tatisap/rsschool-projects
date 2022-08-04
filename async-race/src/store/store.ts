import { Numbers } from '../types/enums';
import { AnimationId, Car, Winner } from '../types/types';

export default {
  cars: [] as Car[],
  winners: [] as Winner[],
  carsAmount: Numbers.Zero,
  winnersAmount: Numbers.Zero,
  garageCurrentPage: Numbers.One,
  winnersCurrentPage: Numbers.One,
  animate: {} as { [id: string]: AnimationId },
};
