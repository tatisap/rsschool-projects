import { IBike } from '../types/types';
import { Card } from './card';

export class Item {
  public card: Card;

  constructor(item: IBike) {
    this.card = new Card(item);
  }
}
