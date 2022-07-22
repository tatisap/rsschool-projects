import { SLIDER_ELEMENTS_ID } from '../../constants/constants';
import { INITIAL_RANGE_VALUES } from '../../constants/test-constants';
import { RangeProperty } from '../../types/types';
import { Slider } from './slider';

document.body.innerHTML = `
  <div class="slider">
    <div id="amount-start" class="slider-value">1</div>
    <div id="amount"></div>
    <div id="amount-end" class="slider-value">10</div>
  </div>
`;

const slider: Slider = new Slider(
  SLIDER_ELEMENTS_ID.amountSlider.containerId as RangeProperty,
  SLIDER_ELEMENTS_ID.amountSlider.startValueElementId,
  SLIDER_ELEMENTS_ID.amountSlider.endValueElementId,
  INITIAL_RANGE_VALUES.amount.start,
  INITIAL_RANGE_VALUES.amount.end
);
slider.init();

describe('Slider behavior', () => {
  it('Should get values', () => {
    const values = slider.getValues();
    const expectedRange = [INITIAL_RANGE_VALUES.amount.start, INITIAL_RANGE_VALUES.amount.end];
    expect(values).toBeDefined();
    expect(values).toEqual(expectedRange);
  });
  it('Should reset values', () => {
    const testAmountRange = [8, 9];
    slider.container.noUiSlider?.set(testAmountRange);
    expect(slider.getValues()).toEqual(testAmountRange);
    slider.reset();
    expect(slider.getValues()).toEqual([
      INITIAL_RANGE_VALUES.amount.start,
      INITIAL_RANGE_VALUES.amount.end,
    ]);
  });
});
