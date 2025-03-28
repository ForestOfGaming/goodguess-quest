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
  hintsEnabled: boolean; // track if hints are enabled
  currentHint: string | null; // store the current hint
}

// Improved word validation with stronger checks for real English words
const isValidWord = (word: string): boolean => {
  if (!word || word.trim() === '') return false;
  
  // Allow multi-word terms (e.g. "New York", "Ice Cream")
  const normalizedWord = word.trim().toLowerCase();
  
  // Check each word segment for validity
  const wordSegments = normalizedWord.split(' ');
  
  for (const segment of wordSegments) {
    // Each segment should be at least 2 characters and contain only letters
    if (segment.length < 2 || !/^[a-z]+$/.test(segment)) {
      return false;
    }
    
    // Special validation for short words (2-3 letters)
    if (segment.length <= 3) {
      // Common valid 2-letter words
      const validTwoLetterWords = [
        'am', 'an', 'as', 'at', 'be', 'by', 'do', 'go', 'he', 'hi', 'if', 'in', 
        'is', 'it', 'me', 'my', 'no', 'of', 'on', 'or', 'so', 'to', 'up', 'us', 
        'we', 'ox', 'ax'
      ];
      
      // Common valid 3-letter words
      const validThreeLetterWords = [
        'act', 'add', 'age', 'ago', 'aid', 'aim', 'air', 'all', 'and', 'any', 'arm',
        'art', 'ask', 'ate', 'bad', 'bag', 'ban', 'bar', 'bat', 'bay', 'bed', 'bee',
        'beg', 'bet', 'bid', 'big', 'bit', 'bog', 'boy', 'bud', 'bug', 'bun', 'bus',
        'but', 'buy', 'can', 'cap', 'car', 'cat', 'cow', 'cry', 'cup', 'cut', 'dad',
        'day', 'did', 'die', 'dig', 'dim', 'dip', 'dog', 'dot', 'dry', 'due', 'dug',
        'ear', 'eat', 'egg', 'end', 'eye', 'fan', 'far', 'fat', 'fee', 'few', 'fig',
        'fit', 'fix', 'fly', 'fog', 'for', 'fox', 'fun', 'fur', 'gap', 'gas', 'get',
        'got', 'gum', 'gun', 'gut', 'guy', 'gym', 'had', 'ham', 'has', 'hat', 'hay',
        'hen', 'her', 'hey', 'hid', 'him', 'hip', 'his', 'hit', 'hog', 'hot', 'how',
        'hub', 'hug', 'hut', 'ice', 'ill', 'ink', 'inn', 'jam', 'jar', 'jaw', 'jet',
        'job', 'jog', 'joy', 'key', 'kid', 'kit', 'lab', 'lac', 'lap', 'law', 'lay',
        'led', 'leg', 'let', 'lid', 'lie', 'lip', 'lit', 'log', 'lot', 'low', 'mad',
        'man', 'map', 'mat', 'may', 'men', 'met', 'mix', 'mob', 'mom', 'mop', 'mud',
        'mug', 'nap', 'net', 'new', 'nod', 'not', 'now', 'nun', 'nut', 'off', 'oil',
        'old', 'one', 'our', 'out', 'owe', 'owl', 'own', 'pad', 'pan', 'paw', 'pay',
        'pea', 'pen', 'pet', 'pie', 'pig', 'pin', 'pit', 'pop', 'pot', 'pry', 'pub',
        'put', 'rag', 'ran', 'rat', 'raw', 'ray', 'red', 'rib', 'rid', 'rim', 'rip',
        'rob', 'rod', 'rot', 'row', 'rub', 'rug', 'run', 'sad', 'sat', 'saw', 'say',
        'sea', 'see', 'set', 'sew', 'she', 'shy', 'sip', 'sir', 'sit', 'six', 'ski',
        'sky', 'sly', 'son', 'spy', 'sum', 'sun', 'tag', 'tan', 'tap', 'tax', 'tea',
        'ten', 'the', 'tie', 'tin', 'tip', 'toe', 'top', 'toy', 'try', 'tub', 'two',
        'use', 'van', 'vat', 'vet', 'vie', 'war', 'was', 'wax', 'way', 'web', 'wed',
        'wet', 'who', 'why', 'wig', 'win', 'wit', 'won', 'wry', 'yes', 'yet', 'you',
        'yum', 'zip', 'zoo'
      ];
      
      if (segment.length === 2 && !validTwoLetterWords.includes(segment)) {
        return false;
      }
      
      if (segment.length === 3 && !validThreeLetterWords.includes(segment)) {
        return false;
      }
    }
  }
  
  // Check for common non-words patterns (expanded blacklist approach)
  const nonWords = ['aaa', 'bbb', 'ccc', 'ddd', 'eee', 'fff', 'ggg', 'hhh', 'iii', 
                   'jjj', 'kkk', 'lll', 'mmm', 'nnn', 'ooo', 'ppp', 'qqq', 'rrr', 
                   'sss', 'ttt', 'uuu', 'vvv', 'www', 'xxx', 'yyy', 'zzz',
                   'asd', 'qwe', 'zxc', 'asdf', 'qwer', 'wasd'];
                   
  if (nonWords.includes(normalizedWord)) {
    return false;
  }
  
  // Basic length check (most real words aren't extremely long)
  if (normalizedWord.length > 30) {
    return false;
  }
  
  // Check for repeating characters (e.g., "aaaa", "lllll")
  if (/(.)\1{2,}/.test(normalizedWord)) {
    return false;
  }
  
  // Check for common keyboard patterns that aren't real words
  if (/^[qwertasdfgzxcvb]{3,}$/.test(normalizedWord) || 
      /^[yuiophjklnm]{3,}$/.test(normalizedWord)) {
    return false;
  }
  
  // Check for words with unusual consonant patterns (non-pronounceable)
  if (/[bcdfghjklmnpqrstvwxz]{4,}/.test(normalizedWord)) {
    return false;
  }
  
  return true;
};

