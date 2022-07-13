import { IBike, sortOrder } from '../../types/types';
import { Bike } from '../bike';

export class Sorter {
  sort<T extends Bike>(goods: T[], property: keyof IBike, order: sortOrder): T[] {
    goods.sort((a: T, b: T) =>
      a.info[property] > b.info[property] ? 1 : a.info[property] < b.info[property] ? -1 : 0
    );
    return order === 'descending' ? goods.reverse() : goods;
  }
}
