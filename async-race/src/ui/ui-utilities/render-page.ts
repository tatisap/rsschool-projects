import API from '../../api/api';
import { BUTTON_TEXT, MAX_CARS_PER_PAGE, MAX_WINNERS_PER_PAGE } from '../../constants/constants';
import store from '../../store/store';
import { Car, Info, Winner } from '../../types/types';
import createGarageSection from '../ui-creators/create-garage-section';
import createTabsPanel from '../ui-creators/create-tabs-panel';
import createWinnersSection from '../ui-creators/create-winners-section';

export default async ([cars, winners]: [Info<Car>, Info<Winner>]): Promise<void> => {
  const winnersCarInfo: (Winner & Car)[] = await Promise.all(
    winners.content.map(async (winner: Winner): Promise<Winner & Car> => {
      return Object.assign(winner, (await API.getCarById(String(winner.id))) as Car);
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