// Food metadata for improved proximity calculation
interface FoodData {
  name: string;
  country: string[];
  ingredients: string[];
}

// Food database with country of origin and main ingredients
const foodDatabase: Record<string, FoodData> = {
  'pizza': {
    name: 'pizza',
    country: ['italy', 'italian'],
    ingredients: ['dough', 'cheese', 'tomato', 'sauce', 'flour']
  },
  'burger': {
    name: 'burger',
    country: ['usa', 'american', 'germany', 'german'],
    ingredients: ['beef', 'bun', 'bread', 'meat', 'lettuce', 'tomato', 'cheese']
  },
  'pasta': {
    name: 'pasta',
    country: ['italy', 'italian'],
    ingredients: ['flour', 'egg', 'water', 'wheat', 'dough']
  },
  'sushi': {
    name: 'sushi',
    country: ['japan', 'japanese'],
    ingredients: ['rice', 'fish', 'seaweed', 'nori', 'vinegar', 'seafood']
  },
  'taco': {
    name: 'taco',
    country: ['mexico', 'mexican'],
    ingredients: ['tortilla', 'corn', 'meat', 'cheese', 'lettuce', 'tomato', 'beans']
  },
  'sandwich': {
    name: 'sandwich',
    country: ['england', 'english', 'britain', 'british'],
    ingredients: ['bread', 'meat', 'cheese', 'lettuce', 'tomato', 'spread']
  },
  'chocolate': {
    name: 'chocolate',
    country: ['switzerland', 'swiss', 'belgium', 'belgian'],
    ingredients: ['cocoa', 'sugar', 'milk', 'butter']
  },
  'cookie': {
    name: 'cookie',
    country: ['usa', 'american'],
    ingredients: ['flour', 'sugar', 'butter', 'egg', 'chocolate']
  },
  'salad': {
    name: 'salad',
    country: ['greece', 'greek', 'global'],
    ingredients: ['lettuce', 'vegetables', 'greens', 'dressing', 'tomato', 'cucumber']
  },
  'steak': {
    name: 'steak',
    country: ['usa', 'american', 'argentina', 'argentinian'],
    ingredients: ['beef', 'meat', 'salt', 'pepper', 'butter']
  },
  'pancake': {
    name: 'pancake',
    country: ['usa', 'american', 'france', 'french'],
    ingredients: ['flour', 'milk', 'egg', 'butter', 'sugar', 'syrup']
  },
  'waffle': {
    name: 'waffle',
    country: ['belgium', 'belgian'],
    ingredients: ['flour', 'egg', 'milk', 'butter', 'sugar', 'syrup']
  },
  'donut': {
    name: 'donut',
    country: ['usa', 'american'],
    ingredients: ['flour', 'sugar', 'yeast', 'oil', 'glaze', 'dough']
  },
  'icecream': {
    name: 'icecream',
    country: ['italy', 'italian', 'global'],
    ingredients: ['milk', 'cream', 'sugar', 'flavor', 'egg']
  },
  'cupcake': {
    name: 'cupcake',
    country: ['usa', 'american', 'england', 'english'],
    ingredients: ['flour', 'sugar', 'butter', 'egg', 'frosting', 'cake']
  }
};

