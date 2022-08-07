import { BASE_URL, ENDPOINTS } from '../constants/constants';
import { HttpMethods, StatusCode } from '../types/enums';
import { makeUrl } from '../utilities/url-maker';
import {
  Car,
  Winner,
  Info,
  QueryParameters,
  EngineStatus,
  MoveParameters,
  FinishResult,
} from '../types/types';

const getDatabaseItems = <T>(endpoint: string) => {
  return async (queryParameters: QueryParameters): Promise<Info<T>> => {
    const response: Response = await fetch(makeUrl(BASE_URL, endpoint, undefined, queryParameters));
    return {
      content: await response.json(),
      totalAmount: response.headers.get('X-Total-Count') as string,
    };
  };
};

const getDatabaseItemById = <T>(endpoint: string) => {
  return async (id: string): Promise<T> => {
    return (await fetch(makeUrl(BASE_URL, endpoint, id))).json();
  };
};

const createDatabaseItem = <T>(endpoint: string) => {
  return async (itemInfo: Omit<T, 'id'> | T): Promise<T> => {
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
  return async (id: string): Promise<T> => {
    return (await fetch(makeUrl(BASE_URL, endpoint, id), { method: HttpMethods.DELETE })).json();
  };
};

const updateDatabaseItem = <T>(endpoint: string) => {
  return async (id: string, info: Omit<T, 'id'>): Promise<T> => {
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

const changeEngineMode = <T>(status: EngineStatus) => {
  return async (id: number): Promise<T> => {
    return (
      await fetch(makeUrl(BASE_URL, ENDPOINTS.engine, undefined, { id, status }), {
        method: HttpMethods.PATCH,
      })
    ).json();
  };
};

const switchEngineToDriveMode = async (id: number): Promise<FinishResult> => {
  const response = await fetch(
    makeUrl(BASE_URL, ENDPOINTS.engine, undefined, { id, status: 'drive' }),
    {
      method: HttpMethods.PATCH,
    }
  );
  return response.status === StatusCode.Ok ? response.json() : { success: false };
};

const isDatabaseItemExist = <T extends Car | Winner>(endpoint: string) => {
  return async (id: string): Promise<boolean> => {
    const itemsList: T[] = await (await fetch(makeUrl(BASE_URL, endpoint))).json();
    return !!itemsList.find((item: T): boolean => item.id === Number(id));
  };
};

export default {
  getCars: getDatabaseItems<Car>(ENDPOINTS.garage),
  getWinners: getDatabaseItems<Winner>(ENDPOINTS.winners),
  getCarById: getDatabaseItemById<Car>(ENDPOINTS.garage),
  getWinnerById: getDatabaseItemById<Winner>(ENDPOINTS.winners),
  createCar: createDatabaseItem<Car>(ENDPOINTS.garage),
  createWinner: createDatabaseItem<Winner>(ENDPOINTS.winners),
  deleteCar: deleteDatabaseItem<Car>(ENDPOINTS.garage),
  deleteWinner: deleteDatabaseItem<Winner>(ENDPOINTS.winners),
  updateCar: updateDatabaseItem<Car>(ENDPOINTS.garage),
  updateWinner: updateDatabaseItem<Winner>(ENDPOINTS.winners),
  startEngine: changeEngineMode<MoveParameters>('started'),
  stopEngine: changeEngineMode<MoveParameters>('stopped'),
  switchEngineToDriveMode,
  isCarExist: isDatabaseItemExist<Car>(ENDPOINTS.garage),
  isWinnerExist: isDatabaseItemExist<Winner>(ENDPOINTS.winners),
};
