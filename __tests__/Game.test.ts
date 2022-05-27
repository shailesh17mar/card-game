import { Game } from '../src/core/Game';
import { Player } from '../src/core/Player';
import { winnerCalculator } from '../src/main';
import { GameProps } from '../src/models/common';

describe('Game tests', () => {
  const configuration: GameProps = {
    totalCards: 52,
    winnerCalculator,
    requiredPlayers: 2,
  };

  const setupGame = (override?: GameProps) => {
    const game = new Game(override || configuration);
    const player1 = new Player('Naruto');
    const player2 = new Player('Sasuke');
    game.addPlayer(player1);
    game.addPlayer(player2);

    return { game, player1, player2 };
  };

  describe('Create Game', () => {
    it('Cannot create new Game with less than two players', () => {
      expect(() => {
        new Game({ ...configuration, requiredPlayers: 1 });
      }).toThrowError(new Error('Minimum two players are required.'));
    });

    it('Can create new Game', () => {
      const game = new Game(configuration);
      expect(game.totalCards).toEqual(52);
      expect(game.players.length).toEqual(0);
    });

    it('Should discard extra cards in case cards cannot be distributed equally', () => {
      const { game, player1 } = setupGame({
        ...configuration,
        requiredPlayers: 3,
      });
      game.addPlayer(new Player('Sakura'));
      game.deal();
      expect(game.discardPile.length).toEqual(52 % 3);
      expect(player1.cards.length).toEqual(17);
    });
  });

  describe('Add Players to game', () => {
    it('Can add players to game', () => {
      const { game } = setupGame();
      expect(game.players.length).toEqual(2);
    });

    it('Cannot add more than max number of players to game', () => {
      const { game } = setupGame();
      expect(() => {
        game.addPlayer(new Player('Orochi'));
      }).toThrowError(new Error(`This game can be played by 2 only.`));
    });
  });

  describe('Deal cards', () => {
    it('Cannot deal the game without required number of players', () => {
      const game = new Game(configuration);
      expect(() => {
        game.deal();
      }).toThrowError(new Error(`This game can be played by 2 only.`));
    });

    it('Can deal equal number of cards to all players in the game', () => {
      const { game, player1, player2 } = setupGame();
      game.deal();
      const cardsOfPlayer1 = player1.cards;
      const cardsOfPlayer2 = player2.cards;
      expect(cardsOfPlayer1.length).toEqual(26);
      expect(cardsOfPlayer2.length).toEqual(26);
    });

    it('Can deal mutually exclusive cards to players', () => {
      const { game, player1, player2 } = setupGame();
      game.deal();
      expect(player1.cards).not.toContain(player2.cards);
    });
  });

  describe('Play round(s)', () => {
    it('Should throw error when trying to play the game without dealing the cards', () => {
      const game = new Game(configuration);
      expect(() => {
        game.playRound();
      }).toThrowError(new Error(`Cannot play the game unless its started.`));
    });

    it('Should throw error when trying to play a round without any cards left', () => {
      const { game } = setupGame();
      game.deal();
      for (let count = 0; count < 26; count++) {
        game.playRound();
      }
      expect(() => {
        game.playRound();
      }).toThrowError(new Error(`No cards left`));
    });

    it('Should remove the card from pile in each turn', () => {
      const { game, player1, player2 } = setupGame();
      game.deal();
      game.playRound();
      expect(player1.cards.length).toEqual(25);
      expect(player2.cards.length).toEqual(25);
    });

    it('Should return round details and winner on each round', () => {
      const { game } = setupGame();
      game.deal();
      const round = game.playRound();
      expect(round.allHands.length).toEqual(2);
      expect(round.winningHand).not.toBeNull();
    });

    it('Should mark the game as finished when all rounds are finished', () => {
      const { game } = setupGame();
      game.deal();
      game.playRound();
      game.playRemainingRounds();
      expect(game.isFinished).toEqual(true);
    });
  });

  describe('Show score card', () => {
    it('Should return score card with winner when game is finished', () => {
      const { game } = setupGame();
      game.deal();
      game.playRound();
      game.playRemainingRounds();
      const scoreCard = game.getScoreCard();
      expect(scoreCard.scores.length).toEqual(2);
      expect(scoreCard.winner).not.toBeUndefined();
    });

    it('Should return score card without winner when game is not finished', () => {
      const { game } = setupGame();
      game.deal();
      game.playRound();
      const scoreCard = game.getScoreCard();
      expect(scoreCard.scores.length).toEqual(2);
      expect(scoreCard.winner).toBeUndefined();
    });
  });
});
