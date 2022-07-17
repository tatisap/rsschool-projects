export interface IBike {
  readonly name: string;
  readonly image: string;
  readonly amount: number;
  readonly isPopular: boolean;
  readonly type: string;
  readonly color: string;
  readonly manufacturer: string;
  readonly year: number;
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
