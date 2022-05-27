import {
  Deck,
  GameProps,
  Hand,
  ID,
  Round,
  Score,
  ScoreCard,
} from '../models/common';
import { Player } from './Player';
import { IGame } from '../models/Game.interface';

export class Game implements IGame {
  private _players: Array<Player> = [];
  public get players() {
    return this._players;
  }

  public get isFinished(): boolean {
    return this._getRemainingTurns() === 0;
  }

  private _deck: Deck;
  private _requiredPlayers: number;
  private _winningHands: Array<Hand> = [];
  private _calculateWinningHand: (hands: Array<Hand>) => Hand;
  private _started = false;

  private _totalCards: number;
  public get totalCards() {
    return this._totalCards;
  }

  private _discardPile: Deck = [];
  public get discardPile() {
    return this._discardPile;
  }

  constructor({ requiredPlayers, winnerCalculator, totalCards }: GameProps) {
    if (requiredPlayers < 2) {
      throw new Error('Minimum two players are required.');
    }
    this._totalCards = totalCards;
    this._calculateWinningHand = winnerCalculator;
    this._deck = Array.from({ length: this._totalCards }, (_, i) => i + 1);
    this._requiredPlayers = requiredPlayers;
  }

  addPlayer(player: Player) {
    if (this._players.length < this._requiredPlayers)
      this._players.push(player);
    else
      throw new Error(
        `This game can be played by ${this._requiredPlayers} only.`,
      );
  }

  deal() {
    this._start();
    this._shuffle();
    const cardsPerUser = this._totalCards / this._requiredPlayers;
    this._players.forEach((player, index) => {
      player.assignCards(
        this._deck.slice(index * cardsPerUser, (index + 1) * cardsPerUser),
      );
    });
  }

  playRound(): Round {
    this._validateMove();
    const allHands = this._players.map((player) => player.playHand());
    const winningHand = this._calculateWinningHand(allHands);
    this._winningHands.push(winningHand);
    return {
      allHands,
      winningHand,
    };
  }

  playRemainingRounds(): Array<Round> {
    this._validateMove();
    const remainingTurns = this._getRemainingTurns();
    const rounds: Array<Round> = [];
    for (let count = 0; count < remainingTurns; count++) {
      const round = this.playRound();
      rounds.push(round);
    }
    return rounds;
  }

  getScoreCard(): ScoreCard {
    const initialScoreBoard = this._players.reduce(
      (agg: { [id: ID]: Score }, player) => {
        agg[player.id] = {
          player: player.id,
          score: 0,
        } as Score;
        return agg;
      },
      {},
    );

    const scores = this._winningHands.reduce(
      (scoreBoard: { [id: ID]: Score }, winningHand: Hand) => {
        const playerScore = scoreBoard[winningHand.player];
        scoreBoard[winningHand.player] = {
          ...playerScore,
          score: playerScore.score + this._calculateScore(),
        };
        return scoreBoard;
      },
      initialScoreBoard,
    );
    const winner = this.isFinished
      ? this._getWinner(Object.values(scores))
      : undefined;
    return {
      winner,
      scores: Object.values(scores),
    };
  }

  private _getWinner(scores: Array<Score>) {
    const winningScore = scores.reduce((agg: Score, score: Score) =>
      agg.score > score.score ? agg : score,
    );
    return winningScore.player;
  }

  private _getRemainingTurns() {
    const totalTurns = this._totalCards / this._requiredPlayers;
    const completedTurns = this._winningHands.length;
    return totalTurns - completedTurns;
  }

  private _validateMove() {
    if (!this._started) {
      throw new Error(`Cannot play the game unless its started.`);
    }
  }

  //Note: Right now have hard coded the score calculation logic
  // but this function can be more business logic dependent like dependent on card value
  private _calculateScore() {
    return 1;
  }

  private _shuffle() {
    let count = this._totalCards;
    while (count) {
      this._deck.push(
        this._deck.splice(Math.floor(Math.random() * count), 1)[0],
      );
      count -= 1;
    }
    this._discardExtra();
  }

  private _discardExtra() {
    const extraCards = this.totalCards % this._players.length;
    this._discardPile = this._deck.splice(
      this._deck.length - extraCards,
      extraCards,
    );
  }

  private _start() {
    if (this._players.length !== this._requiredPlayers) {
      throw new Error(
        `This game can be played by ${this._requiredPlayers} only.`,
      );
    }
    this._started = true;
  }
}
