
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from '../components/NavBar';
import ProximityBar from '../components/ProximityBar';
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
    getElapsedTime
  } = useGame(categoryId, mode as GameMode);
  
  useEffect(() => {
    if (gameState.isGameOver && gameState.isWon) {
      navigate(`/win/${categoryId}/${mode}/${getElapsedTime()}`);
    } else if (gameState.isGameOver && mode === 'speedrun') {
      navigate(`/gameover/${categoryId}/${gameState.wordsGuessed}`);
    }
  }, [gameState.isGameOver, gameState.isWon, navigate, categoryId, mode, getElapsedTime, gameState.wordsGuessed]);
  
  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    submitGuess(guess);
    setGuess('');
    
    // Refocus input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Sort guesses by proximity (highest to lowest)
  const sortedGuesses = [...gameState.guesses].sort((a, b) => b.proximity - a.proximity);
  
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
          <form onSubmit={handleSubmit} className="mb-10">
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
