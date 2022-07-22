import { LocalStorageManager } from './local-storage-manager';
import { Numbers } from '../types/enums';

const manager: LocalStorageManager = new LocalStorageManager();

describe('LocalStorageManager behavior', () => {
  it('Should clear localStorage', () => {
    localStorage.setItem('test-key', 'test-value');
    manager.clearLocalStorage();
    expect(localStorage.length).toBe(Numbers.Zero);
  });
});
