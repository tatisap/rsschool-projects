import { Bike } from '../components/bike';
import info from '../data/bikes.json';
import { Numbers } from '../types/enums';
import { IBike } from '../types/types';
import { Searcher } from './search';

const searcher: Searcher = new Searcher();
const bikes: Bike[] = (info as IBike[]).map((bikeInfo: IBike) => new Bike(bikeInfo));

describe('Search', () => {
  it('Should return values containing "b"', () => {
    const searchValue = 'b';
    const searchResult = searcher.getGoodsByName(searchValue, bikes);
    expect(searchResult.length).toBe(Numbers.Two);
    expect(searchResult).toContainEqual(new Bike(info[Numbers.Zero]));
  });
  it('Should return values containing "g"', () => {
    const searchValue = 'g';
    const searchResult = searcher.getGoodsByName(searchValue, bikes);
    expect(searchResult.length).toBe(Numbers.Zero);
  });
  it('Should return values containing "yukon"', () => {
    const searchValue = 'yukon';
    const searchResult = searcher.getGoodsByName(searchValue, bikes);
    expect(searchResult.length).toBe(Numbers.One);
    expect(searchResult).toContainEqual(new Bike(info[Numbers.Eleven]));
  });
});
