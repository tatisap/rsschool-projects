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

export type FilterProperty = 'color' | 'amount' | 'isPopular' | 'manufacturer' | 'type' | 'year';
export type FilterParameters = Record<FilterProperty, string[]>;
