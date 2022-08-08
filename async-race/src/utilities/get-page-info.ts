import API from '../api/api';
import { MAX_CARS_PER_PAGE, MAX_WINNERS_PER_PAGE } from '../constants/constants';
import store from '../store/store';
import { Numbers } from '../types/enums';
import { Car, Info, Winner } from '../types/types';

export default async (): Promise<[Info<Car>, Info<Winner>]> => {
  const carsInfo: Info<Car> = await API.getCars({
    _page: Numbers.One,
    _limit: MAX_CARS_PER_PAGE,
  });
  const winnersInfo: Info<Winner> = await API.getWinners({
    _page: Numbers.One,
    _limit: MAX_WINNERS_PER_PAGE,
  });
  [store.cars, store.carsAmount] = [carsInfo.content, Number(carsInfo.totalAmount)];
  [store.winners, store.winnersAmount] = [winnersInfo.content, Number(winnersInfo.totalAmount)];
  return [carsInfo, winnersInfo];
};
