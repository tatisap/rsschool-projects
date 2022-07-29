import { BASE_URL, ENDPOINTS } from './constants/constants';
import { HttpMethods } from './types/enums';
import {
  Car,
  Winner,
  Info,
  QueryParameters,
  EngineStatus,
  MoveParameters,
  FinishResult,
} from './types/types';
import { makeUrl } from './utilities/utilities';

const getDatabaseItems = <T>(endpoint: string) => {
  return async (queryParameters: QueryParameters): Promise<Info<T>> => {
    const response = await fetch(makeUrl(BASE_URL, endpoint, undefined, queryParameters));
    return {
      content: await response.json(),
      totalAmount: response.headers.get('X-Total-Count') as string,
    };
  };
};

const getDatabaseItemById = <T>(endpoint: string) => {
  return async (id: number): Promise<T> => {
    return (await fetch(makeUrl(BASE_URL, endpoint, id))).json();
  };
};

const createDatabaseItem = <T>(endpoint: string) => {
  return async (itemInfo: Omit<T, 'id'>): Promise<T> => {
    return (
      await fetch(makeUrl(BASE_URL, endpoint), {
        method: HttpMethods.POST,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemInfo),
      })
    ).json();
  };
};

const deleteDatabaseItem = <T>(endpoint: string) => {
  return async (id: number): Promise<T> => {
    return (await fetch(makeUrl(BASE_URL, endpoint, id), { method: HttpMethods.DELETE })).json();
  };
};

const updateDatabaseItem = <T>(endpoint: string) => {
  return async (id: number, info: Omit<T, 'id'>): Promise<T> => {
    return (
      await fetch(makeUrl(BASE_URL, endpoint, id), {
        method: HttpMethods.PUT,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(info),
      })
    ).json();
  };
};

export const getCars = getDatabaseItems<Car>(ENDPOINTS.garage);
export const getWinners = getDatabaseItems<Winner>(ENDPOINTS.winners);
export const getCarById = getDatabaseItemById<Car>(ENDPOINTS.garage);
export const getWinnerById = getDatabaseItemById<Winner>(ENDPOINTS.winners);
export const createCar = createDatabaseItem<Car>(ENDPOINTS.garage);
export const createWinner = createDatabaseItem<Winner>(ENDPOINTS.winners);
export const deleteCar = deleteDatabaseItem<Car>(ENDPOINTS.garage);
export const deleteWinner = deleteDatabaseItem<Winner>(ENDPOINTS.winners);
export const updateCar = updateDatabaseItem<Car>(ENDPOINTS.garage);
export const updateWinner = updateDatabaseItem<Winner>(ENDPOINTS.winners);

const changeEngineMode = <T>(status: EngineStatus) => {
  return async (id: number): Promise<T> => {
    return (
      await fetch(makeUrl(BASE_URL, ENDPOINTS.engine, undefined, { id, status }), {
        method: HttpMethods.PATCH,
      })
    ).json();
  };
};

export const startEngine = changeEngineMode<MoveParameters>('started');
export const stopEngine = changeEngineMode<MoveParameters>('stopped');
export const switchEngineToDriveMode = changeEngineMode<FinishResult>('drive');
