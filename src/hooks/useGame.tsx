
import { useEffect } from 'react';
import { useGameState } from './useGameState';
import { useGameTimer } from './useGameTimer';
import { useGuess } from './useGuess';

export type GameMode = 'classic' | 'speedrun';

// Custom hook for managing game state
const useGame = (categoryId: string, mode: GameMode) => {
  const { gameState, setGameState } = useGameState(categoryId, mode);
  const { timeRemaining, getElapsedTime } = useGameTimer(gameState);
  const { submitGuess, toggleHints, isValidating } = useGuess(gameState, setGameState);
  
  // Handle game over when timer runs out in speedrun mode
  useEffect(() => {
    if (gameState.mode === 'speedrun' && timeRemaining === 0 && !gameState.isGameOver) {
      setGameState(prev => ({
        ...prev,
        isGameOver: true
      }));
    }
  }, [timeRemaining, gameState.mode, gameState.isGameOver, setGameState]);
  
  // Function to resign/give up
  const giveUp = () => {
    setGameState(prev => ({
      ...prev,
      isGameOver: true,
      hasResigned: true,
      endTime: Date.now()
    }));
  };
  
  return {
    gameState,
    timeRemaining,
    submitGuess,
    getElapsedTime,
    toggleHints,
    isValidating,
    revealedHints: gameState.revealedHints,
    giveUp
  };
};

export default useGame;