// Calculate how close two words are (0-100)
const calculateProximity = (word1: string, word2: string, categoryId?: string): number => {
  // Simple algorithm for now - can be improved later
  // 1. Exact match = 100
  if (word1.toLowerCase() === word2.toLowerCase()) return 100;
  
  // Special case for food category with enhanced proximity calculation
  if (categoryId === 'food') {
    const foodWord1 = word1.toLowerCase();
    const foodWord2 = word2.toLowerCase();
    
    // Check if both foods are in our database
    const food1Data = foodDatabase[foodWord1];
    const food2Data = foodDatabase[foodWord2];
    
    // If we have data for both foods, use enhanced calculation
    if (food1Data && food2Data) {
      // Calculate country similarity
      let countryMatch = 0;
      food1Data.country.forEach(country1 => {
        if (food2Data.country.some(country2 => country1 === country2)) {
          countryMatch = 1;
        }
      });
      
      // Calculate ingredient similarity
      let commonIngredients = 0;
      food1Data.ingredients.forEach(ingredient1 => {
        if (food2Data.ingredients.some(ingredient2 => ingredient1 === ingredient2)) {
          commonIngredients++;
        }
      });
      
      const ingredientSimilarity = commonIngredients / Math.max(food1Data.ingredients.length, food2Data.ingredients.length);
      
      // Calculate standard text similarity
      const standardSimilarity = calculateStandardProximity(foodWord1, foodWord2);
      
      // Weight the factors (text: 40%, country: 30%, ingredients: 30%)
      const enhancedScore = (standardSimilarity * 0.4) + (countryMatch * 30) + (ingredientSimilarity * 30);
      
      return Math.round(enhancedScore);
    }
  }
  
  // For non-food categories or foods not in database, use standard proximity calculation
  return calculateStandardProximity(word1, word2);
};

