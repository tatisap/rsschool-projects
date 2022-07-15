import { API } from 'nouislider';
import { Numbers } from '../types/enums';
import {
  FilterProperty,
  IBike,
  IViewParameters,
  RangeProperty,
  SortParameters,
} from '../types/types';
import { Filter } from '../utils/filter';
import { Searcher } from '../utils/search';
import { Sorter } from '../utils/sorter';
import { Bike } from './bike';
import { Shop } from './common/shop';
import { Slider } from './common/slider';

export class BikeShop extends Shop<Bike> {
  private searcher: Searcher;
  private sorter: Sorter;
  private filter: Filter<Bike>;
  private viewParameters: IViewParameters;
  private sliders: Slider[];

  constructor(goodsInfo: IBike[]) {
    const goods: Bike[] = goodsInfo.map((item: IBike): Bike => new Bike(item));
    super(goods);
    const goodsAmount: number[] = goodsInfo.map((item: IBike): number => item.amount);
    const goodsYears: number[] = goodsInfo.map((item: IBike): number => item.year);
    const maxAmount = Math.max(...goodsAmount);
    const minAmount = Math.min(...goodsAmount);
    const maxYear = Math.max(...goodsYears);
    const minYear = Math.min(...goodsYears);

    this.searcher = new Searcher();
    this.sorter = new Sorter();
    this.filter = new Filter();
    this.viewParameters = {
      filterParameters: {
        manufacturer: [],
        type: [],
        color: [],
        amount: [],
        year: [],
        isPopular: [],
      },
      rangeParameters: {
        amount: [minAmount, maxAmount],
        year: [minYear, maxYear],
      },
    };
    this.sliders = [
      new Slider('amount', 'amount-start', 'amount-end', minAmount, maxAmount),
      new Slider('year', 'year-start', 'year-end', minYear, maxYear),
    ];
  }
  init(): void {
    super.init();
    this.sliders.forEach((slider: Slider): void => {
      slider.init();
      slider.container.noUiSlider?.on(
        'change',
        (
          values: (number | string)[],
          _handle: number,
          _unencoded: number[],
          _tap: boolean,
          _positions: number[],
          sliderApi: API
        ) => this.filterByRangeHandler(values, sliderApi)
      );
    });

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
    (document.querySelector('.reset-button') as HTMLButtonElement).addEventListener(
      'click',
      (event: Event): void => this.resetFilters(event)
    );
  }
  searchHandler(event: Event): void {
    const searchValue: string = (event.target as HTMLInputElement).value.trim();

    const result: Bike[] = this.searcher.getGoodsByName<Bike>(
      searchValue,
      this.filter.applyViewParameters(this.goods, this.viewParameters)
    );
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
    this.render(this.filter.applyViewParameters(this.goods, this.viewParameters));
  }
  filterHandler(event: Event): void {
    const target: HTMLElement = event.target as HTMLElement;
    if (!target.hasAttribute('data-value')) return;
    const filterProperty: FilterProperty = (target.parentNode as HTMLElement).id as FilterProperty;

    if (!target.classList.contains('active')) {
      this.viewParameters.filterParameters[filterProperty].push(target.dataset.value as string);
      target.classList.add('active');
    } else {
      this.viewParameters.filterParameters[filterProperty] = this.viewParameters.filterParameters[
        filterProperty
      ].filter((value: string): boolean => value !== (target.dataset.value as string));
      target.classList.remove('active');
    }

    this.render(this.filter.applyViewParameters(this.goods, this.viewParameters));
  }
  checkHandler(event: Event): void {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    if (target.checked) {
      this.viewParameters.filterParameters.isPopular.push('true');
    } else {
      this.viewParameters.filterParameters.isPopular = [];
    }
    this.render(this.filter.applyViewParameters(this.goods, this.viewParameters));
  }
  filterByRangeHandler(values: (number | string)[], sliderApi: API): void {
    this.viewParameters.rangeParameters[sliderApi.target.id as RangeProperty] = values as [
      number,
      number
    ];
    this.render(this.filter.applyViewParameters(this.goods, this.viewParameters));
  }
  resetFilters(event: Event): void {
    event.preventDefault();
    (document.getElementById('popular') as HTMLInputElement).checked = false;
    (
      (document.querySelector('.filter-section') as HTMLElement).querySelectorAll(
        '.active'
      ) as NodeListOf<HTMLElement>
    ).forEach((element: HTMLElement): void => element.classList.remove('active'));
    this.sliders.forEach((slider: Slider) => {
      slider.container.noUiSlider?.reset();
      const values: [number, number] = slider.container.noUiSlider?.get(true) as [number, number];
      this.viewParameters.rangeParameters[slider.container.noUiSlider?.target.id as RangeProperty] =
        values;
    });
    this.viewParameters.filterParameters = {
      manufacturer: [],
      type: [],
      color: [],
      amount: [],
      year: [],
      isPopular: [],
    };
    this.render(this.filter.applyViewParameters(this.goods, this.viewParameters));
  }
}
