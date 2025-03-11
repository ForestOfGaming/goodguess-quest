
import { useState, useEffect, useCallback, useRef } from 'react';
import { getRandomWord, calculateProximity } from '../data/words';
import { toast } from 'sonner';

export type GameMode = 'classic' | 'speedrun';

interface GameState {
  categoryId: string;
  mode: GameMode;
  targetWord: string;
  guesses: Array<{ word: string; proximity: number }>;
  isGameOver: boolean;
  isWon: boolean;
  startTime: number;
  endTime: number | null;
  timeLimit: number | null; // for speedrun mode
  wordsGuessed: number; // for speedrun mode
}

export const useGame = (categoryId: string, mode: GameMode) => {
  const [gameState, setGameState] = useState<GameState>({
    categoryId,
    mode,
    targetWord: '',
    guesses: [],
    isGameOver: false,
    isWon: false,
    startTime: Date.now(),
    endTime: null,
    timeLimit: mode === 'speedrun' ? 60 : null, // 60 seconds for speedrun
    wordsGuessed: 0
  });
  
  const timerRef = useRef<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    gameState.mode === 'speedrun' ? gameState.timeLimit : null
  );
  
  // Initialize game
  useEffect(() => {
    startNewRound();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [categoryId, mode]);
  
  // Setup timer for speedrun mode
  useEffect(() => {
    if (gameState.mode === 'speedrun' && gameState.timeLimit && !gameState.isGameOver) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null) return null;
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setGameState(prev => ({
              ...prev,
              isGameOver: true,
              endTime: Date.now()
            }));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.mode, gameState.timeLimit, gameState.isGameOver]);
  
  const startNewRound = useCallback(() => {
    const newWord = getRandomWord(categoryId);
    console.log(`[DEBUG] New target word: ${newWord}`);
    
    setGameState({
      categoryId,
      mode,
      targetWord: newWord,
      guesses: [],
      isGameOver: false,
      isWon: false,
      startTime: Date.now(),
      endTime: null,
      timeLimit: mode === 'speedrun' ? 60 : null,
      wordsGuessed: gameState.wordsGuessed
    });
    
    setTimeRemaining(mode === 'speedrun' ? 60 : null);
  }, [categoryId, mode, gameState.wordsGuessed]);
  
  const submitGuess = useCallback((guess: string) => {
    if (gameState.isGameOver) return;
    
    // Validate input
    if (!guess || guess.trim() === '') {
      toast.error('Please enter a guess');
      return;
    }
    
    const normalizedGuess = guess.toLowerCase().trim();
    const proximity = calculateProximity(normalizedGuess, gameState.targetWord);
    const isCorrect = proximity === 100;
    
    // Update game state
    setGameState(prev => {
      const newGuesses = [...prev.guesses, { word: normalizedGuess, proximity }];
      const newState = {
        ...prev,
        guesses: newGuesses
      };
      
      if (isCorrect) {
        if (prev.mode === 'classic') {
          newState.isWon = true;
          newState.isGameOver = true;
          newState.endTime = Date.now();
        } else {
          // Speedrun: move to next word
          newState.wordsGuessed = prev.wordsGuessed + 1;
          setTimeout(() => {
            toast.success('Correct! Next word...');
            startNewRound();
          }, 500);
        }
      }
      
      return newState;
    });
    
    if (isCorrect && gameState.mode === 'classic') {
      toast.success('You guessed the word!');
    }
  }, [gameState.isGameOver, gameState.targetWord, gameState.mode, startNewRound]);
  
  const getElapsedTime = useCallback(() => {
    if (gameState.endTime) {
      return Math.floor((gameState.endTime - gameState.startTime) / 1000);
    }
    return Math.floor((Date.now() - gameState.startTime) / 1000);
  }, [gameState.startTime, gameState.endTime]);
  
  const resetGame = useCallback(() => {
    setGameState({
      categoryId,
      mode,
      targetWord: getRandomWord(categoryId),
      guesses: [],
      isGameOver: false,
      isWon: false,
      startTime: Date.now(),
      endTime: null,
      timeLimit: mode === 'speedrun' ? 60 : null,
      wordsGuessed: 0
    });
    
    setTimeRemaining(mode === 'speedrun' ? 60 : null);
  }, [categoryId, mode]);
  
  return {
    gameState,
    timeRemaining,
    submitGuess,
    getElapsedTime,
    resetGame,
    startNewRound
  };
};

export default useGame;
