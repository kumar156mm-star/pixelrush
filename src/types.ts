export interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  highScoreKey: string;
}

export interface Score {
  name: string;
  score: number;
  gameId: string;
  date: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}
