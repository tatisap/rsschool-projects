export type SortKey = 'id' | 'wins' | 'time';
export type SortOrder = 'ASC' | 'DESC';
export type EngineStatus = 'started' | 'stopped' | 'drive';
export type FormType = 'create' | 'update';
export type Action =
  | 'create'
  | 'update'
  | 'race'
  | 'reset'
  | 'generate'
  | 'select'
  | 'remove'
  | 'start'
  | 'stop'
  | 'previous'
  | 'next';

export interface IQueryParameters {
  id?: number;
  status?: EngineStatus;
  _page?: number;
  _limit?: number;
  _sort?: SortKey;
  _order?: SortOrder;
}

export interface IUrlParameters {
  id?: number;
  query?: IQueryParameters;
}

export interface ICar {
  name: string;
  color: string;
  id: number;
}

export interface IWinner {
  id: number;
  wins: number;
  time: number;
}

export interface IInfo<T> {
  content: T[];
  totalAmount: string;
}

export interface IMoveParameters {
  velocity: number;
  distance: number;
}

export interface IFinishResult {
  success: boolean;
}

export interface IAnimationId {
  value: number;
}

export interface IListenerInfo {
  eventName: string;
  callback: Handler;
}

export type Handler = (event: Event) => void;

export interface IUIElementParameters {
  tag: string;
  classNames: string[];
  id?: string;
  children?: HTMLElement[];
  innerText?: string;
  listenerInfo?: IListenerInfo;
  attributeInfo?: [string, string];
}

export interface IRaceResult {
  success: boolean;
  id?: string;
  time?: number;
}

export interface IStore {
  cars: ICar[];
  winners: IWinner[];
  carsAmount: number;
  winnersAmount: number;
  garageCurrentPage: number;
  winnersCurrentPage: number;
  animate: { [id: string]: IAnimationId };
  sortKey: SortKey;
  sortOrder: SortOrder;
  isRaceStarted: boolean;
}
