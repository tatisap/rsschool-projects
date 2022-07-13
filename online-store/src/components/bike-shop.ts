import { FilterParameters, FilterProperty, IBike, SortParameters } from '../types/types';
import { Filter } from './actions/filter';
import { Searcher } from './actions/search';
import { Sorter } from './actions/sorter';
import { Bike } from './bike';
import { Shop } from './common/shop';

export class BikeShop extends Shop<Bike> {
  private searcher: Searcher;
  private sorter: Sorter;
  private filter: Filter;
  private viewParameters: FilterParameters;

  constructor(goodsInfo: IBike[]) {
    const goods: Bike[] = goodsInfo.map((item: IBike) => new Bike(item));
    super(goods);
    this.searcher = new Searcher();
    this.sorter = new Sorter();
    this.filter = new Filter();
    this.viewParameters = {
      manufacturer: [],
      type: [],
      color: [],
      amount: [],
      year: [],
      isPopular: [],
    };
  }
  init(): void {
    super.init();
    (document.querySelector('.search') as HTMLFormElement).addEventListener(
      'input',
      (event: Event) => this.searchHandler(event)
    );
    (document.querySelector('.sort') as HTMLSelectElement).addEventListener(
      'change',
      (event: Event) => this.sortHandler(event)
    );
    (document.querySelector('.filter-section') as HTMLElement).addEventListener(
      'click',
      (event: Event) => this.filterHandler(event)
    );
  }
  searchHandler(event: Event): void {
    const searchValue: string = (event.target as HTMLInputElement).value.trim();

    const result: Bike[] = this.searcher.getGoodsByName<Bike>(searchValue, this.goods);
    (document.querySelector('.cards-list') as HTMLUListElement).innerHTML = '';
    if (result.length !== 0) {
      this.render(result);
    } else {
      (document.querySelector('.cards-list') as HTMLUListElement).append('No results');
    }
  }
  sortHandler(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const [sortProperty, order]: SortParameters = target.options[target.selectedIndex].value.split(
      ','
    ) as SortParameters;

    this.goods = this.sorter.sort<Bike>(this.goods, sortProperty, order);
    (document.querySelector('.cards-list') as HTMLUListElement).innerHTML = '';
    this.render(this.goods);
  }
  filterHandler(event: Event): void {
    const target: HTMLElement = event.target as HTMLElement;
    if (!target.hasAttribute('data-value')) return;
    const filterProperty: FilterProperty = (target.parentNode as HTMLElement).id as FilterProperty;

    this.viewParameters[filterProperty].push(target.dataset.value as string);
    target.classList.add('active');
    const result = this.filter.applyParameters(this.goods, this.viewParameters);
    (document.querySelector('.cards-list') as HTMLUListElement).innerHTML = '';
    this.render(result);
  }
}
