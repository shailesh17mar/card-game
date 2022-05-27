import { IPlayer } from '../models/Player.interface';
import { Card, Hand, ID } from '../models/common';

export class Player implements IPlayer {
  private _name: string;
  public get name() {
    return this._name;
  }

  private _id: ID;
  public get id() {
    return this._id;
  }

  private _cards: Array<Card> = [];
  public get cards() {
    return this._cards;
  }

  private _playedCards: Array<Card> = [];
  public get playedCards() {
    return this._playedCards;
  }

  private _assignedCards: boolean;

  constructor(name: string) {
    this._name = name;
    this._id = Math.floor(Math.random() * 100).toString();
    this._assignedCards = false;
  }

  assignCards(cards: Array<Card>) {
    if (!this._assignedCards) {
      this._cards = cards;
      this._assignedCards = true;
    } else {
      throw new Error('Player is already in a game');
    }
  }

  playHand(): Hand {
    if (this._cards.length === 0) throw new Error('No cards left');
    const currentCard = this._cards.pop();
    this._playedCards.push(currentCard);
    return {
      player: this._id,
      card: currentCard,
    };
  }
}
