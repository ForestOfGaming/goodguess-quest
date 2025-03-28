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
interface SemanticData {
  name: string;
  related: string[];
  properties: Record<string, string[]>;
}

// Food database with country of origin and main ingredients
const foodDatabase: Record<string, SemanticData> = {
  'pizza': {
    name: 'pizza',
    related: ['flatbread', 'pie'],
    properties: {
      country: ['italy', 'italian'],
      ingredients: ['dough', 'cheese', 'tomato', 'sauce', 'flour']
    }
  },
  'burger': {
    name: 'burger',
    related: ['sandwich', 'hamburger'],
    properties: {
      country: ['usa', 'american', 'germany', 'german'],
      ingredients: ['beef', 'bun', 'bread', 'meat', 'lettuce', 'tomato', 'cheese']
    }
  },
  'pasta': {
    name: 'pasta',
    related: ['noodles', 'spaghetti'],
    properties: {
      country: ['italy', 'italian'],
      ingredients: ['flour', 'egg', 'water', 'wheat', 'dough']
    }
  },
  'sushi': {
    name: 'sushi',
    related: ['maki', 'nigiri', 'sashimi'],
    properties: {
      country: ['japan', 'japanese'],
      ingredients: ['rice', 'fish', 'seaweed', 'nori', 'vinegar', 'seafood']
    }
  },
  'taco': {
    name: 'taco',
    related: ['burrito', 'tortilla'],
    properties: {
      country: ['mexico', 'mexican'],
      ingredients: ['tortilla', 'corn', 'meat', 'cheese', 'lettuce', 'tomato', 'beans']
    }
  },
  'sandwich': {
    name: 'sandwich',
    related: ['burger', 'sub', 'wrap'],
    properties: {
      country: ['england', 'english', 'britain', 'british'],
      ingredients: ['bread', 'meat', 'cheese', 'lettuce', 'tomato', 'spread']
    }
  },
  'chocolate': {
    name: 'chocolate',
    related: ['candy', 'cocoa', 'dessert'],
    properties: {
      country: ['switzerland', 'swiss', 'belgium', 'belgian'],
      ingredients: ['cocoa', 'sugar', 'milk', 'butter']
    }
  },
  'cookie': {
    name: 'cookie',
    related: ['biscuit', 'dessert', 'sweet'],
    properties: {
      country: ['usa', 'american'],
      ingredients: ['flour', 'sugar', 'butter', 'egg', 'chocolate']
    }
  },
  'salad': {
    name: 'salad',
    related: ['vegetables', 'greens', 'healthy'],
    properties: {
      country: ['greece', 'greek', 'global'],
      ingredients: ['lettuce', 'vegetables', 'greens', 'dressing', 'tomato', 'cucumber']
    }
  },
  'steak': {
    name: 'steak',
    related: ['beef', 'meat', 'protein'],
    properties: {
      country: ['usa', 'american', 'argentina', 'argentinian'],
      ingredients: ['beef', 'meat', 'salt', 'pepper', 'butter']
    }
  },
  'pancake': {
    name: 'pancake',
    related: ['waffle', 'breakfast', 'flat'],
    properties: {
      country: ['usa', 'american', 'france', 'french'],
      ingredients: ['flour', 'milk', 'egg', 'butter', 'sugar', 'syrup']
    }
  },
  'waffle': {
    name: 'waffle',
    related: ['pancake', 'breakfast', 'sweet'],
    properties: {
      country: ['belgium', 'belgian'],
      ingredients: ['flour', 'egg', 'milk', 'butter', 'sugar', 'syrup']
    }
  },
  'donut': {
    name: 'donut',
    related: ['pastry', 'dessert', 'sweet'],
    properties: {
      country: ['usa', 'american'],
      ingredients: ['flour', 'sugar', 'yeast', 'oil', 'glaze', 'dough']
    }
  },
  'icecream': {
    name: 'icecream',
    related: ['dessert', 'frozen', 'sweet'],
    properties: {
      country: ['italy', 'italian', 'global'],
      ingredients: ['milk', 'cream', 'sugar', 'flavor', 'egg']
    }
  },
  'cupcake': {
    name: 'cupcake',
    related: ['cake', 'dessert', 'sweet'],
    properties: {
      country: ['usa', 'american', 'england', 'english'],
      ingredients: ['flour', 'sugar', 'butter', 'egg', 'frosting', 'cake']
    }
  }
};

