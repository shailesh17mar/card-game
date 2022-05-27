export type Card = number;
export type ID = string;
export type Deck = Array<Card>;

export interface Score {
  player: ID;
  score: number;
}

export interface Hand {
  player: ID;
  card: Card;
}

export interface ScoreCard {
  scores: Array<Score>;
  winner?: ID;
}

export interface Round {
  winningHand: Hand;
  allHands: Array<Hand>;
}

export interface GameProps {
  totalCards: number;
  requiredPlayers: number;
  winnerCalculator: (hands: Array<Hand>) => Hand;
}
