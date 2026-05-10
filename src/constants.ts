import { Game } from './types';

export const GAMES: Game[] = [
  {
    id: 'desert-runner',
    title: 'Desert Runner',
    description: 'Spirit through the dunes, dodge obstacles, and survive the heat.',
    thumbnail: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&q=80&w=400',
    category: 'Endless Runner',
    highScoreKey: 'pixelrush_desert_runner_high_score'
  },
  {
    id: 'highway-racer',
    title: 'Highway Racer',
    description: 'Neon city nights, high-speed traffic, and pure adrenaline.',
    thumbnail: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=400',
    category: 'Racing',
    highScoreKey: 'pixelrush_highway_racer_high_score'
  },
  {
    id: 'space-shooter',
    title: 'Space Shooter',
    description: 'Defend the galaxy from pixelated invaders in this classic shooter.',
    thumbnail: 'https://images.unsplash.com/photo-1614728263952-84ea206f9c45?auto=format&fit=crop&q=80&w=400',
    category: 'Shooting',
    highScoreKey: 'pixelrush_space_shooter_high_score'
  },
  {
    id: 'tunnel-rush',
    title: 'Tunnel Rush',
    description: 'Surreal neon tunnel navigation. How long can you stay centered?',
    thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=400',
    category: 'Arcade',
    highScoreKey: 'pixelrush_tunnel_rush_high_score'
  },
  {
    id: 'cube-dash',
    title: 'Cube Dash',
    description: 'Minimalist platforming perfection. Time your jumps, find the flow.',
    thumbnail: 'https://images.unsplash.com/photo-1616499381157-375618ddbb3f?auto=format&fit=crop&q=80&w=400',
    category: 'Endless Runner',
    highScoreKey: 'pixelrush_cube_dash_high_score'
  },
  {
    id: 'zombie-survival',
    title: 'Zombie Survival',
    description: 'The horde is coming. Pick up power-ups and survive the night.',
    thumbnail: 'https://images.unsplash.com/photo-1601513445506-2ab0d4fb4229?auto=format&fit=crop&q=80&w=400',
    category: 'Shooting',
    highScoreKey: 'pixelrush_zombie_survival_high_score'
  }
];

export const CATEGORIES = [
  'Racing', 'Shooting', 'Arcade', 'Endless Runner', 'Multiplayer', 'Puzzle'
];

export const LEADERBOARD_INITIAL = [
  { name: 'CyberKnight', score: 12500, gameId: 'desert-runner' },
  { name: 'NeonPulse', score: 9800, gameId: 'highway-racer' },
  { name: 'VoidWalker', score: 8750, gameId: 'space-shooter' },
  { name: 'PixelKing', score: 7200, gameId: 'cube-dash' },
  { name: 'GlitchMaster', score: 6500, gameId: 'tunnel-rush' },
];