// Animals database with species, habitat, and features
const animalsDatabase: Record<string, SemanticData> = {
  'elephant': {
    name: 'elephant',
    related: ['mammoth', 'pachyderm'],
    properties: {
      species: ['mammal', 'herbivore', 'pachyderm'],
      habitat: ['savanna', 'forest', 'jungle'],
      features: ['trunk', 'tusks', 'large', 'gray']
    }
  },
  'tiger': {
    name: 'tiger',
    related: ['cat', 'lion', 'predator'],
    properties: {
      species: ['mammal', 'carnivore', 'feline', 'big cat'],
      habitat: ['jungle', 'forest', 'asia'],
      features: ['stripes', 'orange', 'black', 'predator']
    }
  },
  'lion': {
    name: 'lion',
    related: ['cat', 'tiger', 'predator'],
    properties: {
      species: ['mammal', 'carnivore', 'feline', 'big cat'],
      habitat: ['savanna', 'grassland', 'africa'],
      features: ['mane', 'tan', 'predator', 'pride']
    }
  },
  'zebra': {
    name: 'zebra',
    related: ['horse', 'equine'],
    properties: {
      species: ['mammal', 'herbivore', 'equine'],
      habitat: ['savanna', 'grassland', 'africa'],
      features: ['stripes', 'black', 'white', 'hooves']
    }
  },
  'giraffe': {
    name: 'giraffe',
    related: ['herbivore', 'tall'],
    properties: {
      species: ['mammal', 'herbivore'],
      habitat: ['savanna', 'grassland', 'africa'],
      features: ['long neck', 'spots', 'tall', 'yellow', 'brown']
    }
  },
  'monkey': {
    name: 'monkey',
    related: ['ape', 'primate', 'chimpanzee'],
    properties: {
      species: ['mammal', 'omnivore', 'primate'],
      habitat: ['jungle', 'forest', 'tropics'],
      features: ['tail', 'climb', 'agile', 'social']
    }
  },
  'dolphin': {
    name: 'dolphin',
    related: ['whale', 'porpoise', 'cetacean'],
    properties: {
      species: ['mammal', 'carnivore', 'cetacean'],
      habitat: ['ocean', 'sea', 'marine'],
      features: ['intelligent', 'fins', 'tail', 'echolocation']
    }
  },
  'penguin': {
    name: 'penguin',
    related: ['bird', 'seabird'],
    properties: {
      species: ['bird', 'carnivore', 'flightless'],
      habitat: ['antarctica', 'cold', 'ice', 'ocean'],
      features: ['black', 'white', 'wings', 'waddle', 'swim']
    }
  },
  'koala': {
    name: 'koala',
    related: ['marsupial', 'bear-like'],
    properties: {
      species: ['mammal', 'herbivore', 'marsupial'],
      habitat: ['australia', 'trees', 'forests'],
      features: ['eucalyptus', 'pouch', 'gray', 'furry']
    }
  },
  'kangaroo': {
    name: 'kangaroo',
    related: ['marsupial', 'wallaby'],
    properties: {
      species: ['mammal', 'herbivore', 'marsupial'],
      habitat: ['australia', 'grassland'],
      features: ['pouch', 'hop', 'jump', 'tail', 'powerful legs']
    }
  },
  'cheetah': {
    name: 'cheetah',
    related: ['cat', 'leopard', 'feline'],
    properties: {
      species: ['mammal', 'carnivore', 'feline', 'big cat'],
      habitat: ['savanna', 'grassland', 'africa'],
      features: ['spots', 'fast', 'slender', 'tan']
    }
  },
  'rhinoceros': {
    name: 'rhinoceros',
    related: ['rhino', 'pachyderm'],
    properties: {
      species: ['mammal', 'herbivore', 'pachyderm'],
      habitat: ['savanna', 'grassland', 'africa', 'asia'],
      features: ['horn', 'thick skin', 'large', 'gray']
    }
  },
  'hippopotamus': {
    name: 'hippopotamus',
    related: ['hippo', 'river horse'],
    properties: {
      species: ['mammal', 'herbivore'],
      habitat: ['river', 'lake', 'water', 'africa'],
      features: ['large mouth', 'water', 'large', 'gray']
    }
  },
  'crocodile': {
    name: 'crocodile',
    related: ['alligator', 'reptile', 'predator'],
    properties: {
      species: ['reptile', 'carnivore', 'predator'],
      habitat: ['river', 'swamp', 'water', 'tropics'],
      features: ['scales', 'teeth', 'tail', 'green']
    }
  },
  'panda': {
    name: 'panda',
    related: ['bear', 'bamboo'],
    properties: {
      species: ['mammal', 'herbivore', 'bear'],
      habitat: ['forest', 'mountain', 'china'],
      features: ['black', 'white', 'bamboo', 'cute']
    }
  }
};

