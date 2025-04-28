
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { isValidWord, checkWordWithAI } from '../utils/wordValidation';
import { calculateSemanticSimilarity } from '../utils/proximityCalculation';
import { generateHint, generateLetterPositionHint } from '../utils/hintGeneration';
import { categoryWords } from '../data/semantic';
import { GameState } from './useGameState';

export const useGuess = (gameState: GameState, setGameState: React.Dispatch<React.SetStateAction<GameState>>) => {
  const [isValidating, setIsValidating] = useState(false);

  // Submit a guess
  const submitGuess = useCallback(async (guess: string) => {
    if (gameState.isGameOver || isValidating) return;
    
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
    
    setIsValidating(true);
    
    try {
      // In a real implementation, this would call an AI or dictionary API
      // For now we'll use the basic validation we already have
      const isRealWord = await checkWordWithAI(normalizedGuess);
      
      if (!isRealWord) {
        toast.error("That doesn't seem to be a real word.");
        setIsValidating(false);
        return;
      }
      
      // Calculate proximity to target - this is now async
      const proximity = await calculateSemanticSimilarity(
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
            currentHint: null,
            revealedHints: [] // Reset hints for the new word
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
        let updatedHints = [...prev.revealedHints];
        if (prev.hintsEnabled && updatedGuesses.length % 15 === 0 && !isCorrectGuess) {
          // Generate a hint that hasn't been shown before
          let attempts = 0;
          let newHint = null;
          const maxAttempts = 10; // Increase max attempts to find unique hint
          
          // Try multiple times to get a unique hint
          while (attempts < maxAttempts && (!newHint || updatedHints.includes(newHint))) {
            attempts++;
            newHint = generateHint(prev.targetWord, prev.categoryId, updatedGuesses);
          }
          
          // If we found a unique hint, add it
          if (newHint && !updatedHints.includes(newHint)) {
            updatedHints.push(newHint);
            toast.info("A new hint has been revealed!", {
              position: "top-center"
            });
          } else if (attempts >= maxAttempts) {
            // Fallback to a safer letter position hint that doesn't reveal the whole word
            // or give incorrect information
            const letterPositionHint = generateLetterPositionHint(prev.targetWord);
            
            if (!updatedHints.includes(letterPositionHint)) {
              updatedHints.push(letterPositionHint);
              toast.info("A new hint has been revealed!", {
                position: "top-center"
              });
            }
          }
        }
        
        return {
          ...prev,
          guesses: updatedGuesses,
          revealedHints: updatedHints,
          currentHint: updatedHints.length > 0 ? updatedHints[updatedHints.length - 1] : null
        };
      });
    } catch (error) {
      console.error("Error validating word:", error);
      toast.error("There was a problem validating your guess.");
    } finally {
      setIsValidating(false);
    }
  }, [gameState.isGameOver, gameState.guesses, gameState.targetWord, gameState.categoryId, setGameState, isValidating]);

  // Toggle hints on/off
  const toggleHints = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      hintsEnabled: !prev.hintsEnabled,
      currentHint: !prev.hintsEnabled ? prev.revealedHints[prev.revealedHints.length - 1] || null : null
    }));
  }, [setGameState]);

  return { submitGuess, toggleHints, isValidating };
};
