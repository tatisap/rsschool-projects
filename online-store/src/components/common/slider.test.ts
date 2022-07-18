import { Slider } from './slider';

document.body.innerHTML = `
  <div class="slider">
    <div id="amount-start" class="slider-value">1</div>
    <div id="amount"></div>
    <div id="amount-end" class="slider-value">10</div>
  </div>
`;

const slider: Slider = new Slider('amount', 'amount-start', 'amount-end', 0, 10);
slider.init();

describe('Slider behavior', () => {
  it('Should get values', () => {
    const values = slider.getValues();
    expect(values).toBeDefined();
    expect(values).toEqual([0, 10]);
  });
  it('Should reset values', () => {
    slider.container.noUiSlider?.set([8, 9]);
    expect(slider.getValues()).toEqual([8, 9]);
    slider.reset();
    expect(slider.getValues()).toEqual([0, 10]);
  });
});