// Countries database with region, language, and features
const countriesDatabase: Record<string, SemanticData> = {
  'france': {
    name: 'france',
    related: ['europe', 'european union'],
    properties: {
      region: ['europe', 'western europe'],
      language: ['french', 'romance'],
      features: ['eiffel tower', 'wine', 'fashion', 'cuisine', 'art']
    }
  },
  'japan': {
    name: 'japan',
    related: ['asia', 'island nation'],
    properties: {
      region: ['asia', 'east asia'],
      language: ['japanese'],
      features: ['sushi', 'anime', 'technology', 'cherry blossoms', 'mount fuji']
    }
  },
  'brazil': {
    name: 'brazil',
    related: ['south america', 'amazon'],
    properties: {
      region: ['south america', 'latin america'],
      language: ['portuguese'],
      features: ['amazon', 'carnival', 'soccer', 'beaches', 'rainforest']
    }
  },
  'australia': {
    name: 'australia',
    related: ['oceania', 'down under'],
    properties: {
      region: ['oceania', 'australia'],
      language: ['english'],
      features: ['kangaroo', 'koala', 'outback', 'barrier reef', 'sydney opera house']
    }
  },
  'canada': {
    name: 'canada',
    related: ['north america', 'maple leaf'],
    properties: {
      region: ['north america'],
      language: ['english', 'french'],
      features: ['maple syrup', 'hockey', 'mountains', 'lakes', 'forests']
    }
  },
  'mexico': {
    name: 'mexico',
    related: ['north america', 'latin america'],
    properties: {
      region: ['north america', 'latin america'],
      language: ['spanish'],
      features: ['tacos', 'mariachi', 'beaches', 'pyramids', 'tequila']
    }
  },
  'germany': {
    name: 'germany',
    related: ['europe', 'european union'],
    properties: {
      region: ['europe', 'western europe'],
      language: ['german', 'germanic'],
      features: ['beer', 'cars', 'engineering', 'castles', 'pretzels']
    }
  },
  'italy': {
    name: 'italy',
    related: ['europe', 'european union'],
    properties: {
      region: ['europe', 'southern europe'],
      language: ['italian', 'romance'],
      features: ['pizza', 'pasta', 'art', 'rome', 'colosseum']
    }
  },
  'spain': {
    name: 'spain',
    related: ['europe', 'european union'],
    properties: {
      region: ['europe', 'southern europe'],
      language: ['spanish', 'romance'],
      features: ['paella', 'flamenco', 'bullfighting', 'beaches', 'siesta']
    }
  },
  'china': {
    name: 'china',
    related: ['asia', 'east asia'],
    properties: {
      region: ['asia', 'east asia'],
      language: ['chinese', 'mandarin'],
      features: ['great wall', 'kung fu', 'dragons', 'pandas', 'rice']
    }
  },
  'india': {
    name: 'india',
    related: ['asia', 'south asia'],
    properties: {
      region: ['asia', 'south asia'],
      language: ['hindi', 'english', 'bengali'],
      features: ['taj mahal', 'curry', 'bollywood', 'yoga', 'spices']
    }
  },
  'egypt': {
    name: 'egypt',
    related: ['africa', 'middle east'],
    properties: {
      region: ['africa', 'north africa', 'middle east'],
      language: ['arabic'],
      features: ['pyramids', 'sphinx', 'nile', 'pharaohs', 'desert']
    }
  },
  'kenya': {
    name: 'kenya',
    related: ['africa', 'east africa'],
    properties: {
      region: ['africa', 'east africa'],
      language: ['swahili', 'english'],
      features: ['safari', 'wildlife', 'savanna', 'marathon runners', 'masai mara']
    }
  },
  'argentina': {
    name: 'argentina',
    related: ['south america', 'latin america'],
    properties: {
      region: ['south america', 'latin america'],
      language: ['spanish'],
      features: ['tango', 'beef', 'pampas', 'soccer', 'patagonia']
    }
  },
  'thailand': {
    name: 'thailand',
    related: ['asia', 'southeast asia'],
    properties: {
      region: ['asia', 'southeast asia'],
      language: ['thai'],
      features: ['beaches', 'temples', 'elephants', 'pad thai', 'bangkok']
    }
  }
};

