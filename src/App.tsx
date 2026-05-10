import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, Trophy, Zap, User, Star, Menu, X, Play } from 'lucide-react';
import { GAMES, CATEGORIES, LEADERBOARD_INITIAL } from './constants';
import { Game } from './types';
import GameModal from './components/GameModal';

export default function App() {
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [highScores, setHighScores] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showDailyRewards, setShowDailyRewards] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 2000);
    
    // Check for daily rewards
    const lastReward = localStorage.getItem('pixelrush_last_reward');
    const today = new Date().toDateString();
    if (lastReward !== today) {
      setTimeout(() => setShowDailyRewards(true), 3000);
    }

    const scores: Record<string, number> = {};
    GAMES.forEach(game => {
      const saved = localStorage.getItem(game.highScoreKey);
      if (saved) scores[game.id] = parseInt(saved);
    });
    setHighScores(scores);
  }, []);

  const handleGameSelect = (game: Game) => {
    setActiveGame(game);
  };

  const updateHighScore = (gameId: string, score: number) => {
    const game = GAMES.find(g => g.id === gameId);
    if (!game) return;

    const currentScore = highScores[gameId] || 0;
    if (score > currentScore) {
      localStorage.setItem(game.highScoreKey, score.toString());
      setHighScores(prev => ({ ...prev, [gameId]: score }));
    }
  };

  const claimReward = () => {
    localStorage.setItem('pixelrush_last_reward', new Date().toDateString());
    setShowDailyRewards(false);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-deep-bg flex flex-col items-center justify-center z-[200]">
        <motion.div
           animate={{ 
             scale: [1, 1.2, 1],
             rotate: [0, 180, 360]
           }}
           transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
           className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full shadow-[0_0_20px_rgba(0,242,255,0.5)] mb-8"
        />
        <h2 className="text-2xl font-display font-bold tracking-[0.3em] neon-text-blue animate-pulse">INITIALIZING PIXELRUSH...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen selection:bg-neon-blue/30 selection:text-neon-blue">
      {/* Daily Rewards Popup */}
      <AnimatePresence>
        {showDailyRewards && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/80 backdrop-blur-md"
               onClick={() => setShowDailyRewards(false)}
            />
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 1 }}
              className="relative glass p-12 rounded-3xl max-w-sm w-full text-center border-t-4 border-neon-purple shadow-[0_0_50px_rgba(188,19,254,0.3)]"
            >
              <div className="w-20 h-20 bg-neon-purple/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-float">
                <Star className="w-10 h-10 text-neon-purple fill-current" />
              </div>
              <h3 className="text-3xl font-display font-bold mb-4">DAILY BONUS</h3>
              <p className="text-gray-400 mb-8 font-light">You've received 500 XP and a Bronze Mystery Crate!</p>
              <button 
                onClick={claimReward}
                className="arcade-btn arcade-btn-primary w-full"
              >
                CLAIM REWARDS
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-neon-purple rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,242,255,0.4)]">
              <Gamepad2 className="text-black w-6 h-6" />
            </div>
            <span className="text-2xl font-display font-extrabold tracking-tighter neon-text-blue">PIXELRUSH</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest text-gray-400">
            <a href="#games" className="hover:text-neon-blue transition-colors">Games</a>
            <a href="#categories" className="hover:text-neon-blue transition-colors">Categories</a>
            <a href="#leaderboard" className="hover:text-neon-blue transition-colors">Leaderboard</a>
            <a href="#leaderboard" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:neon-border transition-all">
              <User className="w-5 h-5" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 glass pt-24 px-8 md:hidden"
          >
            <div className="flex flex-col gap-6 text-xl font-display uppercase font-bold text-center">
              <a href="#games" onClick={() => setIsMenuOpen(false)}>Games</a>
              <a href="#categories" onClick={() => setIsMenuOpen(false)}>Categories</a>
              <a href="#leaderboard" onClick={() => setIsMenuOpen(false)}>Leaderboard</a>
              <a href="#profile" onClick={() => setIsMenuOpen(false)}>Your Profile</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-neon-blue/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-neon-purple/10 rounded-full blur-[100px] animate-pulse" />
          </div>

          <div className="relative text-center px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl md:text-8xl font-display font-extrabold mb-6 tracking-tighter">
                PLAY INSTANT <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink drop-shadow-[0_0_20px_rgba(0,242,255,0.3)]">
                  BROWSER GAMES
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 mb-10 font-light tracking-wide max-w-2xl mx-auto">
                Racing, Shooting, Endless Runner & Arcade Games. <br />
                No downloads. No waiting. Just Pure Neon Adrenaline.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => document.getElementById('games')?.scrollIntoView({ behavior: 'smooth' })}
                  className="arcade-btn arcade-btn-primary group w-full sm:w-auto"
                >
                  <span className="flex items-center gap-2 justify-center">
                    Level Up Now <Play className="w-5 h-5 fill-current" />
                  </span>
                </button>
                <button className="arcade-btn arcade-btn-outline w-full sm:w-auto">
                  View Leaderboard
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Games */}
        <section id="games" className="py-24 max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-sm uppercase tracking-[0.3em] font-bold text-neon-blue mb-2">Featured Hits</h2>
              <h3 className="text-4xl md:text-5xl font-display font-bold">ARCADE FAVORITES</h3>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 glass rounded-full text-xs font-bold uppercase tracking-widest hover:neon-border transition-all">All Games</button>
              <button className="px-4 py-2 glass rounded-full text-xs font-bold uppercase tracking-widest hover:neon-border transition-all">Popular</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {GAMES.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative h-80 rounded-2xl overflow-hidden glass hover:neon-border transition-all duration-500 cursor-pointer"
                onClick={() => handleGameSelect(game)}
              >
                <img 
                  src={game.thumbnail} 
                  alt={game.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-bg via-deep-bg/40 to-transparent" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-neon-blue mb-1">{game.category}</span>
                  <h4 className="text-2xl font-display font-extrabold mb-2 underline decoration-transparent group-hover:decoration-neon-blue transition-all">{game.title}</h4>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    {game.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-mono tracking-tighter">
                        {highScores[game.id] || 0} PTS
                      </span>
                    </div>
                    <button className="w-10 h-10 bg-white/10 hover:bg-neon-blue hover:text-black rounded-lg flex items-center justify-center transition-all">
                      <Play className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section id="categories" className="py-24 bg-white/[0.02] border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h2 className="text-center text-4xl font-display font-bold mb-12">DISCOVER CATEGORIES</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {CATEGORIES.map((cat) => (
                <button key={cat} className="px-8 py-4 glass rounded-xl font-display font-bold uppercase tracking-widest hover:bg-neon-purple/20 hover:neon-border hover:scale-105 transition-all">
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Daily Challenge & Leaderboard */}
        <section id="leaderboard" className="py-24 max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Daily Challenge */}
          <div className="space-y-8">
            <div>
              <h2 className="text-sm uppercase tracking-[0.3em] font-bold text-neon-purple mb-2">Quest of the Day</h2>
              <h3 className="text-4xl font-display font-bold">DAILY CHALLENGE</h3>
            </div>
            
            <div className="relative glass p-8 rounded-3xl overflow-hidden border-2 border-neon-purple/30 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/20 blur-[60px] animate-pulse" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="w-24 h-24 bg-neon-purple/20 rounded-2xl flex items-center justify-center animate-float">
                  <Zap className="w-12 h-12 text-neon-purple" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold mb-2">Desert Sprint Master</h4>
                  <p className="text-gray-400 mb-6 font-light">Beat 5,000 score in Desert Runner to unlock the "Sand Storm" achievement badge.</p>
                  <div className="flex items-center gap-4">
                    <button className="arcade-btn arcade-btn-primary text-sm px-6 py-2">Start Challenge</button>
                    <span className="text-xs uppercase tracking-widest font-bold text-gray-500">Starts in 2h 45m</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded bg-neon-blue/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-neon-blue" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-widest">Profile</span>
                </div>
                <h5 className="text-xl font-display font-bold">Gamer_772</h5>
                <p className="text-xs text-gray-500 font-mono">Rank: #142 Gold Tier</p>
              </div>
              <div className="glass p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded bg-yellow-500/10 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-widest">Badges</span>
                </div>
                <h5 className="text-xl font-display font-bold">24 UNLOCKED</h5>
                <p className="text-xs text-gray-500 font-mono">Top: Speed Demon</p>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="space-y-8">
             <div>
              <h2 className="text-sm uppercase tracking-[0.3em] font-bold text-neon-blue mb-2">Global Rankings</h2>
              <h3 className="text-4xl font-display font-bold">TOP PLAYERS</h3>
            </div>

            <div className="glass rounded-3xl overflow-hidden divide-y divide-white/5 border border-white/5">
              {LEADERBOARD_INITIAL.map((entry, index) => (
                <div key={index} className="px-8 py-6 flex items-center justify-between hover:bg-white/[0.03] transition-colors group">
                  <div className="flex items-center gap-6">
                    <span className={`text-xl font-mono ${index === 0 ? 'text-neon-blue font-bold' : 'text-gray-600'}`}>
                      {index + 1}.
                    </span>
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:neon-border">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <h5 className="font-bold tracking-wide">{entry.name}</h5>
                      <p className="text-[10px] uppercase text-gray-500 font-bold tracking-[0.2em]">{entry.gameId.replace('-', ' ')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-display font-bold text-neon-blue">{entry.score.toLocaleString()}</span>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">XP gained</p>
                  </div>
                </div>
              ))}
              <div className="p-4 text-center">
                <button className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-neon-blue transition-colors">View All Hall of Fame</button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-24 border-t border-white/5 glass">
          <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-neon-blue to-neon-purple rounded flex items-center justify-center">
                  <Gamepad2 className="text-black w-5 h-5" />
                </div>
                <span className="text-xl font-display font-extrabold tracking-tighter">PIXELRUSH</span>
              </div>
              <p className="text-gray-400 max-w-sm mb-8 font-light">
                The ultimate destination for modern, fast-loading, browser-based gaming. 
                Bringing the arcade experience to you, wherever you are.
              </p>
              <div className="flex gap-4">
                {['Twitter', 'Discord', 'Instagram', 'Steam'].map(social => (
                  <button key={social} className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:neon-border hover:bg-neon-blue/10 hover:text-neon-blue transition-all">
                    <div className="w-5 h-5 bg-current opacity-20 rounded-full" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h6 className="font-bold uppercase tracking-widest text-xs mb-8">Platform</h6>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="hover:text-neon-blue cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-neon-blue cursor-pointer transition-colors">Games Library</li>
                <li className="hover:text-neon-blue cursor-pointer transition-colors">Latest News</li>
                <li className="hover:text-neon-blue cursor-pointer transition-colors">Gamer Shop</li>
              </ul>
            </div>

            <div>
              <h6 className="font-bold uppercase tracking-widest text-xs mb-8">Support</h6>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="hover:text-neon-blue cursor-pointer transition-colors">Contact</li>
                <li className="hover:text-neon-blue cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-neon-blue cursor-pointer transition-colors">Terms of Service</li>
                <li className="hover:text-neon-blue cursor-pointer transition-colors">Cookies</li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 md:px-8 mt-24 text-center text-xs text-gray-600 font-mono tracking-widest uppercase">
            © 2026 PIXELRUSH ARCADE • ALL RIGHTS RESERVED • MANUFACTURED IN NEON CITY
          </div>
        </footer>
      </main>

      <GameModal 
        game={activeGame} 
        onClose={() => setActiveGame(null)} 
        onScoreUpdate={updateHighScore}
      />
    </div>
  );
}
