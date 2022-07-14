import { Numbers } from '../types/enums';
import {
  FilterParameters,
  FilterProperty,
  IViewParameters,
  RangeParameters,
  RangeProperty,
} from '../types/types';
import { Bike } from '../components/bike';

export class Filter<T extends Bike> {
  private filteredGoods: T[];

  constructor() {
    this.filteredGoods = [];
  }

  applyViewParameters(goods: T[], parameters: IViewParameters): T[] {
    this.filteredGoods = goods;
    this.applyFilterParameters(parameters.filterParameters);
    this.applyRangeParameters(parameters.rangeParameters);
    (document.querySelector('.cards-list') as HTMLUListElement).innerHTML = '';
    return this.filteredGoods;
  }
  applyFilterParameters(parameters: FilterParameters): void {
    (Object.keys(parameters) as FilterProperty[]).forEach((property: FilterProperty): void => {
      if (parameters[property].length === Numbers.Zero) return;
      this.filteredGoods = this.filteredGoods.filter((item: T): boolean =>
        parameters[property].includes(`${item.info[property]}`)
      );
    });
  }
  applyRangeParameters(parameters: RangeParameters): void {
    (Object.keys(parameters) as RangeProperty[]).forEach((property: RangeProperty): void => {
      this.filteredGoods = this.filteredGoods.filter(
        (item: T): boolean =>
          parameters[property][Numbers.Zero] <= item.info[property] &&
          parameters[property][Numbers.One] >= item.info[property]
      );
    });
  }
}
