import { Round, ScoreCard } from './common';
import { IPlayer } from './Player.interface';

export interface IGame {
  addPlayer: (player: IPlayer) => void;
  deal: () => void;
  playRound: () => Round;
  playRemainingRounds(): Array<Round>;
  getScoreCard: () => ScoreCard;
}
