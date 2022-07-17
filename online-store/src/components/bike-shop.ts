import { SORT_PARAMETERS_DIVIDER, WARNING_MESSAGE_TEXT } from '../constants/constants';
import { Numbers } from '../types/enums';
import {
  IBike,
  FilterParameters,
  RangeProperty,
  SortParameters,
  ValueProperty,
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
  private filterParameters: FilterParameters;
  private sortParameters: SortParameters;
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
    this.sortParameters = (this.getParametersFromLocalStorage('sort-parameters') as
      | SortParameters
      | false) || ['name', 'ascending'];
    this.filterParameters = (this.getParametersFromLocalStorage('filter-parameters') as
      | FilterParameters
      | false) || {
      valueParameters: {
        manufacturer: [],
        type: [],
        color: [],
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
    this.render(this.filterGoods(this.sorter.sort<Bike>(this.goods, this.sortParameters)));
    this.sliders.forEach((slider: Slider): void => {
      slider.init();
      slider.container.noUiSlider?.on('change', (values: (number | string)[]) =>
        this.filterByRangeHandler(values as [number, number], slider.container.id as RangeProperty)
      );
    });
    this.setActiveParametersStyle();

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
      (event: Event): void => this.filterByValueHandler(event)
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
    window.addEventListener('beforeunload', (): void => this.setParametersToLocalStorage());
  }
  searchHandler(event: Event): void {
    const searchValue: string = (event.target as HTMLInputElement).value.trim();
    const searchResult: Bike[] = this.searcher.getGoodsByName<Bike>(
      searchValue,
      this.filterGoods(this.goods)
    );
    this.render(searchResult);
    this.switchNoResultMessage();
  }
  sortHandler(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.sortParameters = target.options[target.selectedIndex].value.split(
      SORT_PARAMETERS_DIVIDER
    ) as SortParameters;
    this.render(this.filterGoods(this.sorter.sort<Bike>(this.goods, this.sortParameters)));
  }
  filterByValueHandler(event: Event): void {
    const target: HTMLElement = event.target as HTMLElement;
    if (!target.hasAttribute('data-value')) return;
    const valueProperty: ValueProperty = (target.parentNode as HTMLElement).id as ValueProperty;

    if (!target.classList.contains('active')) {
      this.filterParameters.valueParameters[valueProperty].push(target.dataset.value as string);
      target.classList.add('active');
    } else {
      this.filterParameters.valueParameters[valueProperty] = this.filterParameters.valueParameters[
        valueProperty
      ].filter((value: string): boolean => value !== (target.dataset.value as string));
      target.classList.remove('active');
    }

    this.render(this.filterGoods(this.goods));
    this.switchNoResultMessage();
  }
  filterByRangeHandler(values: [number, number], sliderId: RangeProperty): void {
    this.filterParameters.rangeParameters[sliderId] = values;
    this.render(this.filterGoods(this.goods));
    this.switchNoResultMessage();
  }
  checkHandler(event: Event): void {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    if (target.checked) {
      this.filterParameters.valueParameters.isPopular.push('true');
    } else {
      this.filterParameters.valueParameters.isPopular = [];
    }
    this.render(this.filterGoods(this.goods));
    this.switchNoResultMessage();
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
      this.filterParameters.rangeParameters[slider.id] = slider.getValues();
    });
    (Object.keys(this.filterParameters.valueParameters) as ValueProperty[]).forEach(
      (value: ValueProperty): void => {
        this.filterParameters.valueParameters[value] = [];
      }
    );
    this.render(this.filterGoods(this.goods));
    this.switchNoResultMessage();
  }
  setActiveParametersStyle(): void {
    (Object.keys(this.filterParameters.valueParameters) as ValueProperty[]).forEach(
      (property: ValueProperty): void => {
        this.filterParameters.valueParameters[property].forEach((value: string) =>
          (document.querySelector(`[data-value="${value}"]`) as HTMLElement)?.classList.add(
            'active'
          )
        );
      }
    );
    if (this.filterParameters.valueParameters.isPopular.includes('true')) {
      (document.getElementById('popular') as HTMLInputElement).checked = true;
    }
    (Object.keys(this.filterParameters.rangeParameters) as RangeProperty[]).forEach(
      (property: RangeProperty): void => {
        const slider = this.sliders.find(
          (slider: Slider): boolean => slider.container.id === property
        ) as Slider;
        slider.container.noUiSlider?.set(this.filterParameters.rangeParameters[property]);
      }
    );
  }
  resetSettings(): void {
    this.isSettingsReseted = true;
    localStorage.clear();
  }
  filterGoods(goods: Bike[]): Bike[] {
    return this.filter.filter(goods, this.filterParameters);
  }
  getParametersFromLocalStorage(key: string): SortParameters | FilterParameters | boolean {
    const savedValue = localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : false;
  }
  setParametersToLocalStorage(): void {
    if (this.isSettingsReseted) return;
    localStorage.setItem('filter-parameters', JSON.stringify(this.filterParameters));
    localStorage.setItem('sort-parameters', JSON.stringify(this.sortParameters));
  }
  switchNoResultMessage(): void {
    if (
      (document.querySelector('.cards-list') as HTMLUListElement).children.length === Numbers.Zero
    ) {
      this.noResultsMessage.open();
    } else {
      this.noResultsMessage.close();
    }
  }
}
