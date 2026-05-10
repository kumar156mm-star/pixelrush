import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, RotateCcw, Trophy, Share2, Zap } from 'lucide-react';
import { Game } from '../types';
import * as Phaser from 'phaser';
import { initGame } from '../games/gameEngine';

interface GameModalProps {
  game: Game | null;
  onClose: () => void;
  onScoreUpdate: (gameId: string, score: number) => void;
}

export default function GameModal({ game, onClose, onScoreUpdate }: GameModalProps) {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserInstance = useRef<Phaser.Game | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameOver'>('idle');
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    if (game && gameState === 'playing' && gameRef.current) {
      if (phaserInstance.current) {
        phaserInstance.current.destroy(true);
      }

      const config = initGame(game.id, gameRef.current, (score: number) => {
        setCurrentScore(score);
        onScoreUpdate(game.id, score);
        setGameState('gameOver');
      });

      phaserInstance.current = new Phaser.Game(config);
    }

    return () => {
      if (phaserInstance.current) {
        phaserInstance.current.destroy(true);
        phaserInstance.current = null;
      }
    };
  }, [game, gameState]);

  if (!game) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      >
        <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl" onClick={onClose} />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-6xl h-[90vh] md:aspect-video glass rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_rgba(0,242,255,0.2)]"
        >
          {/* Game Area */}
          <div className="relative flex-1 bg-black overflow-hidden select-none min-h-[60vh] md:min-h-0 group/game">
             {/* Arcade Scanlines Effect */}
            <div className="absolute inset-0 pointer-events-none z-20 opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
            <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_100px_rgba(0,0,0,1)]" />
            
            {gameState === 'idle' && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 md:p-12">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="space-y-4 md:space-y-6"
                >
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-neon-blue/20 rounded-2xl mx-auto flex items-center justify-center mb-4 md:mb-8">
                    <Play className="w-8 h-8 md:w-12 md:h-12 text-neon-blue fill-current" />
                  </div>
                  <h2 className="text-3xl md:text-7xl font-display font-extrabold tracking-tighter uppercase">{game.title}</h2>
                  <p className="text-sm md:text-xl text-gray-400 max-w-lg mx-auto font-light px-4">{game.description}</p>
                  <div className="pt-4 md:pt-8">
                    <button 
                      onClick={() => setGameState('playing')}
                      className="arcade-btn arcade-btn-primary text-lg md:text-xl px-10 py-4 md:px-12 md:py-5"
                    >
                      START MISSION
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 pt-8 md:pt-12 text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold text-gray-500">
                    <span className="flex items-center gap-2">TAP / SPACE TO ACTION</span>
                    <span className="flex items-center gap-2">DRAG / ARROWS TO MOVE</span>
                  </div>
                </motion.div>
              </div>
            )}

            {gameState === 'playing' && (
              <div ref={gameRef} className="w-full h-full" />
            )}

            {gameState === 'gameOver' && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 md:p-12 bg-black/60 backdrop-blur-sm">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-4"
                >
                  <h2 className="text-5xl md:text-8xl font-display font-extrabold tracking-tighter text-neon-pink uppercase drop-shadow-[0_0_20px_rgba(255,0,255,0.5)]">MISSION FAILED</h2>
                  <div className="py-4 md:py-8">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Final Score</p>
                    <p className="text-5xl md:text-7xl font-display font-black neon-text-blue">{currentScore.toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <button 
                      onClick={() => {
                        setGameState('idle');
                        setTimeout(() => setGameState('playing'), 50);
                      }}
                      className="arcade-btn arcade-btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
                    >
                      <RotateCcw className="w-5 h-5" /> RESTART
                    </button>
                    <button className="arcade-btn arcade-btn-outline flex items-center gap-2 w-full sm:w-auto justify-center">
                       <Share2 className="w-5 h-5" /> BRAG TO CLAN
                    </button>
                  </div>
                  <button 
                    onClick={() => setGameState('idle')}
                    className="text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-white transition-colors mt-8 block mx-auto"
                  >
                    Back to Selection
                  </button>
                </motion.div>
              </div>
            )}
          </div>

          {/* Sidebar / Stats */}
          <div className="w-full md:w-80 glass md:border-l border-white/5 p-6 md:p-8 flex flex-col h-auto md:h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-8 md:mb-12">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-4 text-yellow-500" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">High Scores</span>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <h3 className="text-2xl md:text-4xl font-display font-extrabold mb-1">{game.title}</h3>
                <p className="text-[10px] text-neon-blue uppercase tracking-widest font-bold">{game.category}</p>
              </div>

              <div className="p-4 md:p-6 glass rounded-2xl border-neon-blue/20">
                <p className="text-[10px] uppercase text-gray-500 mb-2 tracking-widest">Personal Best</p>
                <p className="text-2xl md:text-3xl font-display font-bold">{(localStorage.getItem(game.highScoreKey) || 0).toLocaleString()}</p>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500">Achievements</h4>
                 <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map(id => (
                      <div key={id} className="aspect-square glass rounded-lg flex items-center justify-center opacity-20 grayscale">
                        <Zap className="w-4 h-4" />
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            <div className="mt-8 md:mt-auto pt-8 border-t border-white/5 hidden md:block">
              <button className="w-full flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 hover:text-white transition-colors">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {Math.floor(Math.random() * 2000 + 1000)} Players Online
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
