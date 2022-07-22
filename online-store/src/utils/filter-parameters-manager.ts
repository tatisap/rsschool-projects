import { BikeShop } from '../components/bike-shop';
import { Slider } from '../components/common/slider';
import { SORT_PARAMETERS_DIVIDER } from '../constants/constants';
import { Boolean } from '../types/enums';
import { RangeProperty, ValueProperty } from '../types/types';

export class FilterParametersManager {
  public resetShopFilters<T extends BikeShop>(shop: T): void {
    shop.searchValue = '';
    (document.querySelector('.search') as HTMLInputElement).value = '';
    (document.getElementById('popular') as HTMLInputElement).checked = false;
    (
      (document.querySelector('.filter-section') as HTMLElement).querySelectorAll(
        '.active'
      ) as NodeListOf<HTMLElement>
    ).forEach((element: HTMLElement): void => element.classList.remove('active'));
    shop.sliders.forEach((slider: Slider): void => {
      slider.reset();
      shop.filterParameters.rangeParameters[slider.id] = slider.getValues();
    });
    (Object.keys(shop.filterParameters.valueParameters) as ValueProperty[]).forEach(
      (value: ValueProperty): void => {
        shop.filterParameters.valueParameters[value] = [];
      }
    );
  }
  public setActiveParametersStyle<T extends BikeShop>(shop: T): void {
    (
      document.querySelector(
        `[value="${shop.sortParameters.join(SORT_PARAMETERS_DIVIDER)}"]`
      ) as HTMLOptionElement
    ).selected = true;
    (Object.keys(shop.filterParameters.valueParameters) as ValueProperty[]).forEach(
      (property: ValueProperty): void => {
        shop.filterParameters.valueParameters[property].forEach((value: string): void =>
          (document.querySelector(`[data-value="${value}"]`) as HTMLElement)?.classList.add(
            'active'
          )
        );
      }
    );
    if (shop.filterParameters.valueParameters.isPopular.includes(Boolean.true)) {
      (document.getElementById('popular') as HTMLInputElement).checked = true;
    }
    (Object.keys(shop.filterParameters.rangeParameters) as RangeProperty[]).forEach(
      (property: RangeProperty): void => {
        const slider = shop.sliders.find(
          (slider: Slider): boolean => slider.container.id === property
        ) as Slider;
        slider.container.noUiSlider?.set(shop.filterParameters.rangeParameters[property]);
      }
    );
  }
}
