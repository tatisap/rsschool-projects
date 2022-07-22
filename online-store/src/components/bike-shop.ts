import {
  DEFAULT_SORT_PARAMETERS,
  LOCAL_STORAGE_KEYS,
  SLIDER_ELEMENTS_ID,
  SORT_PARAMETERS_DIVIDER,
  WARNING_MESSAGE_TEXT,
} from '../constants/constants';
import { Boolean, Numbers } from '../types/enums';
import {
  IBike,
  FilterParameters,
  RangeProperty,
  SortParameters,
  ValueProperty,
} from '../types/types';
import { Filter } from '../utils/filter';
import { LocalStorageManager } from '../utils/local-storage-manager';
import { FilterParametersManager } from '../utils/filter-parameters-manager';
import { Searcher } from '../utils/search';
import { Sorter } from '../utils/sorter';
import { Bike } from './bike';
import { Shop } from './common/shop';
import { Slider } from './common/slider';
import { WarningMessage } from './common/warning-message';

export class BikeShop extends Shop<Bike> {
  private readonly searcher: Searcher;
  private readonly sorter: Sorter;
  private readonly filter: Filter<Bike>;
  private readonly noResultsMessage: WarningMessage;
  public readonly filterParametersManager: FilterParametersManager;
  public readonly localStorageManager: LocalStorageManager;
  public readonly sliders: Slider[];
  public sortParameters: SortParameters;
  private isSettingsReseted: boolean;
  public filterParameters: FilterParameters;
  public searchValue: string;

  constructor(goodsInfo: IBike[]) {
    const goods: Bike[] = goodsInfo.map((bikeInfo: IBike): Bike => new Bike(bikeInfo));
    super(goods);
    const goodsAmount: number[] = goodsInfo.map((bikeInfo: IBike): number => bikeInfo.amount);
    const goodsYears: number[] = goodsInfo.map((bikeInfo: IBike): number => bikeInfo.year);
    const maxAmount = Math.max(...goodsAmount);
    const minAmount = Math.min(...goodsAmount);
    const maxYear = Math.max(...goodsYears);
    const minYear = Math.min(...goodsYears);

    this.searcher = new Searcher();
    this.sorter = new Sorter();
    this.filter = new Filter();
    this.filterParametersManager = new FilterParametersManager();
    this.localStorageManager = new LocalStorageManager();
    this.isSettingsReseted = false;
    this.noResultsMessage = new WarningMessage(WARNING_MESSAGE_TEXT.noResultsText);
    this.sliders = [
      new Slider(
        SLIDER_ELEMENTS_ID.amountSlider.containerId as RangeProperty,
        SLIDER_ELEMENTS_ID.amountSlider.startValueElementId,
        SLIDER_ELEMENTS_ID.amountSlider.endValueElementId,
        minAmount,
        maxAmount
      ),
      new Slider(
        SLIDER_ELEMENTS_ID.yearSlider.containerId as RangeProperty,
        SLIDER_ELEMENTS_ID.yearSlider.startValueElementId,
        SLIDER_ELEMENTS_ID.yearSlider.endValueElementId,
        minYear,
        maxYear
      ),
    ];
    this.searchValue = '';
    this.sortParameters =
      (this.localStorageManager.getParametersFromLocalStorage(LOCAL_STORAGE_KEYS.sortParameters) as
        | SortParameters
        | false) || DEFAULT_SORT_PARAMETERS;
    this.filterParameters = (this.localStorageManager.getParametersFromLocalStorage(
      LOCAL_STORAGE_KEYS.filterParameters
    ) as FilterParameters | false) || {
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
  public init(): void {
    super.init();
    this.render(
      this.filter.filterGoods(
        this.sorter.sort<Bike>(this.goods, this.sortParameters),
        this.filterParameters
      )
    );
    this.switchNoResultMessage();
    this.sliders.forEach((slider: Slider): void => {
      slider.init();
      slider.container.noUiSlider?.on('change', (values: (number | string)[]): void =>
        this.filterByRangeHandler(values as [number, number], slider.container.id as RangeProperty)
      );
    });
    this.filterParametersManager.setActiveParametersStyle(this);

    (document.querySelector('.search') as HTMLInputElement).addEventListener(
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
        this.resetFiltersHandler();
      }
    );
    (document.querySelector('.reset-settings-button') as HTMLButtonElement).addEventListener(
      'click',
      (): void => {
        this.isSettingsReseted = true;
        this.localStorageManager.clearLocalStorage();
      }
    );
    window.addEventListener('beforeunload', (): void => {
      return this.localStorageManager.setParametersToLocalStorage(this.isSettingsReseted, {
        filterParameters: this.filterParameters,
        sortParameters: this.sortParameters,
        cartCounter: this.cart.counter,
      });
    });
  }
  public searchHandler(event: Event): void {
    this.searchValue = (event.target as HTMLInputElement).value.trim();
    const searchResult: Bike[] = this.searcher.getGoodsByName<Bike>(
      this.searchValue,
      this.filter.filterGoods(this.goods, this.filterParameters)
    );
    this.render(searchResult);
    this.switchNoResultMessage();
  }
  public sortHandler(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.sortParameters = target.options[target.selectedIndex].value.split(
      SORT_PARAMETERS_DIVIDER
    ) as SortParameters;
    this.render(
      this.searcher.getGoodsByName(
        this.searchValue,
        this.filter.filterGoods(
          this.sorter.sort<Bike>(this.goods, this.sortParameters),
          this.filterParameters
        )
      )
    );
  }
  public filterByValueHandler(event: Event): void {
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

    this.render(
      this.filter.filterGoods(
        this.searcher.getGoodsByName(this.searchValue, this.goods),
        this.filterParameters
      )
    );
    this.switchNoResultMessage();
  }
  public filterByRangeHandler(values: [number, number], sliderId: RangeProperty): void {
    this.filterParameters.rangeParameters[sliderId] = values;
    this.render(
      this.filter.filterGoods(
        this.searcher.getGoodsByName(this.searchValue, this.goods),
        this.filterParameters
      )
    );
    this.switchNoResultMessage();
  }
  public checkHandler(event: Event): void {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    if (target.checked) {
      this.filterParameters.valueParameters.isPopular.push(Boolean.true);
    } else {
      this.filterParameters.valueParameters.isPopular = [];
    }
    this.render(
      this.filter.filterGoods(
        this.searcher.getGoodsByName(this.searchValue, this.goods),
        this.filterParameters
      )
    );
    this.switchNoResultMessage();
  }
  public resetFiltersHandler(): void {
    this.filterParametersManager.resetShopFilters(this);
    this.render(
      this.filter.filterGoods(
        this.searcher.getGoodsByName(this.searchValue, this.goods),
        this.filterParameters
      )
    );
    this.switchNoResultMessage();
  }
  private switchNoResultMessage(): void {
    if (
      (document.querySelector('.cards-list') as HTMLUListElement).children.length === Numbers.Zero
    ) {
      this.noResultsMessage.open();
    } else {
      this.noResultsMessage.close();
    }
  }
}