// Sports database with type, equipment, and features
const sportsDatabase: Record<string, SemanticData> = {
  'soccer': {
    name: 'soccer',
    related: ['football', 'sport', 'team sport'],
    properties: {
      type: ['team sport', 'ball sport', 'outdoor'],
      equipment: ['ball', 'goal', 'cleats', 'field'],
      features: ['worldwide', 'popular', 'world cup', 'leagues']
    }
  },
  'basketball': {
    name: 'basketball',
    related: ['hoops', 'sport', 'team sport'],
    properties: {
      type: ['team sport', 'ball sport', 'indoor', 'outdoor'],
      equipment: ['ball', 'hoop', 'court', 'backboard'],
      features: ['nba', 'jumping', 'scoring', 'fast-paced']
    }
  },
  'tennis': {
    name: 'tennis',
    related: ['racket sport', 'sport'],
    properties: {
      type: ['racket sport', 'individual sport', 'outdoor', 'indoor'],
      equipment: ['racket', 'ball', 'net', 'court'],
      features: ['grand slam', 'serve', 'volley', 'tournaments']
    }
  },
  'baseball': {
    name: 'baseball',
    related: ['bat and ball', 'sport', 'team sport'],
    properties: {
      type: ['team sport', 'bat and ball', 'outdoor'],
      equipment: ['bat', 'ball', 'glove', 'field', 'bases'],
      features: ['mlb', 'innings', 'pitching', 'hitting']
    }
  },
  'golf': {
    name: 'golf',
    related: ['club sport', 'sport', 'individual sport'],
    properties: {
      type: ['individual sport', 'club sport', 'outdoor'],
      equipment: ['clubs', 'ball', 'tee', 'course'],
      features: ['pga', 'putting', 'driving', 'holes']
    }
  },
  'hockey': {
    name: 'hockey',
    related: ['ice sport', 'sport', 'team sport'],
    properties: {
      type: ['team sport', 'stick sport', 'ice sport'],
      equipment: ['stick', 'puck', 'skates', 'rink', 'goal'],
      features: ['nhl', 'checking', 'penalties', 'goalie']
    }
  },
  'volleyball': {
    name: 'volleyball',
    related: ['net sport', 'sport', 'team sport'],
    properties: {
      type: ['team sport', 'net sport', 'indoor', 'outdoor'],
      equipment: ['ball', 'net', 'court'],
      features: ['spiking', 'serving', 'blocking', 'sets']
    }
  },
  'swimming': {
    name: 'swimming',
    related: ['water sport', 'sport', 'individual sport'],
    properties: {
      type: ['individual sport', 'water sport', 'olympic'],
      equipment: ['swimsuit', 'goggles', 'pool', 'water'],
      features: ['strokes', 'races', 'laps', 'diving']
    }
  },
  'cycling': {
    name: 'cycling',
    related: ['biking', 'sport', 'individual sport'],
    properties: {
      type: ['individual sport', 'endurance sport', 'outdoor'],
      equipment: ['bicycle', 'helmet', 'road', 'track'],
      features: ['tour de france', 'peloton', 'racing', 'stages']
    }
  },
  'rugby': {
    name: 'rugby',
    related: ['football', 'sport', 'team sport'],
    properties: {
      type: ['team sport', 'contact sport', 'outdoor'],
      equipment: ['ball', 'field', 'posts'],
      features: ['scrums', 'tackling', 'world cup', 'tries']
    }
  },
  'skiing': {
    name: 'skiing',
    related: ['winter sport', 'sport', 'individual sport'],
    properties: {
      type: ['individual sport', 'winter sport', 'outdoor'],
      equipment: ['skis', 'poles', 'boots', 'snow', 'mountain'],
      features: ['downhill', 'slalom', 'cross-country', 'jumps']
    }
  },
  'gymnastics': {
    name: 'gymnastics',
    related: ['acrobatics', 'sport', 'individual sport'],
    properties: {
      type: ['individual sport', 'artistic sport', 'indoor'],
      equipment: ['beam', 'bars', 'vault', 'floor', 'rings'],
      features: ['flips', 'routines', 'flexibility', 'strength']
    }
  },
  'boxing': {
    name: 'boxing',
    related: ['fighting', 'sport', 'combat sport'],
    properties: {
      type: ['combat sport', 'individual sport', 'indoor'],
      equipment: ['gloves', 'ring', 'mouthguard'],
      features: ['punches', 'rounds', 'knockouts', 'weight classes']
    }
  },
  'surfing': {
    name: 'surfing',
    related: ['water sport', 'sport', 'individual sport'],
    properties: {
      type: ['individual sport', 'water sport', 'outdoor'],
      equipment: ['surfboard', 'wetsuit', 'waves', 'ocean'],
      features: ['riding waves', 'barrels', 'competitions', 'beaches']
    }
  },
  'running': {
    name: 'running',
    related: ['track', 'sport', 'individual sport'],
    properties: {
      type: ['individual sport', 'endurance sport', 'outdoor', 'indoor'],
      equipment: ['shoes', 'track', 'road'],
      features: ['marathon', 'sprints', 'olympics', 'races']
    }
  }
};

