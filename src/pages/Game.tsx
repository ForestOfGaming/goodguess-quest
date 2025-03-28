import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Info } from 'lucide-react';
import NavBar from '../components/NavBar';
import ProximityBar from '../components/ProximityBar';
import { Switch } from '../components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import useGame, { GameMode } from '../hooks/useGame';
import { categories } from '../data/categories';

const Game = () => {
  const { categoryId = '', mode = 'classic' } = useParams<{ categoryId: string; mode: GameMode }>();
  const navigate = useNavigate();
  const [guess, setGuess] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const category = categories.find(c => c.id === categoryId);
  const {
    gameState,
    timeRemaining,
    submitGuess,
    getElapsedTime,
    toggleHints
  } = useGame(categoryId, mode as GameMode);
  
  useEffect(() => {
    if (gameState.isGameOver && gameState.isWon) {
      navigate(`/win/${categoryId}/${mode}/${getElapsedTime()}`);
    } else if (gameState.isGameOver && mode === 'speedrun') {
      navigate(`/gameover/${categoryId}/${gameState.wordsGuessed}`);
    }
  }, [gameState.isGameOver, gameState.isWon, navigate, categoryId, mode, getElapsedTime, gameState.wordsGuessed]);
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    submitGuess(guess);
    setGuess('');
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const sortedGuesses = gameState.guesses;

  const getCategoryTooltipContent = () => {
    switch(categoryId) {
      case 'food':
        return "For food items, guesses are matched by ingredients and country of origin in addition to word similarity!";
      case 'animals':
        return "For animals, guesses are matched by species, habitat, and features in addition to word similarity!";
      case 'countries':
        return "For countries, guesses are matched by region, language, and cultural features in addition to word similarity!";
      case 'sports':
        return "For sports, guesses are matched by type, equipment, and characteristics in addition to word similarity!";
      case 'movies':
        return "For movies, guesses are matched by genre, directors, and themes in addition to word similarity!";
      case 'celebrities':
        return "For celebrities, guesses are matched by profession, nationality, and accomplishments in addition to word similarity!";
      case 'technology':
        return "For technology items, guesses are matched by function, type, and features in addition to word similarity!";
      case 'music':
        return "For music terms, guesses are matched by genre, instrument type, and characteristics in addition to word similarity!";
      case 'nature':
        return "For nature terms, guesses are matched by type, location, and properties in addition to word similarity!";
      case 'vehicles':
        return "For vehicles, guesses are matched by type, use, and characteristics in addition to word similarity!";
      case 'professions':
        return "For professions, guesses are matched by field, skills, and workplace in addition to word similarity!";
      case 'fruits':
        return "For fruits, guesses are matched by type, origin, and properties in addition to word similarity!";
      default:
        return "Guesses are matched by word similarity!";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-goodguess-background">
      <NavBar />
      
      <div className="flex-1 flex flex-col p-6">
        <div className="flex justify-between items-center mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg font-semibold"
          >
            {category?.name}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 cursor-help inline-flex">
                    <Info size={16} className="text-goodguess-primary" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm max-w-xs">
                    {getCategoryTooltipContent()}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`text-xl font-bold ${
              mode === 'speedrun' && timeRemaining && timeRemaining < 10
                ? 'text-goodguess-danger animate-pulse'
                : ''
            }`}
          >
            {mode === 'speedrun' ? (
              <>
                {timeRemaining}s
                <motion.div
                  className="h-1 bg-goodguess-primary mt-1 rounded-full"
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timeRemaining! / 60) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </>
            ) : (
              `${getElapsedTime()}s`
            )}
          </motion.div>
        </div>
        
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-3xl font-bold text-center mb-8"
        >
          guess the word
        </motion.h1>
        
        <div className="max-w-md mx-auto w-full">
          <form onSubmit={handleSubmit} className="mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <input
                ref={inputRef}
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                className="w-full h-16 px-4 rounded-2xl border-2 border-goodguess-primary text-lg focus:outline-none focus:ring-2 focus:ring-goodguess-primary focus:border-transparent"
                placeholder="Type your guess..."
                autoComplete="off"
              />
              <button 
                type="submit"
                className="absolute right-2 top-2 h-12 px-4 bg-goodguess-primary text-white rounded-xl font-semibold hover:bg-goodguess-primary-dark transition-colors"
              >
                Guess
              </button>
            </motion.div>
          </form>
          
          <div className="flex items-center justify-center mb-6 space-x-2">
            <Lightbulb className={`w-5 h-5 ${gameState.hintsEnabled ? 'text-yellow-500' : 'text-gray-400'}`} />
            <span className="text-sm font-medium">Hints</span>
            <Switch 
              checked={gameState.hintsEnabled}
              onCheckedChange={toggleHints}
              className="data-[state=checked]:bg-yellow-500"
            />
            <span className="text-xs text-gray-500">(every 15 guesses)</span>
          </div>
          
          {mode === 'speedrun' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-6 text-xl font-bold"
            >
              Words guessed: {gameState.wordsGuessed}
            </motion.div>
          )}
          
          {gameState.currentHint && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg mb-6 flex items-center"
            >
              <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="text-sm">Hint: {gameState.currentHint}</span>
            </motion.div>
          )}
          
          <div className="space-y-2">
            <AnimatePresence>
              {sortedGuesses.map((guess, index) => (
                <motion.div
                  key={`${guess.word}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4"
                >
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">{guess.word}</span>
                    <span className="font-bold">{guess.proximity}%</span>
                  </div>
                  <ProximityBar percentage={guess.proximity} index={index} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
