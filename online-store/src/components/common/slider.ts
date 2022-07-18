import * as noUiSlider from 'nouislider';
import { Numbers } from '../../types/enums';
import { RangeProperty } from '../../types/types';

export class Slider {
  public readonly container: noUiSlider.target;
  private readonly valueElements: HTMLDivElement[];
  private readonly startValue: number;
  private readonly endValue: number;
  public readonly id: RangeProperty;

  constructor(
    containerId: RangeProperty,
    startValueElementId: string,
    endValueElementId: string,
    startValue: number,
    endValue: number
  ) {
    this.container = document.getElementById(containerId) as HTMLElement;
    this.valueElements = [
      document.getElementById(startValueElementId) as HTMLDivElement,
      document.getElementById(endValueElementId) as HTMLDivElement,
    ];
    this.startValue = startValue;
    this.endValue = endValue;
    this.id = containerId;
  }
  public init(): void {
    noUiSlider.create(this.container as noUiSlider.target, {
      start: [this.startValue, this.endValue],
      connect: true,
      step: Numbers.One,
      range: {
        min: this.startValue,
        max: this.endValue,
      },
      tooltips: [true, true],
      format: {
        to: (value: number): number => value,
        from: (value: string): number => Number(value),
      },
    });
    this.container.noUiSlider?.on('update', (values: (number | string)[], handle: number): void => {
      this.valueElements[handle].textContent = String(Math.round(Number(values[handle])));
    });
  }
  public reset(): void {
    this.container.noUiSlider?.reset();
  }
  public getValues(): [number, number] {
    return this.container.noUiSlider?.get(true) as [number, number];
  }
}
