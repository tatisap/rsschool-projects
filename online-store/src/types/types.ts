export interface IBike {
  readonly id: number;
  readonly name: string;
  readonly image: string;
  readonly amount: number;
  readonly isPopular: boolean;
  readonly type: string;
  readonly color: string;
  readonly manufacturer: string;
  readonly year: number;
}

export interface IShoppingList {
  [id: string]: number;
}

export type sortOrder = 'ascending' | 'descending';

export type SortParameters = [keyof IBike, sortOrder];

export type ValueProperty = 'color' | 'isPopular' | 'manufacturer' | 'type';
export type ValueParameters = Record<ValueProperty, string[]>;

export type RangeProperty = 'year' | 'amount';
export type RangeParameters = Record<RangeProperty, [number, number]>;

export type FilterParameters = {
  valueParameters: ValueParameters;
  rangeParameters: RangeParameters;
};
