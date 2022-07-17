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
  private filteredGoods: T[];

  constructor() {
    this.filteredGoods = [];
  }

  filter(goods: T[], parameters: FilterParameters): T[] {
    this.filteredGoods = goods;
    this.filterByValue(parameters.valueParameters);
    this.filterByRange(parameters.rangeParameters);
    return this.filteredGoods;
  }
  filterByValue(parameters: ValueParameters): void {
    (Object.keys(parameters) as ValueProperty[]).forEach((property: ValueProperty): void => {
      if (parameters[property].length === Numbers.Zero) return;
      this.filteredGoods = this.filteredGoods.filter((item: T): boolean =>
        parameters[property].includes(`${item.info[property]}`)
      );
    });
  }
  filterByRange(parameters: RangeParameters): void {
    (Object.keys(parameters) as RangeProperty[]).forEach((property: RangeProperty): void => {
      this.filteredGoods = this.filteredGoods.filter(
        (item: T): boolean =>
          parameters[property][Numbers.Zero] <= item.info[property] &&
          parameters[property][Numbers.One] >= item.info[property]
      );
    });
  }
}
