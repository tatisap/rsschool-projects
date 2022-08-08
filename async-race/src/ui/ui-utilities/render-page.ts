import API from '../../api/api';
import { MAX_CARS_PER_PAGE, MAX_WINNERS_PER_PAGE } from '../../constants/others-constants';
import BUTTON_TEXT from '../../constants/button-text';
import store from '../../store/store';
import { ICar, IInfo, IWinner } from '../../types/types';
import createGarageSection from '../ui-creators/create-garage-section';
import createTabsPanel from '../ui-creators/create-tabs-panel';
import createWinnersSection from '../ui-creators/create-winners-section';

export default async ([cars, winners]: [IInfo<ICar>, IInfo<IWinner>]): Promise<void> => {
  const winnersCarInfo: (IWinner & ICar)[] = await Promise.all(
    winners.content.map(async (winner: IWinner): Promise<IWinner & ICar> => {
      return Object.assign(winner, (await API.getCarById(String(winner.id))) as ICar);
    })
  );
  const main: HTMLElement = document.createElement('main');
  main.append(
    createGarageSection(
      cars,
      store.garageCurrentPage,
      Math.ceil(store.carsAmount / MAX_CARS_PER_PAGE)
    ),
    createWinnersSection(
      winnersCarInfo,
      winners.totalAmount,
      store.garageCurrentPage,
      Math.ceil(store.winnersAmount / MAX_WINNERS_PER_PAGE)
    )
  );
  const tabsPanel: HTMLElement = createTabsPanel([BUTTON_TEXT.garage, BUTTON_TEXT.winners]);
  document.body.append(tabsPanel, main);
};
