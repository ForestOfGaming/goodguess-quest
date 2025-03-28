
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { categories } from '../data/categories';
import { isValidWord } from '../utils/wordValidation';
import { calculateSemanticProximity } from '../utils/proximityCalculation';
import { generateHint, getRandomWord } from '../utils/hintGeneration';

export type GameMode = 'classic' | 'speedrun';

export interface GameState {
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
  hintsEnabled: boolean; // track if hints are enabled
  currentHint: string | null; // store the current hint
}

// The main game hook
export const useGame = (categoryId: string, mode: GameMode) => {
  const [gameState, setGameState] = useState<GameState>({
    categoryId,
    mode,
    targetWord: getRandomWord(categoryId),
    guesses: [],
    isGameOver: false,
    isWon: false,
    startTime: Date.now(),
    endTime: null,
    timeLimit: mode === 'speedrun' ? 60 : null, // 60 seconds for speedrun mode
    wordsGuessed: 0,
    hintsEnabled: false,
    currentHint: null
  });
  
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    mode === 'speedrun' ? 60 : null
  );
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize the game
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Set up timer for speedrun mode
    if (mode === 'speedrun') {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 0) {
            // Game over when time runs out
            setGameState(state => ({
              ...state,
              isGameOver: true,
              endTime: Date.now()
            }));
            
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    // Cleanup the timer when component unmounts
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [mode]);
  
  // Get elapsed time in seconds
  const getElapsedTime = useCallback(() => {
    if (gameState.endTime) {
      return Math.floor((gameState.endTime - gameState.startTime) / 1000);
    }
    return Math.floor((Date.now() - gameState.startTime) / 1000);
  }, [gameState.startTime, gameState.endTime]);
  
  // Handle user guess submission
  const submitGuess = useCallback((guessWord: string) => {
    if (gameState.isGameOver) {
      return;
    }
    
    // Validate the word
    if (!isValidWord(guessWord)) {
      toast.error("Please enter a valid word.");
      return;
    }
    
    // Check if word was already guessed
    if (gameState.guesses.some(g => g.word.toLowerCase() === guessWord.toLowerCase())) {
      toast.error("You already guessed that word!");
      return;
    }
    
    // Calculate proximity
    const targetWord = gameState.targetWord;
    const proximity = calculateSemanticProximity(guessWord, targetWord, categoryId);
    
    // Create new guess
    const newGuess = { word: guessWord, proximity };
    
    setGameState(state => {
      // Check for win condition
      let isWon = false;
      let endTime = state.endTime;
      
      if (guessWord.toLowerCase() === targetWord.toLowerCase()) {
        isWon = true;
        endTime = Date.now();
        
        // For speedrun mode, increment word count and set new target
        if (state.mode === 'speedrun') {
          const newWordsGuessed = state.wordsGuessed + 1;
          const newTargetWord = getRandomWord(categoryId);
          
          return {
            ...state,
            targetWord: newTargetWord,
            guesses: [],
            wordsGuessed: newWordsGuessed,
            currentHint: null
          };
        }
      }
      
      // For classic mode, update game state with new guess
      const updatedGuesses = [...state.guesses, newGuess];
      
      // Check if we should generate a hint
      let currentHint = state.currentHint;
      if (state.hintsEnabled && updatedGuesses.length % 15 === 0 && !isWon) {
        currentHint = generateHint(targetWord, categoryId);
        toast.info(`Hint: ${currentHint}`);
      }
      
      return {
        ...state,
        guesses: updatedGuesses,
        isGameOver: isWon && state.mode !== 'speedrun',
        isWon,
        endTime,
        currentHint
      };
    });
  }, [gameState, categoryId]);
  
  // Toggle hints on/off
  const toggleHints = useCallback(() => {
    setGameState(state => ({
      ...state,
      hintsEnabled: !state.hintsEnabled,
      currentHint: null // Clear current hint when toggling
    }));
    
    toast.info(gameState.hintsEnabled 
      ? "Hints disabled" 
      : "Hints enabled - you'll get a hint every 15 guesses");
      
  }, [gameState.hintsEnabled]);
  
  return {
    gameState,
    timeRemaining,
    submitGuess,
    getElapsedTime,
    toggleHints
  };
};