// Movies database with genre, actors, directors and features
const moviesDatabase: Record<string, SemanticData> = {
  'avatar': {
    name: 'avatar',
    related: ['scifi', 'james cameron'],
    properties: {
      genre: ['scifi', 'adventure', 'action'],
      director: ['james cameron'],
      features: ['3d', 'aliens', 'pandora', 'visual effects', 'nature']
    }
  },
  'titanic': {
    name: 'titanic',
    related: ['drama', 'james cameron', 'historical'],
    properties: {
      genre: ['drama', 'romance', 'historical'],
      director: ['james cameron'],
      features: ['ship', 'disaster', 'romance', 'iceberg', 'historical']
    }
  },
  'avengers': {
    name: 'avengers',
    related: ['marvel', 'superheroes', 'action'],
    properties: {
      genre: ['action', 'superhero', 'scifi'],
      director: ['joss whedon', 'russo brothers'],
      features: ['iron man', 'thor', 'hulk', 'captain america', 'superheroes']
    }
  },
  'matrix': {
    name: 'matrix',
    related: ['scifi', 'action', 'philosophy'],
    properties: {
      genre: ['scifi', 'action', 'cyberpunk'],
      director: ['wachowskis'],
      features: ['neo', 'virtual reality', 'kung fu', 'dystopian', 'computers']
    }
  },
  'inception': {
    name: 'inception',
    related: ['scifi', 'mind bending', 'dreams'],
    properties: {
      genre: ['scifi', 'thriller', 'action'],
      director: ['christopher nolan'],
      features: ['dreams', 'heist', 'mind', 'complex', 'layers']
    }
  },
  'frozen': {
    name: 'frozen',
    related: ['disney', 'animation', 'musical'],
    properties: {
      genre: ['animation', 'musical', 'fantasy'],
      director: ['jennifer lee', 'chris buck'],
      features: ['elsa', 'anna', 'olaf', 'ice', 'snow', 'princess']
    }
  },
  'joker': {
    name: 'joker',
    related: ['dc', 'batman', 'villain'],
    properties: {
      genre: ['thriller', 'drama', 'crime'],
      director: ['todd phillips'],
      features: ['mental illness', 'villain', 'dark', 'gotham', 'origin story']
    }
  },
  'gladiator': {
    name: 'gladiator',
    related: ['historical', 'ancient rome', 'action'],
    properties: {
      genre: ['action', 'drama', 'historical'],
      director: ['ridley scott'],
      features: ['rome', 'arena', 'revenge', 'emperor', 'battle']
    }
  },
  'jurassic': {
    name: 'jurassic',
    related: ['dinosaurs', 'park', 'world'],
    properties: {
      genre: ['scifi', 'adventure', 'thriller'],
      director: ['steven spielberg', 'colin trevorrow'],
      features: ['dinosaurs', 'park', 'genetic engineering', 'island', 'danger']
    }
  },
  'batman': {
    name: 'batman',
    related: ['dc', 'superhero', 'gotham'],
    properties: {
      genre: ['action', 'superhero', 'crime'],
      director: ['christopher nolan', 'tim burton', 'matt reeves'],
      features: ['gotham', 'joker', 'superhero', 'dark knight', 'detective']
    }
  },
  'superman': {
    name: 'superman',
    related: ['dc', 'superhero', 'krypton'],
    properties: {
      genre: ['action', 'superhero', 'scifi'],
      director: ['richard donner', 'zack snyder'],
      features: ['krypton', 'superhero', 'metropolis', 'reporter', 'flying']
    }
  },
  'wonderwoman': {
    name: 'wonderwoman',
    related: ['dc', 'superhero', 'amazon'],
    properties: {
      genre: ['action', 'superhero', 'war'],
      director: ['patty jenkins'],
      features: ['amazon', 'superhero', 'female hero', 'themyscira', 'world war']
    }
  },
  'starwars': {
    name: 'starwars',
    related: ['scifi', 'space', 'jedi'],
    properties: {
      genre: ['scifi', 'adventure', 'fantasy'],
      director: ['george lucas', 'j.j. abrams', 'rian johnson'],
      features: ['jedi', 'force', 'space', 'lightsaber', 'empire']
    }
  },
  'harrypotter': {
    name: 'harrypotter',
    related: ['fantasy', 'magic', 'wizards'],
    properties: {
      genre: ['fantasy', 'adventure', 'young adult'],
      director: ['chris columbus', 'alfonso cuaron', 'mike newell', 'david yates'],
      features: ['hogwarts', 'magic', 'wizards', 'voldemort', 'friendship']
    }
  }
};

