import { SORT_ORDER } from '../constants/constants';
import { Numbers } from '../types/enums';
import { SortParameters } from '../types/types';
import { Bike } from '../components/bike';

export class Sorter {
  public sort<T extends Bike>(goods: T[], [property, order]: SortParameters): T[] {
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
