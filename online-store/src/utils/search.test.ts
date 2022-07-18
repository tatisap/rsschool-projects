import { Bike } from '../components/bike';
import info from '../data/bikes.json';
import { IBike } from '../types/types';
import { Searcher } from './search';

const searcher: Searcher = new Searcher();
const bikes: Bike[] = (info as IBike[]).map((itemInfo: IBike) => new Bike(itemInfo));

describe('Search', () => {
  it('When search value is "b"', () => {
    const searchValue = 'b';
    const searchResult = searcher.getGoodsByName(searchValue, bikes);
    expect(searchResult.length).toBe(2);
    expect(searchResult).toContainEqual(new Bike(info[0]));
  });
  it('When search value is "g"', () => {
    const searchValue = 'g';
    const searchResult = searcher.getGoodsByName(searchValue, bikes);
    expect(searchResult.length).toBe(0);
  });
  it('When search value is "yukon"', () => {
    const searchValue = 'yukon';
    const searchResult = searcher.getGoodsByName(searchValue, bikes);
    expect(searchResult.length).toBe(1);
    expect(searchResult).toContainEqual(new Bike(info[11]));
  });
});
