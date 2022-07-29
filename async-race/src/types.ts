export type SortKey = 'id' | 'wins' | 'time';
export type SortOrder = 'ASC' | 'DESC';
export type EngineStatus = 'started' | 'stopped' | 'drive';

export interface QueryParameters {
  id?: number;
  status?: EngineStatus;
  _page?: number;
  _limit?: number;
  _sort?: SortKey;
  _order?: SortOrder;
}

export interface UrlParameters {
  id?: number;
  query?: QueryParameters;
}

export interface Car {
  name: string;
  color: string;
  id: number;
}

export interface Winner {
  id: number;
  wins: number;
  time: number;
}

export interface Info<T> {
  content: T[];
  totalAmount: string;
}

export interface MoveParameters {
  velocity: number;
  distance: number;
}

export interface FinishResult {
  success: boolean;
}
