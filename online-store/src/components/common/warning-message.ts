export class WarningMessage {
  private readonly container: HTMLDivElement;
  private readonly closeButton: HTMLButtonElement;

  constructor(content: string) {
    const container: HTMLDivElement = document.createElement('div');
    container.classList.add('warning-message');
    container.textContent = content;

    const closeButton: HTMLButtonElement = document.createElement('button');
    closeButton.classList.add('warning-message__close-button');

    this.container = container;
    this.closeButton = closeButton;
  }
  init() {
    this.closeButton.addEventListener('click', (): void => this.close());
    this.container.append(this.closeButton);
    document.body.append(this.container);
  }
  open(): void {
    this.container.style.display = 'flex';
  }
  close(): void {
    this.container.style.display = 'none';
  }
}
