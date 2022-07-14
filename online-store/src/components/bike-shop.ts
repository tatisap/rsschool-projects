import { Numbers } from '../types/enums';
import { FilterParameters, FilterProperty, IBike, SortParameters } from '../types/types';
import { Filter } from '../utils/filter';
import { Searcher } from '../utils/search';
import { Sorter } from '../utils/sorter';
import { Bike } from './bike';
import { Shop } from './common/shop';
import { Slider } from './common/slider';

export class BikeShop extends Shop<Bike> {
  private searcher: Searcher;
  private sorter: Sorter;
  private filter: Filter;
  private viewParameters: FilterParameters;
  private sliders: Slider[];

  constructor(goodsInfo: IBike[]) {
    const goods: Bike[] = goodsInfo.map((item: IBike): Bike => new Bike(item));
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
    this.sliders = [
      new Slider('amount', 'amount-start', 'amount-end', 1, 10),
      new Slider('year', 'year-start', 'year-end', 2010, 2022),
    ];
  }
  init(): void {
    super.init();
    this.sliders.forEach((slider: Slider): void => slider.init());
    (document.querySelector('.search') as HTMLFormElement).addEventListener(
      'input',
      (event: Event): void => this.searchHandler(event)
    );
    (document.querySelector('.sort') as HTMLSelectElement).addEventListener(
      'change',
      (event: Event): void => this.sortHandler(event)
    );
    (document.querySelector('.filter-section') as HTMLElement).addEventListener(
      'click',
      (event: Event): void => this.filterHandler(event)
    );
    (document.getElementById('popular') as HTMLInputElement).addEventListener(
      'change',
      (event: Event): void => this.checkHandler(event)
    );
  }
  searchHandler(event: Event): void {
    const searchValue: string = (event.target as HTMLInputElement).value.trim();

    const result: Bike[] = this.searcher.getGoodsByName<Bike>(
      searchValue,
      this.filter.applyParameters(this.goods, this.viewParameters)
    );
    (document.querySelector('.cards-list') as HTMLUListElement).innerHTML = '';
    if (result.length !== Numbers.Zero) {
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
    this.render(this.filter.applyParameters(this.goods, this.viewParameters));
  }
  filterHandler(event: Event): void {
    const target: HTMLElement = event.target as HTMLElement;
    if (!target.hasAttribute('data-value')) return;
    const filterProperty: FilterProperty = (target.parentNode as HTMLElement).id as FilterProperty;

    if (!target.classList.contains('active')) {
      this.viewParameters[filterProperty].push(target.dataset.value as string);
      target.classList.add('active');
    } else {
      this.viewParameters[filterProperty] = this.viewParameters[filterProperty].filter(
        (value: string): boolean => value !== (target.dataset.value as string)
      );
      target.classList.remove('active');
    }

    (document.querySelector('.cards-list') as HTMLUListElement).innerHTML = '';
    this.render(this.filter.applyParameters(this.goods, this.viewParameters));
  }
  checkHandler(event: Event): void {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    if (target.checked) {
      this.viewParameters.isPopular.push('true');
    } else {
      this.viewParameters.isPopular = [];
    }
    (document.querySelector('.cards-list') as HTMLUListElement).innerHTML = '';
    this.render(this.filter.applyParameters(this.goods, this.viewParameters));
  }
}
