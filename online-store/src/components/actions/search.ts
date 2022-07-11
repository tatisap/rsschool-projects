import { Item } from '../item';

export class Searcher {
  getGoodsByName<T extends Item>(value: string, goods: T[]): T[] {
    return goods.filter((item: T) => item.info.name.toLowerCase().includes(value.toLowerCase()));
  }
}
