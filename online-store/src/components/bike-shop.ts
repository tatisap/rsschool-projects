import { API } from 'nouislider';
import { WARNING_MESSAGE_TEXT } from '../constants/constants';
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
import { WarningMessage } from './common/warning-message';

export class BikeShop extends Shop<Bike> {
  private searcher: Searcher;
  private sorter: Sorter;
  private filter: Filter<Bike>;
  private viewParameters: IViewParameters;
  private sliders: Slider[];
  private isSettingsReseted: boolean;
  private noResultsMessage: WarningMessage;

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
    this.isSettingsReseted = false;
    this.noResultsMessage = new WarningMessage(WARNING_MESSAGE_TEXT.noResultsText);
    this.sliders = [
      new Slider('amount', 'amount-start', 'amount-end', minAmount, maxAmount),
      new Slider('year', 'year-start', 'year-end', minYear, maxYear),
    ];
    this.viewParameters = localStorage.getItem('view-parameters')
      ? JSON.parse(localStorage.getItem('view-parameters') as string)
      : {
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
  }
  init(): void {
    super.init();
    this.render(this.filter.applyViewParameters(this.goods, this.viewParameters));
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
    this.noResultsMessage.init();
    this.setActiveStyle();

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
      (event: Event): void => {
        event.preventDefault();
        this.resetFilters();
      }
    );
    (document.querySelector('.reset-settings-button') as HTMLButtonElement).addEventListener(
      'click',
      (): void => this.resetSettings()
    );
    window.addEventListener('beforeunload', (): void => this.saveParameters());
  }
  searchHandler(event: Event): void {
    const searchValue: string = (event.target as HTMLInputElement).value.trim();

    const searchResult: Bike[] = this.searcher.getGoodsByName<Bike>(
      searchValue,
      this.filter.applyViewParameters(this.goods, this.viewParameters)
    );
    if (searchResult.length !== Numbers.Zero) {
      this.noResultsMessage.close();
      this.render(searchResult);
    } else {
      this.noResultsMessage.open();
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
  resetFilters(): void {
    (document.getElementById('popular') as HTMLInputElement).checked = false;
    (
      (document.querySelector('.filter-section') as HTMLElement).querySelectorAll(
        '.active'
      ) as NodeListOf<HTMLElement>
    ).forEach((element: HTMLElement): void => element.classList.remove('active'));
    this.sliders.forEach((slider: Slider) => {
      slider.reset();
      this.viewParameters.rangeParameters[slider.id] = slider.getValues();
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
  saveParameters(): void {
    if (this.isSettingsReseted) return;
    localStorage.setItem('view-parameters', JSON.stringify(this.viewParameters));
  }
  setActiveStyle(): void {
    (Object.keys(this.viewParameters.filterParameters) as FilterProperty[]).forEach(
      (property: FilterProperty): void => {
        this.viewParameters.filterParameters[property].forEach((value: string) =>
          (document.querySelector(`[data-value="${value}"]`) as HTMLElement)?.classList.add(
            'active'
          )
        );
      }
    );
    if (this.viewParameters.filterParameters.isPopular.includes('true')) {
      (document.getElementById('popular') as HTMLInputElement).checked = true;
    }
    (Object.keys(this.viewParameters.rangeParameters) as RangeProperty[]).forEach(
      (property: RangeProperty): void => {
        const slider = this.sliders.find(
          (slider: Slider): boolean => slider.container.id === property
        ) as Slider;
        slider.container.noUiSlider?.set(this.viewParameters.rangeParameters[property]);
      }
    );
  }
  resetSettings(): void {
    this.isSettingsReseted = true;
    localStorage.clear();
  }
}