// Standard proximity calculation for all categories
const calculateStandardProximity = (word1: string, word2: string): number => {
  const normalizedWord1 = word1.toLowerCase();
  const normalizedWord2 = word2.toLowerCase();
  
  // 2. Check for common prefix
  let commonPrefixLength = 0;
  const minLength = Math.min(normalizedWord1.length, normalizedWord2.length);
  for (let i = 0; i < minLength; i++) {
    if (normalizedWord1[i] === normalizedWord2[i]) {
      commonPrefixLength++;
    } else {
      break;
    }
  }
  
  // 3. Check for length similarity (as percentage)
  const lengthRatio = Math.min(normalizedWord1.length, normalizedWord2.length) / Math.max(normalizedWord1.length, normalizedWord2.length);
  
  // 4. Check for common letters
  const letters1 = new Set(normalizedWord1.split(''));
  const letters2 = new Set(normalizedWord2.split(''));
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

// Generate a hint for the target word
const generateHint = (targetWord: string): string => {
  // Different hint strategies
  const hintTypes = [
    // First letter hint
    () => `The word starts with "${targetWord[0].toUpperCase()}"`,
    
    // Length hint
    () => `The word has ${targetWord.length} letters`,
    
    // Partial reveal (reveal ~30% of letters with their positions)
    () => {
      const letters = targetWord.split('');
      const revealCount = Math.max(1, Math.floor(letters.length * 0.3));
      const positions = [];
      
      // Collect random positions to reveal
      while (positions.length < revealCount) {
        const pos = Math.floor(Math.random() * letters.length);
        if (!positions.includes(pos)) {
          positions.push(pos);
        }
      }
      
      // Create the hint with revealed letters
      let hint = 'Some letters: ';
      positions.sort((a, b) => a - b);
      positions.forEach((pos, idx) => {
        hint += `"${letters[pos].toUpperCase()}" at position ${pos + 1}`;
        if (idx < positions.length - 1) {
          hint += ', ';
        }
      });
      
      return hint;
    },
    
    // Category specific hint
    (category?: string) => `This is a ${category || 'common'} word`
  ];
  
  // Select a random hint type
  const randomHintType = Math.floor(Math.random() * hintTypes.length);
  return hintTypes[randomHintType]();
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
    wordsGuessed: 0,
    hintsEnabled: true, // hints enabled by default
    currentHint: null
  });
  
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
      wordsGuessed: gameState.wordsGuessed,
      hintsEnabled: gameState.hintsEnabled,
      currentHint: null
    });
    
    setTimeRemaining(mode === 'speedrun' ? 60 : null);
  }, [categoryId, mode, gameState.wordsGuessed, gameState.hintsEnabled]);
  
  const toggleHints = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      hintsEnabled: !prev.hintsEnabled,
      currentHint: !prev.hintsEnabled ? prev.currentHint : null
    }));
    
    toast.success(gameState.hintsEnabled ? 'Hints disabled' : 'Hints enabled');
  }, [gameState.hintsEnabled]);
  
  const submitGuess = useCallback(async (guess: string) => {
    if (gameState.isGameOver) return;
    
    // Validate input
    if (!guess || guess.trim() === '') {
      toast.error('Please enter a guess');
      return;
    }
    
    const normalizedGuess = guess.trim();
    
    // Check if the word is valid
    const isValid = isValidWord(normalizedGuess);
    
    if (!isValid) {
      toast.error('Word unknown');
      return;
    }
    
    const proximity = calculateProximity(normalizedGuess, gameState.targetWord, gameState.categoryId);
    const isCorrect = proximity === 100;
    
    // Update game state
    setGameState(prev => {
      // Add the new guess
      const newGuesses = [...prev.guesses, { word: normalizedGuess, proximity }];
      
      // Sort guesses by proximity (highest to lowest)
      const sortedGuesses = newGuesses.sort((a, b) => b.proximity - a.proximity);
      
      const newState = {
        ...prev,
        guesses: sortedGuesses,
      };
      
      // Check if we should provide a hint (every 15 wrong guesses)
      if (prev.hintsEnabled && !isCorrect && newGuesses.length % 15 === 0) {
        const hint = generateHint(prev.targetWord);
        newState.currentHint = hint;
        
        // Show hint toast
        setTimeout(() => {
          toast.info(`Hint: ${hint}`, {
            duration: 8000,
          });
        }, 500);
      }
      
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
  }, [gameState.isGameOver, gameState.targetWord, gameState.mode, gameState.hintsEnabled, gameState.categoryId, startNewRound]);
  
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
      wordsGuessed: 0,
      hintsEnabled: gameState.hintsEnabled,
      currentHint: null
    });
    
    setTimeRemaining(mode === 'speedrun' ? 60 : null);
  }, [categoryId, mode, gameState.hintsEnabled]);
  
  return {
    gameState,
    timeRemaining,
    submitGuess,
    getElapsedTime,
    resetGame,
    startNewRound,
    toggleHints
  };
};

export default useGame;
