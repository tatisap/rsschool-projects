import { LOCAL_STORAGE_KEYS } from '../constants/constants';
import { FilterParameters, ISavedParameters, SortParameters } from '../types/types';

export class LocalStorageManager {
  public getParametersFromLocalStorage(key: string): SortParameters | FilterParameters | boolean {
    const savedValue = localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : false;
  }
  public setParametersToLocalStorage(condition: boolean, values: ISavedParameters): void {
    if (condition) return;
    (Object.keys(values) as (keyof ISavedParameters)[]).forEach((key: keyof ISavedParameters) =>
      localStorage.setItem(LOCAL_STORAGE_KEYS[key], JSON.stringify(values[key]))
    );
  }
  public clearLocalStorage(): void {
    localStorage.clear();
  }
}
