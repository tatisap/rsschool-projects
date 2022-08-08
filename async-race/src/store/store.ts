import { SORT_KEY, SORT_ORDER } from '../constants/others-constants';
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
  sortKey: SORT_KEY.id,
  sortOrder: SORT_ORDER.ascending,
  isRaceStarted: false,
} as IStore;
