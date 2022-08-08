import API from '../api/api';
import { MAX_CARS_PER_PAGE, MAX_WINNERS_PER_PAGE } from '../constants/others-constants';
import store from '../store/store';
import { Numbers } from '../types/enums';
import { ICar, IInfo, IWinner } from '../types/types';

export default async (): Promise<[IInfo<ICar>, IInfo<IWinner>]> => {
  const carsInfo: IInfo<ICar> = await API.getCars({
    _page: Numbers.One,
    _limit: MAX_CARS_PER_PAGE,
  });
  const winnersInfo: IInfo<IWinner> = await API.getWinners({
    _page: Numbers.One,
    _limit: MAX_WINNERS_PER_PAGE,
  });
  [store.cars, store.carsAmount] = [carsInfo.content, Number(carsInfo.totalAmount)];
  [store.winners, store.winnersAmount] = [winnersInfo.content, Number(winnersInfo.totalAmount)];
  return [carsInfo, winnersInfo];
};
