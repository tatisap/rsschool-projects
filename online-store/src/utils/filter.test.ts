import { Bike } from '../components/bike';
import { Filter } from './filter';
import info from '../data/bikes.json';
import { FilterParameters, IBike, RangeParameters, ValueParameters } from '../types/types';
import { Numbers } from '../types/enums';
import { INITIAL_RANGE_VALUES } from '../constants/test-constants';

const filter: Filter<Bike> = new Filter<Bike>();
const bikes: Bike[] = (info as IBike[]).map((bikeInfo: IBike) => new Bike(bikeInfo));

let valueParameters: ValueParameters = {
  manufacturer: [],
  type: [],
  color: [],
  isPopular: [],
};
let rangeParameters: RangeParameters = {
  amount: [INITIAL_RANGE_VALUES.amount.start, INITIAL_RANGE_VALUES.amount.end],
  year: [INITIAL_RANGE_VALUES.amount.start, INITIAL_RANGE_VALUES.year.end],
};
let parameters: FilterParameters = {
  valueParameters: valueParameters,
  rangeParameters: rangeParameters,
};

describe('FilterByValue', () => {
  beforeEach(() => {
    valueParameters = {
      manufacturer: [],
      type: [],
      color: [],
      isPopular: [],
    };
  });
  it('Should return only Cannondales', () => {
    valueParameters.manufacturer = ['Cannondale'];
    const filteredBikes = filter.filterByValue(bikes, valueParameters);
    expect(filteredBikes.length).toBe(Numbers.Three);
    expect(filteredBikes).toContainEqual(new Bike(info[Numbers.One]));
    expect(filteredBikes).toContainEqual(new Bike(info[Numbers.Eight]));
    expect(filteredBikes).toContainEqual(new Bike(info[Numbers.Nine]));
    expect(filteredBikes).not.toContainEqual(new Bike(info[Numbers.Zero]));
  });
  it('Should return only road and gravel types', () => {
    valueParameters.type = ['road', 'gravel'];
    const filteredBikes = filter.filterByValue(bikes, valueParameters);
    expect(filteredBikes.length).toBe(Numbers.Eight);
    expect(filteredBikes).toContainEqual(new Bike(info[Numbers.Zero]));
    expect(filteredBikes).toContainEqual(new Bike(info[Numbers.One]));
    expect(filteredBikes).toContainEqual(new Bike(info[Numbers.Two]));
    expect(filteredBikes).not.toContainEqual(new Bike(info[Numbers.Nine]));
  });
  it('Should return only green and blue color', () => {
    valueParameters.color = ['green', 'blue'];
    const filteredBikes = filter.filterByValue(bikes, valueParameters);
    expect(filteredBikes.length).toBe(Numbers.Four);
    expect(filteredBikes).toContainEqual(new Bike(info[Numbers.Two]));
    expect(filteredBikes).toContainEqual(new Bike(info[Numbers.Three]));
    expect(filteredBikes).toContainEqual(new Bike(info[Numbers.Nine]));
    expect(filteredBikes).not.toContainEqual(new Bike(info[Numbers.Four]));
  });
});

describe('FilterByValue', () => {
  beforeEach(() => {
    rangeParameters = {
      amount: [INITIAL_RANGE_VALUES.amount.start, INITIAL_RANGE_VALUES.amount.end],
      year: [INITIAL_RANGE_VALUES.year.start, INITIAL_RANGE_VALUES.year.end],
    };
  });
  it('Should return from 3 to 5 items in stock', () => {
    rangeParameters.amount = [3, 5];
    const filteredBikes = filter.filterByRange(bikes, rangeParameters);
    expect(filteredBikes.length).toBe(Numbers.Five);
    expect(filteredBikes).toContainEqual(new Bike(info[Numbers.Four]));
    expect(filteredBikes).toContainEqual(new Bike(info[Numbers.Five]));
    expect(filteredBikes).not.toContainEqual(new Bike(info[Numbers.Six]));
    expect(filteredBikes).not.toContainEqual(new Bike(info[Numbers.Seven]));
  });
  it('Should return manufactured from 2015 to 2020', () => {
    rangeParameters.year = [2015, 2020];
    const filteredBikes = filter.filterByRange(bikes, rangeParameters);
    expect(filteredBikes.length).toBe(Numbers.Six);
    expect(filteredBikes).toContainEqual(new Bike(info[Numbers.Five]));
    expect(filteredBikes).toContainEqual(new Bike(info[Numbers.Six]));
    expect(filteredBikes).not.toContainEqual(new Bike(info[Numbers.Four]));
    expect(filteredBikes).not.toContainEqual(new Bike(info[Numbers.Eight]));
  });
});

describe('MixedFilter', () => {
  beforeEach(() => {
    parameters = {
      valueParameters: {
        manufacturer: [],
        type: [],
        color: [],
        isPopular: [],
      },
      rangeParameters: {
        amount: [INITIAL_RANGE_VALUES.amount.start, INITIAL_RANGE_VALUES.amount.end],
        year: [INITIAL_RANGE_VALUES.year.start, INITIAL_RANGE_VALUES.year.end],
      },
    };
  });
  it('Should return road bikes which manufactured in 2012', () => {
    parameters.valueParameters.type = ['road'];
    parameters.rangeParameters.year = [2012, 2012];
    const filteredBikes = filter.filterGoods(bikes, parameters);
    expect(filteredBikes.length).toBe(Numbers.Two);
    expect(filteredBikes).toContainEqual(new Bike(info[Numbers.One]));
    expect(filteredBikes).toContainEqual(new Bike(info[Numbers.Four]));
    expect(filteredBikes).not.toContainEqual(new Bike(info[Numbers.Six]));
    expect(filteredBikes).not.toContainEqual(new Bike(info[Numbers.Seven]));
  });
  it('Should return popular bikes which is 2 in stock', () => {
    parameters.valueParameters.isPopular = ['true'];
    parameters.rangeParameters.amount = [2, 2];
    const filteredBikes = filter.filterGoods(bikes, parameters);
    expect(filteredBikes.length).toBe(Numbers.Four);
    expect(filteredBikes).toContainEqual(new Bike(info[Numbers.One]));
    expect(filteredBikes).toContainEqual(new Bike(info[Numbers.Three]));
    expect(filteredBikes).not.toContainEqual(new Bike(info[Numbers.Zero]));
    expect(filteredBikes).not.toContainEqual(new Bike(info[Numbers.Eleven]));
  });
});
