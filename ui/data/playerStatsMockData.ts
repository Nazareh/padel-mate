export type RatingPoint = {
  date: string;
  rating: number;
};

export type PlayerStats = {
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  setsWon: number;
  setsLost: number;
  currentStreak: number; // positive = win streak, negative = loss streak
  recentForm: ('W' | 'L')[];
  bestPartner: { name: string; gamesPlayed: number; winRate: number };
  toughestOpponent: { name: string; gamesAgainst: number; theirWinRate: number };
};

export const mockRatingHistory: RatingPoint[] = [
  { date: 'Jan 10', rating: 1480 },
  { date: 'Jan 24', rating: 1495 },
  { date: 'Feb 7', rating: 1510 },
  { date: 'Feb 21', rating: 1498 },
  { date: 'Mar 7', rating: 1522 },
  { date: 'Mar 21', rating: 1535 },
  { date: 'Apr 4', rating: 1528 },
  { date: 'Apr 18', rating: 1550 },
  { date: 'May 2', rating: 1562 },
  { date: 'May 16', rating: 1575 },
  { date: 'Jun 6', rating: 1560 },
  { date: 'Jun 20', rating: 1589 },
];

export const mockPlayerStats: PlayerStats = {
  totalGames: 42,
  wins: 28,
  losses: 14,
  winRate: 67,
  setsWon: 68,
  setsLost: 41,
  currentStreak: 3,
  recentForm: ['W', 'W', 'W', 'L', 'W'],
  bestPartner: {
    name: 'Marco Silva',
    gamesPlayed: 18,
    winRate: 78,
  },
  toughestOpponent: {
    name: 'Lucas Fernandez',
    gamesAgainst: 8,
    theirWinRate: 75,
  },
};
