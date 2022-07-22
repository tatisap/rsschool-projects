import { MAX_ITEMS_IN_CART } from '../../constants/constants';
import { INITIAL_STEP } from '../../constants/test-constants';
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
  beforeEach(() => (cart.counter = Numbers.Zero));
  it('Should add to the cart', () => {
    cart.add();
    expect(cart.counter).toBe(Numbers.One);
  });

  it('Should remove from the cart', () => {
    for (let i = INITIAL_STEP; i <= MAX_ITEMS_IN_CART + Numbers.One; i++) {
      cart.add();
    }
    for (let i = INITIAL_STEP; i < MAX_ITEMS_IN_CART; i++) {
      cart.remove();
    }
    expect(cart.counter).toBe(Numbers.Zero);
  });

  it('Should check full cart', () => {
    for (let i = INITIAL_STEP; i <= MAX_ITEMS_IN_CART; i++) {
      cart.add();
    }
    expect(cart.isFull()).toBeTruthy();
  });
});
