export class Item {
  protected htmlElement: HTMLLIElement;

  constructor(container: HTMLLIElement) {
    this.htmlElement = container;
  }
  render(): void {
    (document.querySelector('.cards-list') as HTMLUListElement).append(this.htmlElement);
  }
}
