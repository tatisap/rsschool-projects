import { Numbers } from '../types/enums';
import { IStore } from '../types/types';

export default {
  cars: [],
  winners: [],
  carsAmount: Numbers.Zero,
  winnersAmount: Numbers.Zero,
  garageCurrentPage: Numbers.One,
  winnersCurrentPage: Numbers.One,
  animate: {},
  sortKey: 'id',
  sortOrder: 'ASC',
  isRaceStarted: false,
} as IStore;
