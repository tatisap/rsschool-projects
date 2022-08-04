import { BUTTON_TEXT } from '../constants/constants';
import { Info, Car, Winner } from '../types/types';
import { createGarageSection, createTabsPanel, createWinnersSection } from './ui-components';

export default async ([cars, winners]: [Info<Car>, Info<Winner>]): Promise<void> => {
  const winnersCarInfo: (Winner & Car)[] = winners.content.map((info) => {
    return Object.assign(
      info,
      cars.content.find((car) => car.id === info.id)
    );
  });
  const main = document.createElement('main');
  main.append(
    createTabsPanel([BUTTON_TEXT.garage, BUTTON_TEXT.winners]),
    createGarageSection(cars, 1),
    createWinnersSection(winnersCarInfo, winners.totalAmount, 1)
  );
  document.body.append(main);
};
