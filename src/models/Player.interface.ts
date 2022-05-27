import { Card, Hand } from './common';

export interface IPlayer {
  assignCards: (cards: Array<Card>) => void;
  playHand: () => Hand;
}
