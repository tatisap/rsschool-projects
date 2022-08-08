import { Numbers } from '../../types/enums';

export default (
  cellTag: string,
  cellsInnerText: string[],
  cellColor: string,
  cellsClassList?: string[]
): HTMLTableRowElement => {
  const row: HTMLTableRowElement = document.createElement('tr');
  row.append(
    ...cellsInnerText.map((cellText: string, index: number): HTMLElement => {
      const cell: HTMLElement = document.createElement(cellTag);
      cell.textContent = cellText;
      if (index === Numbers.One) cell.style.backgroundColor = cellColor;
      if (cellsClassList !== undefined) cell.classList.add(cellsClassList[index]);
      return cell;
    })
  );
  return row;
};