// Calculate semantic similarity between words
const calculateSemanticProximity = (guess: string, targetWord: string, categoryId: string): number => {
  // Base similarity score using string comparison
  const stringProximity = calculateStringProximity(guess, targetWord);
  
  // Get semantic databases based on category
  let semanticDatabase: Record<string, SemanticData> | null = null;
  
  switch(categoryId) {
    case 'food':
      semanticDatabase = foodDatabase;
      break;
    case 'animals':
      semanticDatabase = animalsDatabase;
      break;
    case 'countries':
      semanticDatabase = countriesDatabase;
      break;
    case 'sports':
      semanticDatabase = sportsDatabase;
      break;
    case 'movies':
      semanticDatabase = moviesDatabase;
      break;
    default:
      return stringProximity; // Fall back to string comparison for other categories
  }
  
  // Normalize input words
  const normalizedGuess = guess.toLowerCase().trim();
  const normalizedTarget = targetWord.toLowerCase().trim();
  
  // If either word isn't in our database, fall back to string comparison
  if (!semanticDatabase[normalizedGuess] || !semanticDatabase[normalizedTarget]) {
    return stringProximity;
  }
  
  // Get data for both words
  const guessData = semanticDatabase[normalizedGuess];
  const targetData = semanticDatabase[normalizedTarget];
  
  // Calculate semantic similarity based on shared properties
  let semanticScore = 0;
  let totalPossibleScore = 0;
  
  // Check if words are directly related
  if (guessData.related.includes(normalizedTarget) || targetData.related.includes(normalizedGuess)) {
    semanticScore += 30;
  }
  totalPossibleScore += 30;
  
  // Compare properties
  for (const [property, values] of Object.entries(targetData.properties)) {
    if (guessData.properties[property]) {
      const guessValues = guessData.properties[property];
      
      // Count shared property values
      let sharedValues = 0;
      for (const value of values) {
        if (guessValues.includes(value)) {
          sharedValues++;
        }
      }
      
      // Score based on percentage of shared values
      const propertyScore = 20 * (sharedValues / Math.max(values.length, guessValues.length));
      semanticScore += propertyScore;
      totalPossibleScore += 20;
    }
  }
  
  // Combine string and semantic proximity
  const combinedProximity = 0.4 * stringProximity + 0.6 * (semanticScore / totalPossibleScore * 100);
  
  return Math.min(Math.round(combinedProximity), 99); // Cap at 99% unless exact match
};

