import { NO_CONTENT } from '../../constants/constants';

export default (): void => {
  (document.querySelector('.cars-list') as HTMLUListElement).innerHTML = NO_CONTENT;
};
