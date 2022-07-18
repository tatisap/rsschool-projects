import { SortParameters } from '../types/types';

export const SORT_ORDER = {
  ascending: 'ascending',
  descending: 'descending',
};

export const BUTTON_TEXT = {
  counterText: 'Add to cart',
};

export const STYLE_DISPLAY_VALUE = {
  none: 'none',
  block: 'block',
  flex: 'flex',
};

export const MAX_ITEMS_IN_CART = 20;

export const WARNING_MESSAGE_TEXT = {
  fullCartText: `Sorry, no slots are available. You can not add more then ${MAX_ITEMS_IN_CART} items to the cart`,
  noResultsText: 'Sorry, no matches found',
};

export const DEFAULT_SORT_PARAMETERS: SortParameters = ['name', 'ascending'];

export const SORT_PARAMETERS_DIVIDER = ',';

export const CUSTOM_EVENT_NAMES = {
  addToCart: 'add-to-cart',
  removeFromCart: 'remove-from-cart',
  updateCart: 'update-cart',
  overflow: 'overflow',
};

export const LOCAL_STORAGE_KEYS = {
  sortParameters: 'sort-parameters',
  filterParameters: 'filter-parameters',
  cartCounter: 'cart-counter',
  shoppingList: 'shopping-list',
};
