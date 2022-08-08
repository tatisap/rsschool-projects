import { MAX_WINNERS_PER_PAGE } from '../../constants/constants';
import store from '../../store/store';
import { Numbers } from '../../types/enums';
import { Car, Winner } from '../../types/types';
import createTableRow from './create-table-row';

export default (winnersCarInfo: (Winner & Car)[]): HTMLElement => {
  const tbody: HTMLElement = document.createElement('tbody');
  tbody.append(
    ...winnersCarInfo.map(
      (winnerInfo: Winner & Car, index: number): HTMLTableRowElement =>
        createTableRow(
          'td',
          [
            `${
              index + Numbers.One + (store.winnersCurrentPage - Numbers.One) * MAX_WINNERS_PER_PAGE
            }`,
            '',
            `${winnerInfo.name}`,
            `${winnerInfo.wins}`,
            `${winnerInfo.time}`,
          ],
          winnerInfo.color
        )
    )
  );
  return tbody;
};
