import { Numbers } from '../../types/enums';
import { Cart } from './cart';

document.body.innerHTML = `
  <div class="shopping-cart">
    <span class="shopping-cart__counter">0</span>
  </div>
`;

const cart = new Cart();
cart.init();

describe('Cart behavior', () => {
  beforeEach(() => (cart.counter = 0));
  it('Should add to the cart', () => {
    cart.add();
    expect(cart.counter).toBe(0);
  });

  it('Should remove from the cart', () => {
    for (let i = Numbers.Zero; i <= Numbers.TwentyFive; i++) {
      cart.add();
    }
    for (let i = Numbers.Zero; i < Numbers.Twenty; i++) {
      cart.remove();
    }
    expect(cart.counter).toBe(0);
  });

  it('Should check full cart', () => {
    for (let i = Numbers.Zero; i <= Numbers.Twenty; i++) {
      cart.add();
    }
    expect(cart.isFull()).toBeTruthy();
  });
});
