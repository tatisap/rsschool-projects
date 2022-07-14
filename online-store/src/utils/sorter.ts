import { SORT_ORDER } from '../constants/constants';
import { Numbers } from '../types/enums';
import { IBike, sortOrder } from '../types/types';
import { Bike } from '../components/bike';

export class Sorter {
  sort<T extends Bike>(goods: T[], property: keyof IBike, order: sortOrder): T[] {
    goods.sort((a: T, b: T): number =>
      a.info[property] > b.info[property]
        ? Numbers.One
        : a.info[property] < b.info[property]
        ? -Numbers.One
        : Numbers.Zero
    );
    return order === SORT_ORDER.descending ? goods.reverse() : goods;
  }
}
