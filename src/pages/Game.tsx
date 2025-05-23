
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavBar from '../components/NavBar';
import useGame, { GameMode } from '../hooks/useGame';
import { categories } from '../data/categories';
import GameHeader from '../components/game/GameHeader';
import GuessForm from '../components/game/GuessForm';
import HintDisplay from '../components/game/HintDisplay';
import GuessList from '../components/game/GuessList';
import GiveUpButton from '../components/game/GiveUpButton';

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
    toggleHints,
    isValidating,
    revealedHints,
    giveUp
  } = useGame(categoryId, mode as GameMode);
  
  useEffect(() => {
    if (gameState.isGameOver && gameState.isWon) {
      navigate(`/win/${categoryId}/${mode}/${getElapsedTime()}`);
    } else if (gameState.isGameOver && mode === 'speedrun' && !gameState.hasResigned) {
      navigate(`/gameover/${categoryId}/${gameState.wordsGuessed}`);
    }
  }, [gameState.isGameOver, gameState.isWon, gameState.hasResigned, navigate, categoryId, mode, getElapsedTime, gameState.wordsGuessed]);
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleGuessSubmit = (guessText: string) => {
    submitGuess(guessText);
    setGuess('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-goodguess-background">
      <NavBar />
      
      <div className="flex-1 flex flex-col p-6">
        <div className="mb-2">
          <GameHeader 
            categoryName={category?.name || ''} 
            timeRemaining={timeRemaining} 
            getElapsedTime={getElapsedTime} 
            mode={mode as GameMode}
            categoryId={categoryId}
          />
          
          <div className="mt-2 mb-4">
            <HintDisplay 
              hintsEnabled={gameState.hintsEnabled} 
              toggleHints={toggleHints} 
              currentHint={gameState.currentHint}
              revealedHints={revealedHints} 
            />
          </div>
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
          <GuessForm 
            guess={guess} 
            setGuess={setGuess} 
            submitGuess={handleGuessSubmit} 
            isValidating={isValidating}
          />
          
          <div className="flex items-center justify-end mb-6">
            <GiveUpButton 
              onGiveUp={giveUp}
              targetWord={gameState.targetWord}
              isGameOver={gameState.isGameOver}
            />
          </div>
          
          <GuessList 
            guesses={gameState.guesses} 
            wordsGuessed={gameState.wordsGuessed} 
            isSpeedrun={mode === 'speedrun'} 
          />
        </div>
      </div>
    </div>
  );
};

export default Game;
