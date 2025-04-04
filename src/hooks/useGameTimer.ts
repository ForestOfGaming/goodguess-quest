
import { useState, useEffect, useRef } from 'react';
import { GameState } from './useGameState';

export const useGameTimer = (gameState: GameState) => {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    gameState.mode === 'speedrun' ? gameState.timeLimit : null
  );
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Setup timer for speedrun mode and constant timer updates for classic mode
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Set interval for both modes
    timerRef.current = setInterval(() => {
      if (gameState.mode === 'speedrun' && !gameState.isGameOver) {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            // Time's up!
            return 0;
          }
          return prev - 1;
        });
      } else if (gameState.mode === 'classic' && !gameState.isGameOver) {
        // Force re-render to update elapsed time counter
        setTimeRemaining(prev => (prev === null ? null : Date.now()));
      }
    }, 1000);
    
    // Cleanup
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.mode, gameState.isGameOver]);
  
  // Get elapsed time in seconds
  const getElapsedTime = () => {
    if (gameState.endTime) {
      return Math.floor((gameState.endTime - gameState.startTime) / 1000);
    }
    return Math.floor((Date.now() - gameState.startTime) / 1000);
  };
  
  return { timeRemaining, getElapsedTime };
};
