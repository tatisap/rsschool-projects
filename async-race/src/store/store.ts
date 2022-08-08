import { Numbers } from '../types/enums';
import { AnimationId, Car, SortKey, SortOrder, Winner } from '../types/types';

export default {
  cars: [] as Car[],
  winners: [] as Winner[],
  carsAmount: Numbers.Zero,
  winnersAmount: Numbers.Zero,
  garageCurrentPage: Numbers.One,
  winnersCurrentPage: Numbers.One,
  animate: {} as { [id: string]: AnimationId },
  sortKey: 'id' as SortKey,
  sortOrder: 'ASC' as SortOrder,
  isRaceStarted: false,
};
