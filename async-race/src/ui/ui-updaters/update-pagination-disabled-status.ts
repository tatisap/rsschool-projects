import { Numbers } from '../../types/enums';

export default (
  paginationContainer: HTMLDivElement,
  currentPage: number,
  maxPage: number
): void => {
  const previousButton: HTMLButtonElement = paginationContainer.querySelector(
    '.previous-button'
  ) as HTMLButtonElement;
  const nextButton: HTMLButtonElement = paginationContainer.querySelector(
    '.next-button'
  ) as HTMLButtonElement;
  [previousButton, nextButton].forEach((button: HTMLButtonElement): void =>
    button.removeAttribute('disabled')
  );
  if (currentPage <= Numbers.One) previousButton.setAttribute('disabled', 'true');
  if (currentPage >= maxPage) nextButton.setAttribute('disabled', 'true');
};
