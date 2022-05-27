import { Game } from './core/Game';
import { Player } from './core/Player';
import { Hand, ID, Round, ScoreCard } from './models/common';

const displayRoundResult = (
  count: number,
  round: Round,
  playerDictionary: { [key: ID]: string },
) => {
  console.log(`Round: ${count}`);
  console.log(
    'Moves: ',
    round.allHands
      .map((hand) => `${playerDictionary[hand.player]}: ${hand.card}`)
      .join('\t'),
  );
  console.log('Round winner: ', playerDictionary[round.winningHand.player]);
  console.log(`....................................................`);
};

const displayScoreCard = (
  scoreCard: ScoreCard,
  playerDictionary: { [key: ID]: string },
) => {
  console.log('\nXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
  console.log(
    'Final scores: ',
    scoreCard.scores
      .map((item) => `${playerDictionary[item.player]}: ${item.score}`)
      .join('\t'),
  );
  if (scoreCard.winner)
    console.log('Final winner: ', playerDictionary[scoreCard.winner]);
  console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n');
};

export const winnerCalculator = (hands: Array<Hand>): Hand =>
  hands.reduce((agg, hand) => (agg.card > hand.card ? agg : hand));

export const simulateGame = () => {
  // Create players
  const playerDictionary: { [key: ID]: string } = {};
  const player1 = new Player('Naruto');
  const player2 = new Player('Sasuke');
  playerDictionary[player1.id] = player1.name;
  playerDictionary[player2.id] = player2.name;

  // Create new game
  const game = new Game({
    totalCards: 52,
    winnerCalculator,
    requiredPlayers: 2,
  });

  // Add players to the game
  game.addPlayer(player1);
  game.addPlayer(player2);

  // Deal cards to players
  game.deal();

  // Play till the end
  const rounds = game.playRemainingRounds();
  rounds.forEach((round, index) => {
    displayRoundResult(index + 1, round, playerDictionary);
  });

  // Declare winner
  const scoreBoard = game.getScoreCard();
  displayScoreCard(scoreBoard, playerDictionary);
};

simulateGame();
