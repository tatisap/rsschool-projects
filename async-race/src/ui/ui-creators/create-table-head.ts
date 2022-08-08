import {
  NO_CONTENT,
  WINNERS_TABLE_COLUMN_NAMES,
  WINNERS_TABLE_COLUMN_NAMES_CLASSES,
} from '../../constants/others-constants';
import * as handlers from '../../handlers/handlers';
import createTableRow from './create-table-row';

export default (): HTMLElement => {
  const thead: HTMLElement = document.createElement('thead');
  thead.classList.add('table__head', 'head');
  thead.addEventListener('click', handlers.sortTableHandler);
  thead.append(
    createTableRow('th', WINNERS_TABLE_COLUMN_NAMES, NO_CONTENT, WINNERS_TABLE_COLUMN_NAMES_CLASSES)
  );
  return thead;
};
