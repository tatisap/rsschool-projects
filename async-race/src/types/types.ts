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

export interface AnimationId {
  value: number;
}

export interface ListenerInfo {
  eventName: string;
  callback: Handler;
}

export type Handler = (event: Event) => void;

export interface UIElementParameters {
  tag: string;
  classNames: string[];
  id?: string;
  children?: HTMLElement[];
  innerText?: string;
  listenerInfo?: ListenerInfo;
}
