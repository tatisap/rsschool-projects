import { WarningMessage } from './warning-message';

const message: WarningMessage = new WarningMessage('I am warning message');

describe('Warning Message behavior', () => {
  beforeEach(() => {
    message.close();
  });
  it('Should add message to page', () => {
    message.open();
    expect(document.body.lastChild).toBeInstanceOf(HTMLDivElement);
  });
  it('Should remove message from page', () => {
    message.open();
    message.close();
    expect(document.body.lastChild).not.toBeInstanceOf(HTMLDivElement);
  });
});
