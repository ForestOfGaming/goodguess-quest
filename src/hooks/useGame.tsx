
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { categories } from '../data/categories';

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

// Simple word validation using regex for English words
const isValidWord = (word: string): boolean => {
  // Basic pattern for English words (letters only, at least 2 characters)
  const englishWordPattern = /^[a-zA-Z]{2,}$/;
  return englishWordPattern.test(word);
};

// Calculate how close two words are (0-100)
const calculateProximity = (word1: string, word2: string): number => {
  // Simple algorithm for now - can be improved later
  // 1. Exact match = 100
  if (word1.toLowerCase() === word2.toLowerCase()) return 100;
  
  // 2. Check for common prefix
  let commonPrefixLength = 0;
  const minLength = Math.min(word1.length, word2.length);
  for (let i = 0; i < minLength; i++) {
    if (word1[i].toLowerCase() === word2[i].toLowerCase()) {
      commonPrefixLength++;
    } else {
      break;
    }
  }
  
  // 3. Check for length similarity (as percentage)
  const lengthRatio = Math.min(word1.length, word2.length) / Math.max(word1.length, word2.length);
  
  // 4. Check for common letters
  const letters1 = new Set(word1.toLowerCase().split(''));
  const letters2 = new Set(word2.toLowerCase().split(''));
  let commonLetters = 0;
  letters1.forEach(letter => {
    if (letters2.has(letter)) commonLetters++;
  });
  const commonLetterRatio = commonLetters / Math.max(letters1.size, letters2.size);
  
  // 5. Calculate final proximity score (weighted average)
  const prefixScore = (commonPrefixLength / minLength) * 100;
  const lengthScore = lengthRatio * 100;
  const letterScore = commonLetterRatio * 100;
  
  return Math.round((prefixScore * 0.4) + (letterScore * 0.4) + (lengthScore * 0.2));
};

// Random words by category
const categoryWords = {
  animals: ['elephant', 'tiger', 'lion', 'zebra', 'giraffe', 'monkey', 'dolphin', 'penguin', 'koala', 'kangaroo', 'cheetah', 'rhinoceros', 'hippopotamus', 'crocodile', 'panda'],
  food: ['pizza', 'burger', 'pasta', 'sushi', 'taco', 'sandwich', 'chocolate', 'cookie', 'salad', 'steak', 'pancake', 'waffle', 'donut', 'icecream', 'cupcake'],
  countries: ['france', 'japan', 'brazil', 'australia', 'canada', 'mexico', 'germany', 'italy', 'spain', 'china', 'india', 'egypt', 'kenya', 'argentina', 'thailand'],
  sports: ['soccer', 'basketball', 'tennis', 'baseball', 'golf', 'hockey', 'volleyball', 'swimming', 'cycling', 'rugby', 'skiing', 'gymnastics', 'boxing', 'surfing', 'running'],
  movies: ['avatar', 'titanic', 'avengers', 'matrix', 'inception', 'frozen', 'joker', 'gladiator', 'jurassic', 'batman', 'superman', 'wonderwoman', 'starwars', 'harrypotter', 'godfather'],
  celebrities: ['beyonce', 'madonna', 'adele', 'oprah', 'eminem', 'dicaprio', 'cruise', 'pitt', 'jolie', 'aniston', 'swift', 'ronaldo', 'messi', 'federer', 'jordan'],
  technology: ['computer', 'smartphone', 'tablet', 'internet', 'software', 'hardware', 'robot', 'drone', 'algorithm', 'database', 'network', 'server', 'website', 'application', 'program'],
  music: ['guitar', 'piano', 'violin', 'drums', 'saxophone', 'trumpet', 'flute', 'concert', 'album', 'singer', 'band', 'chorus', 'melody', 'rhythm', 'harmony'],
  nature: ['mountain', 'forest', 'river', 'ocean', 'desert', 'waterfall', 'island', 'volcano', 'canyon', 'glacier', 'jungle', 'meadow', 'beach', 'cave', 'tornado'],
  vehicles: ['car', 'truck', 'motorcycle', 'bicycle', 'airplane', 'helicopter', 'boat', 'ship', 'train', 'bus', 'submarine', 'rocket', 'tractor', 'scooter', 'ambulance'],
  professions: ['doctor', 'teacher', 'engineer', 'lawyer', 'chef', 'architect', 'artist', 'scientist', 'writer', 'programmer', 'journalist', 'accountant', 'firefighter', 'police', 'pilot'],
  fruits: ['apple', 'banana', 'orange', 'grape', 'strawberry', 'pineapple', 'mango', 'peach', 'watermelon', 'kiwi', 'cherry', 'lemon', 'blueberry', 'coconut', 'avocado']
};

// Generate a word that fits the given category
const generateTargetWord = (categoryId: string): string => {
  try {
    // Get the category details
    const category = categories.find(c => c.id === categoryId);
    if (!category) {
      console.error('Category not found:', categoryId);
      return 'apple'; // Fallback word
    }
    
    // Get possible words for this category
    const possibleWords = categoryWords[categoryId as keyof typeof categoryWords] || [];
    
    if (possibleWords.length === 0) {
      console.error('No words found for category:', categoryId);
      return 'apple'; // Fallback word
    }
    
    // Select a random word from the possible words
    const randomIndex = Math.floor(Math.random() * possibleWords.length);
    const targetWord = possibleWords[randomIndex];
    
    console.log(`[DEBUG] Generated target word: ${targetWord} for category: ${category.name}`);
    return targetWord;
  } catch (error) {
    console.error('Error generating target word:', error);
    return 'apple'; // Fallback word
  }
};

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
  
  // Update the type to NodeJS.Timeout | null to match the return type of setInterval
  const timerRef = useRef<NodeJS.Timeout | null>(null);
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
    const newWord = generateTargetWord(categoryId);
    
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
  
  const submitGuess = useCallback(async (guess: string) => {
    if (gameState.isGameOver) return;
    
    // Validate input
    if (!guess || guess.trim() === '') {
      toast.error('Please enter a guess');
      return;
    }
    
    const normalizedGuess = guess.toLowerCase().trim();
    
    // Check if the word is valid
    const isValid = isValidWord(normalizedGuess);
    
    if (!isValid) {
      toast.error('Word unknown');
      return;
    }
    
    const proximity = calculateProximity(normalizedGuess, gameState.targetWord);
    const isCorrect = proximity === 100;
    
    // Update game state
    setGameState(prev => {
      // Add the new guess
      const newGuesses = [...prev.guesses, { word: normalizedGuess, proximity }];
      
      // Sort guesses by proximity (highest to lowest)
      const sortedGuesses = newGuesses.sort((a, b) => b.proximity - a.proximity);
      
      const newState = {
        ...prev,
        guesses: sortedGuesses
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
      targetWord: generateTargetWord(categoryId),
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
