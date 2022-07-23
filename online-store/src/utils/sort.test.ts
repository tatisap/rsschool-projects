import { Sorter } from './sorter';
import info from '../data/bikes.json';
import { IBike, SortParameters } from '../types/types';
import { Bike } from '../components/bike';
import { Numbers } from '../types/enums';

const sorter: Sorter = new Sorter();
const bikes: Bike[] = (info as IBike[]).map((bikeInfo: IBike) => new Bike(bikeInfo));

describe('Sort', () => {
  it('Should sort by name in ascending order', () => {
    const sortParameters: SortParameters = ['name', 'ascending'];
    const sortedBikes = sorter.sort(bikes, sortParameters);
    expect(sortedBikes).toEqual(bikes);
  });
  it('Should sort by name in descending order', () => {
    const sortParameters: SortParameters = ['name', 'descending'];
    const sortedBikes = sorter.sort(bikes, sortParameters);
    expect(sortedBikes).toEqual(bikes.reverse());
  });
  it('Should sort by year in ascending order', () => {
    const sortParameters: SortParameters = ['year', 'ascending'];
    const sortedBikes = sorter.sort(bikes, sortParameters);
    expect(sortedBikes[Numbers.Zero].info.id).toBe(Numbers.Ten);
    expect(sortedBikes[Numbers.Three].info.id).toBe(Numbers.Five);
    expect(sortedBikes[Numbers.Six].info.id).toBe(Numbers.Eight);
    expect(sortedBikes[Numbers.Eleven].info.id).toBe(Numbers.Nine);
  });
  it('Should sort by year in descending order', () => {
    const sortParameters: SortParameters = ['year', 'descending'];
    const sortedBikes = sorter.sort(bikes, sortParameters);
    expect(sortedBikes[Numbers.One].info.id).toBe(Numbers.Seven);
    expect(sortedBikes[Numbers.Four].info.id).toBe(Numbers.Eleven);
    expect(sortedBikes[Numbers.Six].info.id).toBe(Numbers.Six);
    expect(sortedBikes[Numbers.Ten].info.id).toBe(Numbers.Twelve);
  });
});
