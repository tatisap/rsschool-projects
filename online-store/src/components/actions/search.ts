import { Bike } from '../bike';

export class Searcher {
  getGoodsByName<T extends Bike>(value: string, goods: T[]): T[] {
    return goods.filter((item: T) => item.info.name.toLowerCase().includes(value.toLowerCase()));
  }
}
