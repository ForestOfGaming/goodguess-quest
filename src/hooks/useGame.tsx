
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { categories } from '../data/categories';
import { isValidWord } from '../utils/wordValidation';
import { calculateSemanticSimilarity } from '../utils/proximityCalculation';
import { generateHint } from '../utils/hintGeneration';
import { categoryWords } from '../data/semanticDatabases';

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
  hintsEnabled: boolean; // track if hints are enabled
  currentHint: string | null; // store the current hint
}

// Custom hook for managing game state
const useGame = (categoryId: string, mode: GameMode) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const targetList = categoryWords[categoryId] || [];
    const randomTarget = targetList.length > 0 
      ? targetList[Math.floor(Math.random() * targetList.length)]
      : "default";
    
    return {
      categoryId,
      mode,
      targetWord: randomTarget,
      guesses: [],
      isGameOver: false,
      isWon: false,
      startTime: Date.now(),
      endTime: null,
      timeLimit: mode === 'speedrun' ? 60 : null, // 60 seconds for speedrun mode
      wordsGuessed: 0,
      hintsEnabled: false,
      currentHint: null
    };
  });
  
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    gameState.mode === 'speedrun' ? gameState.timeLimit : null
  );
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Setup timer for speedrun mode
  useEffect(() => {
    if (gameState.mode === 'speedrun' && gameState.timeLimit && !gameState.isGameOver) {
      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Set initial time
      setTimeRemaining(gameState.timeLimit);
      
      // Start interval
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            // Time's up!
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            setGameState(prev => ({
              ...prev,
              isGameOver: true
            }));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Cleanup
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [gameState.mode, gameState.timeLimit, gameState.isGameOver]);
  
  // Submit a guess
  const submitGuess = useCallback((guess: string) => {
    if (gameState.isGameOver) return;
    
    const normalizedGuess = guess.trim().toLowerCase();
    
    if (!isValidWord(normalizedGuess)) {
      toast.error("Please enter a valid word.");
      return;
    }
    
    // Check if word was already guessed
    if (gameState.guesses.some(g => g.word.toLowerCase() === normalizedGuess)) {
      toast.error("You already guessed that word!");
      return;
    }
    
    // Calculate proximity to target
    const proximity = calculateSemanticSimilarity(
      normalizedGuess, 
      gameState.targetWord, 
      gameState.categoryId
    );
    
    // Add to guesses
    setGameState(prev => {
      const updatedGuesses = [
        { word: normalizedGuess, proximity },
        ...prev.guesses
      ].sort((a, b) => b.proximity - a.proximity);
      
      // Check if correct (100% match)
      const isCorrectGuess = proximity === 100;
      
      // Handle speedrun mode success
      if (isCorrectGuess && prev.mode === 'speedrun') {
        // Get new target word, excluding ones already guessed
        const allWords = categoryWords[prev.categoryId] || [];
        const availableWords = allWords.filter(
          word => word !== prev.targetWord && 
          !prev.guesses.some(g => g.word === word)
        );
        
        const newTargetWord = availableWords.length > 0 
          ? availableWords[Math.floor(Math.random() * availableWords.length)]
          : allWords[Math.floor(Math.random() * allWords.length)];
        
        toast.success("Correct! Next word...", {
          position: "top-center"
        });
        
        return {
          ...prev,
          targetWord: newTargetWord,
          guesses: [],
          wordsGuessed: prev.wordsGuessed + 1,
          currentHint: null
        };
      }
      
      // Handle classic mode success
      if (isCorrectGuess && prev.mode === 'classic') {
        toast.success("You got it! Well done!", {
          position: "top-center"
        });
        
        return {
          ...prev,
          guesses: updatedGuesses,
          isGameOver: true,
          isWon: true,
          endTime: Date.now()
        };
      }
      
      // Check if a hint should be given (every 15 guesses)
      let newHint = prev.currentHint;
      if (prev.hintsEnabled && updatedGuesses.length % 15 === 0 && !isCorrectGuess) {
        newHint = generateHint(prev.targetWord, prev.categoryId, updatedGuesses);
        toast.info("A hint has been revealed!", {
          position: "top-center"
        });
      }
      
      return {
        ...prev,
        guesses: updatedGuesses,
        currentHint: newHint
      };
    });
  }, [gameState.isGameOver, gameState.guesses, gameState.targetWord, gameState.categoryId]);
  
  // Toggle hints on/off
  const toggleHints = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      hintsEnabled: !prev.hintsEnabled,
      currentHint: prev.hintsEnabled ? null : prev.currentHint
    }));
  }, []);
  
  // Get elapsed time in seconds
  const getElapsedTime = useCallback(() => {
    if (gameState.endTime) {
      return Math.floor((gameState.endTime - gameState.startTime) / 1000);
    }
    return Math.floor((Date.now() - gameState.startTime) / 1000);
  }, [gameState.startTime, gameState.endTime]);
  
  return {
    gameState,
    timeRemaining,
    submitGuess,
    getElapsedTime,
    toggleHints
  };
};

export default useGame;
