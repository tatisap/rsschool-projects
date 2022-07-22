import { Bike } from '../components/bike';

export class Searcher {
  public getGoodsByName<T extends Bike>(value: string, goods: T[]): T[] {
    return goods.filter((goodsItem: T): boolean =>
      goodsItem.info.name.toLowerCase().includes(value.toLowerCase())
    );
  }
}
