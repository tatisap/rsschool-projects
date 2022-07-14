import { Numbers } from '../types/enums';
import { FilterParameters, FilterProperty } from '../types/types';
import { Bike } from '../components/bike';

export class Filter {
  applyParameters<T extends Bike>(goods: T[], parameters: FilterParameters): T[] {
    let result: T[] = [].concat.apply(goods);
    (Object.keys(parameters) as FilterProperty[]).forEach((property: FilterProperty): void => {
      if (parameters[property].length === Numbers.Zero) return;
      result = result.filter((item: T): boolean =>
        parameters[property].includes(`${item.info[property]}`)
      );
    });
    return result;
  }
}
