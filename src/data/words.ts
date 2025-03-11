
import { Category } from './categories';

interface WordData {
  [key: string]: string[];
}

export const words: WordData = {
  animals: [
    'elephant', 'giraffe', 'tiger', 'lion', 'rhino', 'panda', 'zebra', 'kangaroo', 'gorilla', 
    'cheetah', 'leopard', 'hippo', 'dolphin', 'penguin', 'koala', 'squirrel', 'raccoon', 'shark',
    'whale', 'octopus', 'turtle', 'crocodile', 'eagle', 'hawk', 'parrot', 'flamingo', 'mongoose',
    'chimpanzee', 'orangutan', 'gazelle', 'wildebeest', 'alligator', 'alpaca', 'antelope', 'armadillo',
    'badger', 'beaver', 'bison', 'bobcat', 'camel', 'deer', 'ferret', 'fox', 'hedgehog'
  ],
  food: [
    'pizza', 'hamburger', 'spaghetti', 'sushi', 'taco', 'burrito', 'lasagna', 'noodles', 'steak',
    'salad', 'cupcake', 'pancake', 'waffle', 'donut', 'bagel', 'croissant', 'sandwich', 'curry',
    'ramen', 'pho', 'risotto', 'muffin', 'cookie', 'brownie', 'cheesecake', 'chocolate', 'icecream',
    'yogurt', 'pudding', 'oatmeal', 'cereal', 'dumpling', 'kebab', 'falafel', 'hummus', 'guacamole',
    'nachos', 'quesadilla', 'paella', 'gnocchi', 'carbonara', 'tiramisu', 'baklava', 'pretzel'
  ],
  countries: [
    'japan', 'brazil', 'australia', 'france', 'italy', 'canada', 'mexico', 'india', 'china',
    'spain', 'germany', 'russia', 'argentina', 'thailand', 'egypt', 'morocco', 'kenya', 'peru',
    'sweden', 'ireland', 'portugal', 'greece', 'turkey', 'iceland', 'norway', 'denmark', 'finland',
    'netherlands', 'belgium', 'austria', 'switzerland', 'poland', 'croatia', 'serbia', 'ukraine',
    'romania', 'bulgaria', 'hungary', 'vietnam', 'singapore', 'malaysia', 'indonesia', 'philippines'
  ],
  sports: [
    'soccer', 'basketball', 'tennis', 'baseball', 'volleyball', 'golf', 'hockey', 'cricket', 'rugby',
    'swimming', 'cycling', 'running', 'boxing', 'karate', 'judo', 'taekwondo', 'skiing', 'snowboarding',
    'surfing', 'skateboarding', 'gymnastics', 'wrestling', 'weightlifting', 'archery', 'badminton',
    'handball', 'rowing', 'sailing', 'climbing', 'diving', 'fencing', 'polo', 'lacrosse', 'curling',
    'bowling', 'billiards', 'darts', 'frisbee', 'squash', 'racquetball', 'softball', 'triathlon'
  ],
  movies: [
    'avatar', 'titanic', 'avengers', 'joker', 'matrix', 'jaws', 'inception', 'alien', 'frozen',
    'cinderella', 'gladiator', 'jumanji', 'kingkong', 'batman', 'superman', 'spiderman', 'wolverine',
    'deadpool', 'interstellar', 'gravity', 'rocky', 'rambo', 'godfather', 'psycho', 'scarface',
    'casablanca', 'forrest', 'lion', 'transformers', 'jurassic', 'raiders', 'skyfall', 'spectre',
    'finding', 'toystory', 'cars', 'ratatouille', 'coco', 'wall-e', 'inside', 'brave', 'moana'
  ],
  celebrities: [
    'adele', 'beyonce', 'madonna', 'oprah', 'rihanna', 'shakira', 'taylor', 'bieber', 'eminem',
    'dicaprio', 'cruise', 'denzel', 'hanks', 'freeman', 'jackman', 'obama', 'mandela', 'einstein',
    'tesla', 'edison', 'darwin', 'newton', 'michaels', 'murray', 'jordan', 'federer', 'ronaldo',
    'messi', 'serena', 'venus', 'tiger', 'usain', 'picasso', 'davinci', 'mozart', 'beethoven',
    'columbus', 'aristotle', 'plato', 'socrates', 'cleopatra', 'caesar', 'napoleon', 'washington'
  ],
  technology: [
    'laptop', 'smartphone', 'tablet', 'router', 'server', 'website', 'software', 'hardware', 'monitor',
    'keyboard', 'speaker', 'microphone', 'camera', 'printer', 'scanner', 'drone', 'robot', 'algorithm',
    'bluetooth', 'internet', 'ethernet', 'firewall', 'antivirus', 'browser', 'cookie', 'database',
    'encryption', 'password', 'username', 'chipset', 'processor', 'memory', 'storage', 'backup',
    'download', 'upload', 'streaming', 'wireless', 'satellite', 'programming', 'virtual', 'cloud'
  ],
  music: [
    'guitar', 'piano', 'violin', 'drums', 'saxophone', 'trumpet', 'flute', 'harmonica', 'clarinet',
    'cello', 'harp', 'ukulele', 'banjo', 'accordion', 'bagpipes', 'trombone', 'tambourine', 'xylophone',
    'synthesizer', 'melody', 'harmony', 'rhythm', 'tempo', 'chord', 'scale', 'octave', 'concert',
    'festival', 'album', 'single', 'mixtape', 'playlist', 'broadway', 'orchestra', 'symphony',
    'conductor', 'composer', 'lyricist', 'producer', 'recording', 'acoustic', 'electric', 'bass'
  ],
  nature: [
    'mountain', 'forest', 'river', 'ocean', 'valley', 'canyon', 'desert', 'glacier', 'volcano',
    'waterfall', 'island', 'reef', 'savanna', 'jungle', 'prairie', 'tundra', 'taiga', 'rainforest',
    'meadow', 'swamp', 'marsh', 'lagoon', 'bayou', 'estuary', 'mangrove', 'blossom', 'wildflower',
    'redwood', 'sequoia', 'boulder', 'crystal', 'mineral', 'erosion', 'monsoon', 'typhoon', 'hurricane',
    'tornado', 'lightning', 'thunder', 'rainbow', 'eclipse', 'aurora', 'meteor', 'asteroid'
  ],
  vehicles: [
    'sedan', 'coupe', 'minivan', 'pickup', 'convertible', 'motorcycle', 'scooter', 'moped', 'bicycle',
    'truck', 'tractor', 'bulldozer', 'forklift', 'excavator', 'hovercraft', 'submarine', 'helicopter',
    'airplane', 'jetpack', 'rocket', 'spaceship', 'satellite', 'hatchback', 'limousine', 'ambulance',
    'firetruck', 'police', 'taxi', 'bus', 'shuttle', 'train', 'monorail', 'subway', 'tram', 'trolley',
    'ferry', 'ship', 'cruise', 'sailboat', 'yacht', 'canoe', 'kayak', 'rowboat', 'paddleboard'
  ],
  professions: [
    'doctor', 'lawyer', 'teacher', 'engineer', 'architect', 'designer', 'developer', 'scientist', 'researcher',
    'professor', 'student', 'journalist', 'reporter', 'editor', 'writer', 'author', 'poet', 'librarian',
    'accountant', 'banker', 'trader', 'broker', 'analyst', 'consultant', 'manager', 'director', 'supervisor',
    'baker', 'chef', 'waiter', 'bartender', 'barista', 'butcher', 'carpenter', 'electrician', 'plumber',
    'driver', 'pilot', 'astronaut', 'firefighter', 'police', 'soldier', 'sailor', 'farmer', 'gardener'
  ],
  fruits: [
    'apple', 'banana', 'orange', 'grape', 'strawberry', 'blueberry', 'blackberry', 'raspberry', 'cranberry',
    'kiwi', 'pineapple', 'watermelon', 'coconut', 'mango', 'papaya', 'peach', 'pear', 'plum', 'cherry',
    'apricot', 'nectarine', 'avocado', 'guava', 'lychee', 'dragonfruit', 'pomegranate', 'starfruit', 'persimmon',
    'durian', 'passion', 'kumquat', 'tamarind', 'fig', 'date', 'raisin', 'elderberry', 'grapefruit',
    'lemon', 'lime', 'tangerine', 'clementine', 'mandarin', 'cantaloupe', 'honeydew', 'jackfruit'
  ]
};

export const getRandomWord = (categoryId: string): string => {
  const categoryWords = words[categoryId] || [];
  if (categoryWords.length === 0) return '';
  
  const randomIndex = Math.floor(Math.random() * categoryWords.length);
  return categoryWords[randomIndex];
};

// Calculate how close two words are (0-100)
export const calculateProximity = (word1: string, word2: string): number => {
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
