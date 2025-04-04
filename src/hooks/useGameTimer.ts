
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
    
    // Set interval for both modes with faster updates (100ms instead of 1000ms)
    timerRef.current = setInterval(() => {
      // For speedrun mode: countdown timer
      if (gameState.mode === 'speedrun' && !gameState.isGameOver) {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 0) {
            return 0;
          }
          // Only decrement once per second
          const now = Date.now();
          const secondsPassed = Math.floor((now - gameState.startTime) / 1000);
          const newValue = gameState.timeLimit! - secondsPassed;
          return newValue > 0 ? newValue : 0;
        });
      }
      
      // For both modes: update elapsed time
      if (!gameState.isGameOver) {
        const currentElapsed = gameState.endTime 
          ? Math.floor((gameState.endTime - gameState.startTime) / 1000)
          : Math.floor((Date.now() - gameState.startTime) / 1000);
        
        setElapsedTime(currentElapsed);
      }
    }, 100); // Update 10 times per second for smoother display
    
    // Cleanup
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.mode, gameState.isGameOver, gameState.startTime, gameState.endTime, gameState.timeLimit]);
  
  // Get elapsed time in seconds
  const getElapsedTime = () => {
    return elapsedTime;
  };
  
  return { timeRemaining, getElapsedTime };
};
