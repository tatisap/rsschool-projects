import {
  BASE_URL,
  ENDPOINTS,
  ENGINE_STATUS,
  HEADERS,
  SERVER_CONTENT_TYPE,
} from '../constants/others-constants';
import { HttpMethods, StatusCode } from '../types/enums';
import { makeUrl } from '../utilities/url-maker';
import {
  ICar,
  IWinner,
  IInfo,
  IQueryParameters,
  EngineStatus,
  IMoveParameters,
  IFinishResult,
} from '../types/types';

const getDatabaseItems = <T>(
  endpoint: string
): ((queryParameters: IQueryParameters) => Promise<IInfo<T>>) => {
  return async (queryParameters: IQueryParameters): Promise<IInfo<T>> => {
    const response: Response = await fetch(makeUrl(BASE_URL, endpoint, undefined, queryParameters));
    return {
      content: await response.json(),
      totalAmount: response.headers.get(HEADERS.totalCount) as string,
    };
  };
};

const getDatabaseItemById = <T>(endpoint: string): ((id: string) => Promise<T>) => {
  return async (id: string): Promise<T> => {
    return (await fetch(makeUrl(BASE_URL, endpoint, id))).json();
  };
};

const createDatabaseItem = <T>(endpoint: string): ((itemInfo: Omit<T, 'id'> | T) => Promise<T>) => {
  return async (itemInfo: Omit<T, 'id'> | T): Promise<T> => {
    return (
      await fetch(makeUrl(BASE_URL, endpoint), {
        method: HttpMethods.POST,
        headers: {
          [HEADERS.contentType]: SERVER_CONTENT_TYPE,
        },
        body: JSON.stringify(itemInfo),
      })
    ).json();
  };
};

const deleteDatabaseItem = <T>(endpoint: string): ((id: string) => Promise<T>) => {
  return async (id: string): Promise<T> => {
    return (await fetch(makeUrl(BASE_URL, endpoint, id), { method: HttpMethods.DELETE })).json();
  };
};

const updateDatabaseItem = <T>(
  endpoint: string
): ((id: string, info: Omit<T, 'id'>) => Promise<T>) => {
  return async (id: string, info: Omit<T, 'id'>): Promise<T> => {
    return (
      await fetch(makeUrl(BASE_URL, endpoint, id), {
        method: HttpMethods.PUT,
        headers: {
          [HEADERS.contentType]: SERVER_CONTENT_TYPE,
        },
        body: JSON.stringify(info),
      })
    ).json();
  };
};

const changeEngineMode = <T>(status: EngineStatus): ((id: number) => Promise<T>) => {
  return async (id: number): Promise<T> => {
    return (
      await fetch(makeUrl(BASE_URL, ENDPOINTS.engine, undefined, { id, status }), {
        method: HttpMethods.PATCH,
      })
    ).json();
  };
};

const switchEngineToDriveMode = async (id: number): Promise<IFinishResult> => {
  const response = await fetch(
    makeUrl(BASE_URL, ENDPOINTS.engine, undefined, { id, status: ENGINE_STATUS.drive }),
    {
      method: HttpMethods.PATCH,
    }
  );
  return response.status === StatusCode.Ok ? response.json() : { success: false };
};

const isDatabaseItemExist = <T extends ICar | IWinner>(
  endpoint: string
): ((id: string) => Promise<boolean>) => {
  return async (id: string): Promise<boolean> => {
    const itemsList: T[] = await (await fetch(makeUrl(BASE_URL, endpoint))).json();
    return !!itemsList.find((item: T): boolean => item.id === Number(id));
  };
};

export default {
  getCars: getDatabaseItems<ICar>(ENDPOINTS.garage),
  getWinners: getDatabaseItems<IWinner>(ENDPOINTS.winners),
  getCarById: getDatabaseItemById<ICar>(ENDPOINTS.garage),
  getWinnerById: getDatabaseItemById<IWinner>(ENDPOINTS.winners),
  createCar: createDatabaseItem<ICar>(ENDPOINTS.garage),
  createWinner: createDatabaseItem<IWinner>(ENDPOINTS.winners),
  deleteCar: deleteDatabaseItem<ICar>(ENDPOINTS.garage),
  deleteWinner: deleteDatabaseItem<IWinner>(ENDPOINTS.winners),
  updateCar: updateDatabaseItem<ICar>(ENDPOINTS.garage),
  updateWinner: updateDatabaseItem<IWinner>(ENDPOINTS.winners),
  startEngine: changeEngineMode<IMoveParameters>(ENGINE_STATUS.started),
  stopEngine: changeEngineMode<IMoveParameters>(ENGINE_STATUS.stopped),
  switchEngineToDriveMode,
  isCarExist: isDatabaseItemExist<ICar>(ENDPOINTS.garage),
  isWinnerExist: isDatabaseItemExist<IWinner>(ENDPOINTS.winners),
};
