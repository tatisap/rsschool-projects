export interface IGoods {
  readonly name: string;
  readonly image: string;
  readonly amount: number;
  readonly isPopular: boolean;
}

export interface IBike extends IGoods {
  readonly type: string;
  readonly color: string;
  readonly manufacturer: string;
  readonly year: number;
}
