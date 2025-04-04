
import { useCallback } from 'react';
import { toast } from 'sonner';
import { isValidWord } from '../utils/wordValidation';
import { calculateSemanticSimilarity } from '../utils/proximityCalculation';
import { generateHint } from '../utils/hintGeneration';
import { categoryWords } from '../data/semantic';
import { GameState } from './useGameState';

export const useGuess = (gameState: GameState, setGameState: React.Dispatch<React.SetStateAction<GameState>>) => {
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
  }, [gameState.isGameOver, gameState.guesses, gameState.targetWord, gameState.categoryId, setGameState]);

  // Toggle hints on/off
  const toggleHints = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      hintsEnabled: !prev.hintsEnabled,
      currentHint: prev.hintsEnabled ? null : prev.currentHint
    }));
  }, [setGameState]);

  return { submitGuess, toggleHints };
};
