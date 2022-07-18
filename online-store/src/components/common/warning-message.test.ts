import { WarningMessage } from './warning-message';

const message: WarningMessage = new WarningMessage('I am warning message');

describe('Warning Message', () => {
  beforeEach(() => {
    message.close();
  });
  it('Adding to page', () => {
    message.open();
    expect(document.body.lastChild).toBeInstanceOf(HTMLDivElement);
  });
  it('Removing from page', () => {
    message.open();
    message.close();
    expect(document.body.lastChild).not.toBeInstanceOf(HTMLDivElement);
  });
});
