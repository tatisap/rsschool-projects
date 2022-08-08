import { PAGE_NUMBER_TEXT } from '../constants/constants';

export const createSectionTitleText = (text: string, totalAmount: string): string =>
  `${text}(${totalAmount})`;

export const createPageNumberText = (currentPageNumber: number): string =>
  `${PAGE_NUMBER_TEXT}${currentPageNumber}`;
