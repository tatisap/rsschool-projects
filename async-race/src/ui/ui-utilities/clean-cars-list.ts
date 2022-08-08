import { NO_CONTENT } from '../../constants/others-constants';

export default (): void => {
  (document.querySelector('.cars-list') as HTMLUListElement).innerHTML = NO_CONTENT;
};
