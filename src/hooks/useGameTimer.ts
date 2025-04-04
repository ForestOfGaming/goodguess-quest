
import { useState, useEffect, useRef } from 'react';
import { GameState } from './useGameState';

export const useGameTimer = (gameState: GameState) => {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    gameState.mode === 'speedrun' ? gameState.timeLimit : null
  );
  
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Setup timer for both modes
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Set interval for both modes
    timerRef.current = setInterval(() => {
      // For speedrun mode: countdown timer
      if (gameState.mode === 'speedrun' && !gameState.isGameOver) {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 0) {
            return 0;
          }
          return prev - 1;
        });
      }
      
      // For both modes: update elapsed time
      if (!gameState.isGameOver) {
        const currentElapsed = gameState.endTime 
          ? Math.floor((gameState.endTime - gameState.startTime) / 1000)
          : Math.floor((Date.now() - gameState.startTime) / 1000);
        
        setElapsedTime(currentElapsed);
      }
    }, 1000);
    
    // Cleanup
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.mode, gameState.isGameOver, gameState.startTime, gameState.endTime]);
  
  // Get elapsed time in seconds
  const getElapsedTime = () => {
    return elapsedTime;
  };
  
  return { timeRemaining, getElapsedTime };
};