// Calculate string proximity using Levenshtein distance and other metrics
const calculateStringProximity = (guess: string, targetWord: string): number => {
  const normalizedGuess = guess.toLowerCase().trim();
  const normalizedTarget = targetWord.toLowerCase().trim();
  
  // Exact match
  if (normalizedGuess === normalizedTarget) {
    return 100;
  }
  
  // Calculate Levenshtein distance
  const levenshtein = levenshteinDistance(normalizedGuess, normalizedTarget);
  
  // Maximum possible distance for normalization
  const maxLength = Math.max(normalizedGuess.length, normalizedTarget.length);
  
  // Normalize distance to a percentage
  const normalizedDistance = (maxLength - levenshtein) / maxLength;
  
  // Convert to proximity percentage
  const proximityPercentage = Math.round(normalizedDistance * 100);
  
  return proximityPercentage;
};

// Calculate Levenshtein distance between strings
const levenshteinDistance = (str1: string, str2: string): number => {
  const m = str1.length;
  const n = str2.length;
  
  // Create distance matrix
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  // Initialize first row and column
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }
  
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }
  
  // Fill the matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  
  return dp[m][n];
};

// Generate a hint based on the target word and category
const generateHint = (targetWord: string, categoryId: string): string => {
  const normalizedTarget = targetWord.toLowerCase().trim();
  
  // Get database based on category
  let semanticDatabase: Record<string, SemanticData> | null = null;
  
  switch(categoryId) {
    case 'food':
      semanticDatabase = foodDatabase;
      break;
    case 'animals':
      semanticDatabase = animalsDatabase;
      break;
    case 'countries':
      semanticDatabase = countriesDatabase;
      break;
    case 'sports':
      semanticDatabase = sportsDatabase;
      break;
    case 'movies':
      semanticDatabase = moviesDatabase;
      break;
    default:
      return `It has ${targetWord.length} letters.`; // Fallback hint
  }
  
  // If the target word is in our database, give a semantic hint
  if (semanticDatabase[normalizedTarget]) {
    const targetData = semanticDatabase[normalizedTarget];
    
    // Randomly choose a hint type
    const hintType = Math.floor(Math.random() * 3);
    
    switch(hintType) {
      case 0: // Related words hint
        if (targetData.related.length > 0) {
          const relatedWord = targetData.related[Math.floor(Math.random() * targetData.related.length)];
          return `It's related to ${relatedWord}.`;
        }
        break;
      
      case 1: // Property hint
        const properties = Object.keys(targetData.properties);
        if (properties.length > 0) {
          const randomProperty = properties[Math.floor(Math.random() * properties.length)];
          const values = targetData.properties[randomProperty];
          if (values.length > 0) {
            const randomValue = values[Math.floor(Math.random() * values.length)];
            
            // Format hint based on property type
            switch(randomProperty) {
              case 'species':
                return `It's a type of ${randomValue}.`;
              case 'habitat':
                return `It can be found in ${randomValue}.`;
              case 'features':
                return `It has ${randomValue}.`;
              case 'country':
                return `It's from ${randomValue}.`;
              case 'ingredients':
                return `It contains ${randomValue}.`;
              case 'region':
                return `It's located in ${randomValue}.`;
              case 'language':
                return `They speak ${randomValue} there.`;
              case 'type':
                return `It's a ${randomValue}.`;
              case 'equipment':
                return `It uses a ${randomValue}.`;
              case 'genre':
                return `It's a ${randomValue} movie.`;
              case 'director':
                return `It was directed by ${randomValue}.`;
              default:
                return `Its ${randomProperty} is ${randomValue}.`;
            }
          }
        }
        break;
      
      case 2: // First letter hint
        return `It starts with the letter "${targetWord[0].toUpperCase()}".`;
    }
  }
  
  // Fallback hints if we couldn't generate a semantic hint
  const genericHints = [
    `It has ${targetWord.length} letters.`,
    `The first letter is "${targetWord[0].toUpperCase()}".`,
    `The last letter is "${targetWord[targetWord.length - 1].toUpperCase()}".`
  ];
  
  return genericHints[Math.floor(Math.random() * genericHints.length)];
};

// Select a random word from a category
const getRandomWord = (categoryId: string): string => {
  const category = categories.find(c => c.id === categoryId);
  
  // Hardcoded words for testing until we have full word lists in categories
  const wordLists: Record<string, string[]> = {
    'food': Object.keys(foodDatabase),
    'animals': Object.keys(animalsDatabase),
    'countries': Object.keys(countriesDatabase),
    'sports': Object.keys(sportsDatabase),
    'movies': Object.keys(moviesDatabase),
    'celebrities': ['beyonce', 'einstein', 'shakespeare', 'madonna', 'picasso'],
    'technology': ['computer', 'smartphone', 'internet', 'robot', 'satellite'],
    'music': ['piano', 'guitar', 'orchestra', 'concert', 'symphony'],
    'nature': ['mountain', 'forest', 'river', 'ocean', 'desert'],
    'vehicles': ['car', 'airplane', 'bicycle', 'submarine', 'helicopter'],
    'professions': ['doctor', 'teacher', 'engineer', 'chef', 'astronaut'],
    'fruits': ['apple', 'banana', 'orange', 'strawberry', 'watermelon']
  };
  
  const words = category?.wordList || wordLists[categoryId] || ['default'];
  
  return words[Math.floor(Math.random() * words.length)];
};

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
