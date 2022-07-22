import { Bike } from '../components/bike';
import { Filter } from './filter';
import info from '../data/bikes.json';
import { FilterParameters, IBike, RangeParameters, ValueParameters } from '../types/types';

const filter: Filter<Bike> = new Filter<Bike>();
const bikes: Bike[] = (info as IBike[]).map((bikeInfo: IBike) => new Bike(bikeInfo));
let valueParameters: ValueParameters = {
  manufacturer: [],
  type: [],
  color: [],
  isPopular: [],
};
let rangeParameters: RangeParameters = {
  amount: [1, 10],
  year: [2010, 2022],
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
    expect(filteredBikes.length).toBe(3);
    expect(filteredBikes).toContainEqual(new Bike(info[1]));
    expect(filteredBikes).toContainEqual(new Bike(info[8]));
    expect(filteredBikes).toContainEqual(new Bike(info[9]));
    expect(filteredBikes).not.toContainEqual(new Bike(info[0]));
  });
  it('Should return only road and gravel types', () => {
    valueParameters.type = ['road', 'gravel'];
    const filteredBikes = filter.filterByValue(bikes, valueParameters);
    expect(filteredBikes.length).toBe(8);
    expect(filteredBikes).toContainEqual(new Bike(info[0]));
    expect(filteredBikes).toContainEqual(new Bike(info[1]));
    expect(filteredBikes).toContainEqual(new Bike(info[2]));
    expect(filteredBikes).not.toContainEqual(new Bike(info[9]));
  });
  it('Should return only green and blue color', () => {
    valueParameters.color = ['green', 'blue'];
    const filteredBikes = filter.filterByValue(bikes, valueParameters);
    expect(filteredBikes.length).toBe(4);
    expect(filteredBikes).toContainEqual(new Bike(info[2]));
    expect(filteredBikes).toContainEqual(new Bike(info[3]));
    expect(filteredBikes).toContainEqual(new Bike(info[9]));
    expect(filteredBikes).not.toContainEqual(new Bike(info[4]));
  });
});

describe('FilterByValue', () => {
  beforeEach(() => {
    rangeParameters = {
      amount: [1, 10],
      year: [2010, 2022],
    };
  });
  it('Should return from 3 to 5 items in stock', () => {
    rangeParameters.amount = [3, 5];
    const filteredBikes = filter.filterByRange(bikes, rangeParameters);
    expect(filteredBikes.length).toBe(5);
    expect(filteredBikes).toContainEqual(new Bike(info[4]));
    expect(filteredBikes).toContainEqual(new Bike(info[5]));
    expect(filteredBikes).not.toContainEqual(new Bike(info[6]));
    expect(filteredBikes).not.toContainEqual(new Bike(info[7]));
  });
  it('Should return manufactured from 2015 to 2020', () => {
    rangeParameters.year = [2015, 2020];
    const filteredBikes = filter.filterByRange(bikes, rangeParameters);
    expect(filteredBikes.length).toBe(6);
    expect(filteredBikes).toContainEqual(new Bike(info[5]));
    expect(filteredBikes).toContainEqual(new Bike(info[6]));
    expect(filteredBikes).not.toContainEqual(new Bike(info[4]));
    expect(filteredBikes).not.toContainEqual(new Bike(info[8]));
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
        amount: [1, 10],
        year: [2010, 2022],
      },
    };
  });
  it('Should return road bikes which manufactured in 2012', () => {
    parameters.valueParameters.type = ['road'];
    parameters.rangeParameters.year = [2012, 2012];
    const filteredBikes = filter.filter(bikes, parameters);
    expect(filteredBikes.length).toBe(2);
    expect(filteredBikes).toContainEqual(new Bike(info[1]));
    expect(filteredBikes).toContainEqual(new Bike(info[4]));
    expect(filteredBikes).not.toContainEqual(new Bike(info[6]));
    expect(filteredBikes).not.toContainEqual(new Bike(info[7]));
  });
  it('Should return popular bikes which is 2 in stock', () => {
    parameters.valueParameters.isPopular = ['true'];
    parameters.rangeParameters.amount = [2, 2];
    const filteredBikes = filter.filter(bikes, parameters);
    expect(filteredBikes.length).toBe(4);
    expect(filteredBikes).toContainEqual(new Bike(info[1]));
    expect(filteredBikes).toContainEqual(new Bike(info[3]));
    expect(filteredBikes).not.toContainEqual(new Bike(info[0]));
    expect(filteredBikes).not.toContainEqual(new Bike(info[11]));
  });
});
