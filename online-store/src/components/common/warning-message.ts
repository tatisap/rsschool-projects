export class WarningMessage {
  private readonly container: HTMLDivElement;
  private readonly closeButton: HTMLButtonElement;

  constructor(content: string) {
    const container: HTMLDivElement = document.createElement('div');
    container.classList.add('warning-message');
    container.textContent = content;

    const closeButton: HTMLButtonElement = document.createElement('button');
    closeButton.classList.add('warning-message__close-button');
    closeButton.addEventListener('click', (): void => this.close());

    container.append(closeButton);
    this.container = container;
    this.closeButton = closeButton;
  }
  public open(): void {
    document.body.append(this.container);
  }
  public close(): void {
    this.container.remove();
  }
}
