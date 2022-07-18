import { Sorter } from './sorter';
import info from '../data/bikes.json';
import { IBike, SortParameters } from '../types/types';
import { Bike } from '../components/bike';

const sorter: Sorter = new Sorter();
const bikes: Bike[] = (info as IBike[]).map((itemInfo: IBike) => new Bike(itemInfo));

describe('Sort', () => {
  it('By name in ascending order', () => {
    const sortParameters: SortParameters = ['name', 'ascending'];
    const sortedBikes = sorter.sort(bikes, sortParameters);
    expect(sortedBikes).toEqual(bikes);
  });
  it('By name in descending order', () => {
    const sortParameters: SortParameters = ['name', 'descending'];
    const sortedBikes = sorter.sort(bikes, sortParameters);
    expect(sortedBikes).toEqual(bikes.reverse());
  });
  it('By year in ascending order', () => {
    const sortParameters: SortParameters = ['year', 'ascending'];
    const sortedBikes = sorter.sort(bikes, sortParameters);
    expect(sortedBikes[0].info.id).toBe(10);
    expect(sortedBikes[3].info.id).toBe(5);
    expect(sortedBikes[6].info.id).toBe(8);
    expect(sortedBikes[11].info.id).toBe(9);
  });
  it('By year in descending order', () => {
    const sortParameters: SortParameters = ['year', 'descending'];
    const sortedBikes = sorter.sort(bikes, sortParameters);
    expect(sortedBikes[1].info.id).toBe(7);
    expect(sortedBikes[4].info.id).toBe(11);
    expect(sortedBikes[6].info.id).toBe(6);
    expect(sortedBikes[10].info.id).toBe(12);
  });
});
