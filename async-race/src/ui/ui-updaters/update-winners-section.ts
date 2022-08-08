import API from '../../api/api';
import { MAX_WINNERS_PER_PAGE, SECTION_TITLE_TEXT } from '../../constants/others-constants';
import store from '../../store/store';
import { ICar, IInfo, IWinner } from '../../types/types';
import { createPageNumberText, createSectionTitleText } from '../../utilities/text-makers';
import createTableContent from '../ui-creators/create-table-content';
import updatePaginationDisabledStatus from './update-pagination-disabled-status';

export default async (): Promise<void> => {
  const winnersInfo: IInfo<IWinner> = await API.getWinners({
    _page: store.winnersCurrentPage,
    _limit: MAX_WINNERS_PER_PAGE,
    _sort: store.sortKey,
    _order: store.sortOrder,
  });
  const winnersCarInfo: (IWinner & ICar)[] = await Promise.all(
    winnersInfo.content.map(async (winner: IWinner): Promise<IWinner & ICar> => {
      return Object.assign(winner, (await API.getCarById(String(winner.id))) as ICar);
    })
  );
  [store.winners, store.winnersAmount] = [winnersInfo.content, Number(winnersInfo.totalAmount)];
  const section: HTMLElement = document.getElementById('winners') as HTMLElement;
  (document.querySelector('.winners__title') as HTMLHeadingElement).textContent =
    createSectionTitleText(SECTION_TITLE_TEXT.winners, winnersInfo.totalAmount);
  (document.querySelector('.winners__page-number') as HTMLHeadingElement).textContent =
    createPageNumberText(store.winnersCurrentPage);
  const winnerTable: HTMLTableElement = document.querySelector('.winners-list') as HTMLTableElement;
  (winnerTable.lastChild as HTMLElement).remove();
  winnerTable.append(createTableContent(winnersCarInfo));
  updatePaginationDisabledStatus(
    section.querySelector('.pagination') as HTMLDivElement,
    store.winnersCurrentPage,
    Math.ceil(store.winnersAmount / MAX_WINNERS_PER_PAGE)
  );
};
