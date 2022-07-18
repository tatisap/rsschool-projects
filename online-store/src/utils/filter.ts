import { Numbers } from '../types/enums';
import {
  ValueParameters,
  ValueProperty,
  FilterParameters,
  RangeParameters,
  RangeProperty,
} from '../types/types';
import { Bike } from '../components/bike';

export class Filter<T extends Bike> {
  filter(goods: T[], parameters: FilterParameters): T[] {
    const filteredByValueGoods = this.filterByValue(goods, parameters.valueParameters);
    return this.filterByRange(filteredByValueGoods, parameters.rangeParameters);
  }
  filterByValue(goods: T[], parameters: ValueParameters): T[] {
    let filteredGoods: T[] = goods;
    (Object.keys(parameters) as ValueProperty[]).forEach((property: ValueProperty): void => {
      if (parameters[property].length === Numbers.Zero) return;
      filteredGoods = filteredGoods.filter((item: T): boolean =>
        parameters[property].includes(`${item.info[property]}`)
      );
    });
    return filteredGoods;
  }
  filterByRange(goods: T[], parameters: RangeParameters): T[] {
    let filteredGoods: T[] = goods;
    (Object.keys(parameters) as RangeProperty[]).forEach((property: RangeProperty): void => {
      filteredGoods = filteredGoods.filter(
        (item: T): boolean =>
          parameters[property][Numbers.Zero] <= item.info[property] &&
          parameters[property][Numbers.One] >= item.info[property]
      );
    });
    return filteredGoods;
  }
}
