import { Cart } from './cart';

document.body.innerHTML = `
  <div class="shopping-cart">
    <span class="shopping-cart__counter">0</span>
  </div>
`;

const cart = new Cart();
cart.init();

describe('Cart', () => {
  beforeEach(() => (cart.counter = 0));
  it('Adding to the cart', () => {
    cart.add();
    expect(cart.counter).toBe(1);
  });

  it('Removing from the cart', () => {
    for (let i = 0; i <= 25; i++) {
      cart.add();
    }
    for (let i = 0; i < 20; i++) {
      cart.remove();
    }
    expect(cart.counter).toBe(0);
  });

  it('Checking full cart', () => {
    for (let i = 0; i <= 20; i++) {
      cart.add();
    }
    expect(cart.isFull()).toBeTruthy();
  });
});
