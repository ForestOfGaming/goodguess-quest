
import { useState, useEffect, useCallback, useRef } from 'react';
import { getRandomWord, calculateProximity } from '../data/words';
import { words } from '../data/words';
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

// This regex pattern will match most English words
// It allows letters, hyphenated words, and appropriate apostrophes
const isValidEnglishWord = (word: string): boolean => {
  // Basic validation pattern for English words: at least 2 characters,
  // allows letters, hyphens, and apostrophes in appropriate positions
  const wordPattern = /^[a-zA-Z]+(-[a-zA-Z]+)*('s)?$/;
  
  // Test if the input matches the pattern
  return wordPattern.test(word);
};

// Build a list of known valid words for additional validation
const buildValidWordSet = () => {
  const validWords = new Set([
    // Basic english words for validation without requiring API calls
    "apple", "banana", "orange", "grape", "kiwi", "lemon", "lime", "peach", "pear", "plum",
    "strawberry", "blueberry", "raspberry", "blackberry", "cherry", "watermelon", "melon",
    "pineapple", "mango", "papaya", "coconut", "fig", "date", "apricot", "avocado", "guava",
    "pomegranate", "carrot", "broccoli", "potato", "tomato", "onion", "garlic", "ginger",
    "spinach", "lettuce", "cucumber", "pepper", "zucchini", "eggplant", "cauliflower",
    "cabbage", "celery", "beetroot", "turnip", "radish", "asparagus", "corn", "mushroom",
    "fish", "chicken", "beef", "pork", "lamb", "turkey", "duck", "ham", "sausage", "bacon",
    "steak", "ribs", "breast", "thigh", "wing", "egg", "milk", "cheese", "yogurt", "butter",
    "cream", "ice", "chocolate", "vanilla", "strawberry", "mint", "caramel", "coffee",
    "tea", "juice", "water", "soda", "wine", "beer", "vodka", "whiskey", "rum", "gin",
    "bread", "toast", "bagel", "muffin", "cake", "pie", "cookie", "donut", "croissant",
    "waffle", "pancake", "pasta", "noodle", "rice", "potato", "sweet", "sour", "salty",
    "bitter", "spicy", "hot", "cold", "warm", "frozen", "fresh", "rotten", "raw", "cooked",
    "baked", "fried", "grilled", "roasted", "boiled", "steamed", "breakfast", "lunch",
    "dinner", "snack", "appetizer", "dessert", "salad", "soup", "sandwich", "burger",
    "pizza", "taco", "burrito", "sushi", "curry", "sauce", "ketchup", "mustard", "mayo",
    "salt", "pepper", "sugar", "honey", "syrup", "jam", "jelly", "olive", "vinegar",
    "restaurant", "kitchen", "chef", "cook", "recipe", "dish", "meal", "menu", "plate",
    "bowl", "cup", "glass", "fork", "knife", "spoon", "napkin", "straw", "picnic", "bbq",
    "vegetable", "fruit", "meat", "dairy", "grain", "cereal", "organic", "diet", "vegan",
    "gluten", "nutrition", "calorie", "protein", "fat", "carb", "vitamin", "mineral",
    "fiber", "crocodile", "badger", "armadillo", "hippo", "alpaca", "computer", "server",
    "website", "software", "hardware", "monitor", "keyboard", "speaker", "microphone",
    "camera", "printer", "scanner", "drone", "robot", "algorithm", "bluetooth", "internet",
    "ethernet", "firewall", "antivirus", "browser", "cookie", "database", "encryption",
    "password", "username", "chipset", "processor", "memory", "storage", "backup",
    "download", "upload", "streaming", "wireless", "satellite", "programming", "virtual",
    "cloud", "device", "network", "system", "app", "application", "code", "developer",
    "engineer", "tech", "technology", "digital", "analog", "circuit", "battery", "power",
    "energy", "solar", "electric", "electronic", "machine", "engine", "motor", "turbine",
    "generator", "transformer", "conductor", "insulator", "semiconductor", "transistor",
    "resistor", "capacitor", "inductor", "diode", "relay", "switch", "sensor", "detector",
    "transmitter", "receiver", "antenna", "signal", "data", "information", "knowledge",
    "wisdom", "intelligence", "artificial", "machine", "learning", "neural", "network",
    "deep", "mining", "database", "warehouse", "lake", "stream", "flow", "processing",
    "filter", "sort", "search", "index", "query", "result", "output", "input", "throughput",
    "latency", "bandwidth", "protocol", "standard", "specification", "requirement", "design",
    "implementation", "testing", "deployment", "maintenance", "support", "service", "client",
    "server", "peer", "host", "guest", "user", "customer", "vendor", "supplier", "partner",
    "stakeholder", "investor", "entrepreneur", "startup", "corporation", "company", "firm",
    "enterprise", "business", "industry", "sector", "market", "economy", "finance", "bank",
    "loan", "credit", "debit", "asset", "liability", "equity", "stock", "bond", "fund",
    "investment", "return", "profit", "loss", "revenue", "expense", "cost", "price", "value",
    "worth", "wealth", "poverty", "income", "salary", "wage", "compensation", "benefit",
    "pension", "retirement", "insurance", "risk", "hazard", "danger", "safety", "security",
    "privacy", "confidentiality", "integrity", "availability", "reliability", "durability",
    "quality", "quantity", "size", "shape", "color", "texture", "material", "substance",
    "element", "compound", "mixture", "solution", "reaction", "process", "procedure",
    "method", "technique", "skill", "ability", "talent", "gift", "genius", "savant",
    "expert", "novice", "beginner", "intermediate", "advanced", "master", "guru", "wizard",
    "witch", "warlock", "sorcerer", "magician", "enchanter", "spell", "charm", "curse",
    "blessing", "prayer", "meditation", "contemplation", "reflection", "introspection",
    "consciousness", "awareness", "perception", "sensation", "feeling", "emotion", "mood",
    "attitude", "belief", "faith", "trust", "doubt", "skepticism", "cynicism", "optimism",
    "pessimism", "realism", "idealism", "rationalism", "empiricism", "pragmatism",
    "existentialism", "nihilism", "absurdism", "stoicism", "epicureanism", "hedonism",
    "utilitarianism", "consequentialism", "deontology", "virtue", "ethics", "morality",
    "liberty", "freedom", "justice", "fairness", "equality", "equity", "diversity",
    "inclusion", "discrimination", "prejudice", "bias", "stereotype", "generalization",
    "assumption", "inference", "deduction", "induction", "abduction", "reasoning", "logic",
    "fallacy", "paradox", "contradiction", "consistency", "coherence", "precision",
    "accuracy", "clarity", "ambiguity", "vagueness", "specificity", "generality", "abstract",
    "concrete", "physical", "metaphysical", "natural", "supernatural", "normal", "paranormal",
    "ordinary", "extraordinary", "common", "rare", "unique", "special", "general", "specific",
    "particular", "universal", "local", "global", "regional", "national", "international",
    "multinational", "transnational", "supranational", "federal", "central", "peripheral",
    "marginal", "mainstream", "alternative", "conventional", "traditional", "modern",
    "contemporary", "futuristic", "ancient", "antique", "vintage", "classic", "retro",
    "nostalgic", "innovative", "creative", "original", "derivative", "copy", "replica",
    "simulation", "emulation", "imitation", "forgery", "counterfeit", "authentic", "genuine",
    "fake", "artificial", "synthetic", "natural", "organic", "biological", "chemical",
    "physical", "mechanical", "electrical", "electronic", "digital", "analog", "manual",
    "automatic", "autonomous", "dependent", "independent", "interdependent", "reliant",
    "self-sufficient", "sustainable", "renewable", "recyclable", "disposable", "consumable",
    "durable", "permanent", "temporary", "fleeting", "ephemeral", "eternal", "infinite",
    "finite", "limited", "unlimited", "restricted", "unrestricted", "constrained",
    "unconstrained", "bounded", "unbounded", "open", "closed", "ajar", "fixed", "mobile",
    "portable", "wearable", "implantable", "external", "internal", "intrinsic", "extrinsic",
    "inherent", "acquired", "learned", "innate", "instinctive", "intuitive", "rational"
  ]);

  // Add all words from all categories to ensure our target words are recognized
  Object.values(words).forEach(categoryWords => {
    categoryWords.forEach(word => {
      validWords.add(word.toLowerCase());
    });
  });

  return validWords;
};

const validWordSet = buildValidWordSet();

// Word validation that accepts most valid English words
const isValidWord = (word: string): boolean => {
  const normalizedWord = word.toLowerCase().trim();
  
  // Check if it's in our known word set
  if (validWordSet.has(normalizedWord)) {
    console.log(`Known word '${normalizedWord}' validated`);
    return true;
  }
  
  // If not in our set, use regex pattern to validate if it looks like a valid English word
  // This allows any word that follows English word patterns, even if not in our dictionary
  if (isValidEnglishWord(normalizedWord) && normalizedWord.length >= 2) {
    console.log(`New word '${normalizedWord}' accepted as valid English word`);
    return true;
  }
  
  console.log(`Word '${normalizedWord}' rejected as invalid`);
  return false;
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
    
    // Check if the word is valid
    if (!isValidWord(normalizedGuess)) {
      toast.error('Word not recognized');
      return;
    }
    
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
