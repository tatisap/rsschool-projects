import * as handlers from '../../handlers/handlers';
import { SECTION_TITLE_TEXT } from '../../constants/constants';
import { Car, Winner } from '../../types/types';
import { createPageNumberText, createSectionTitleText } from '../../utilities/text-makers';
import createTableHead from './create-table-head';
import { createParentUIElement, createUIElement } from './create-general-element';
import createPagination from './create-pagination';
import createTableContent from './create-table-content';

const createWinnersTable = (winnersCarInfo: (Winner & Car)[]): HTMLTableElement => {
  return createParentUIElement<HTMLTableElement>({
    tag: 'table',
    classNames: ['winners-list', 'table'],
    children: [createTableHead(), createTableContent(winnersCarInfo)],
  });
};

export default (
  winnersCarInfo: (Winner & Car)[],
  totalAmount: string,
  pageNumber: number,
  maxPageNumber: number
): HTMLElement =>
  createParentUIElement<HTMLDivElement>({
    tag: 'section',
    id: 'winners',
    classNames: ['section'],
    children: [
      createUIElement<HTMLHeadingElement>({
        tag: 'h2',
        classNames: ['section__title', 'winners__title'],
        innerText: createSectionTitleText(SECTION_TITLE_TEXT.winners, totalAmount),
      }),
      createUIElement<HTMLDivElement>({
        tag: 'div',
        classNames: ['winners__page-number'],
        innerText: createPageNumberText(pageNumber),
      }),
      createWinnersTable(winnersCarInfo),
      createPagination(handlers.winnersPaginationHandler, pageNumber, maxPageNumber),
    ],
  });
