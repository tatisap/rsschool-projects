export class Item {
  protected readonly htmlElement: HTMLLIElement;

  constructor(container: HTMLLIElement) {
    this.htmlElement = container;
  }
  public render(): void {
    (document.querySelector('.cards-list') as HTMLUListElement).append(this.htmlElement);
  }
}
