
import { SemanticData } from './types';

// Countries database with region, language, features and neighbors
export const countriesDatabase: Record<string, SemanticData> = {
  'france': {
    name: 'france',
    related: ['europe', 'european union'],
    properties: {
      region: ['europe', 'western europe'],
      language: ['french', 'romance'],
      features: ['eiffel tower', 'wine', 'fashion', 'cuisine', 'art'],
      neighbors: ['spain', 'italy', 'germany', 'belgium', 'switzerland', 'luxembourg']
    }
  },
  'japan': {
    name: 'japan',
    related: ['asia', 'island nation'],
    properties: {
      region: ['asia', 'east asia'],
      language: ['japanese'],
      features: ['sushi', 'anime', 'technology', 'cherry blossoms', 'mount fuji'],
      neighbors: [] // island nation
    }
  },
  'brazil': {
    name: 'brazil',
    related: ['south america', 'amazon'],
    properties: {
      region: ['south america', 'latin america'],
      language: ['portuguese'],
      features: ['amazon', 'carnival', 'soccer', 'beaches', 'rainforest'],
      neighbors: ['argentina', 'uruguay', 'paraguay', 'bolivia', 'peru', 'colombia', 'venezuela', 'guyana', 'suriname', 'french guiana']
    }
  },
  'australia': {
    name: 'australia',
    related: ['oceania', 'down under'],
    properties: {
      region: ['oceania', 'australia'],
      language: ['english'],
      features: ['kangaroo', 'koala', 'outback', 'barrier reef', 'sydney opera house'],
      neighbors: [] // island nation
    }
  },
  'canada': {
    name: 'canada',
    related: ['north america', 'maple leaf'],
    properties: {
      region: ['north america'],
      language: ['english', 'french'],
      features: ['maple syrup', 'hockey', 'mountains', 'lakes', 'forests'],
      neighbors: ['united states']
    }
  },
  'mexico': {
    name: 'mexico',
    related: ['north america', 'latin america'],
    properties: {
      region: ['north america', 'latin america'],
      language: ['spanish'],
      features: ['tacos', 'mariachi', 'beaches', 'pyramids', 'tequila'],
      neighbors: ['united states', 'guatemala', 'belize']
    }
  },
  'germany': {
    name: 'germany',
    related: ['europe', 'european union'],
    properties: {
      region: ['europe', 'western europe', 'central europe'],
      language: ['german', 'germanic'],
      features: ['beer', 'cars', 'engineering', 'castles', 'pretzels'],
      neighbors: ['france', 'switzerland', 'austria', 'czech republic', 'poland', 'denmark', 'netherlands', 'belgium', 'luxembourg']
    }
  },
  'italy': {
    name: 'italy',
    related: ['europe', 'european union'],
    properties: {
      region: ['europe', 'southern europe'],
      language: ['italian', 'romance'],
      features: ['pizza', 'pasta', 'art', 'rome', 'colosseum'],
      neighbors: ['france', 'switzerland', 'austria', 'slovenia', 'san marino', 'vatican city']
    }
  },
  'spain': {
    name: 'spain',
    related: ['europe', 'european union', 'iberian peninsula'],
    properties: {
      region: ['europe', 'southern europe'],
      language: ['spanish', 'romance'],
      features: ['paella', 'flamenco', 'bullfighting', 'beaches', 'siesta'],
      neighbors: ['portugal', 'france', 'andorra', 'gibraltar']
    }
  },
  'portugal': {
    name: 'portugal',
    related: ['europe', 'european union', 'iberian peninsula'],
    properties: {
      region: ['europe', 'southern europe'],
      language: ['portuguese', 'romance'],
      features: ['fado music', 'port wine', 'beaches', 'seafood', 'maritime history'],
      neighbors: ['spain']
    }
  },
  'china': {
    name: 'china',
    related: ['asia', 'east asia'],
    properties: {
      region: ['asia', 'east asia'],
      language: ['chinese', 'mandarin'],
      features: ['great wall', 'kung fu', 'dragons', 'pandas', 'rice'],
      neighbors: ['russia', 'mongolia', 'north korea', 'vietnam', 'laos', 'myanmar', 'india', 'bhutan', 'nepal', 'pakistan', 'afghanistan', 'tajikistan', 'kyrgyzstan', 'kazakhstan']
    }
  },
  'india': {
    name: 'india',
    related: ['asia', 'south asia'],
    properties: {
      region: ['asia', 'south asia'],
      language: ['hindi', 'english', 'bengali'],
      features: ['taj mahal', 'curry', 'bollywood', 'yoga', 'spices'],
      neighbors: ['pakistan', 'china', 'nepal', 'bhutan', 'bangladesh', 'myanmar']
    }
  },
  'egypt': {
    name: 'egypt',
    related: ['africa', 'middle east'],
    properties: {
      region: ['africa', 'north africa', 'middle east'],
      language: ['arabic'],
      features: ['pyramids', 'sphinx', 'nile', 'pharaohs', 'desert'],
      neighbors: ['libya', 'sudan', 'israel']
    }
  },
  'kenya': {
    name: 'kenya',
    related: ['africa', 'east africa'],
    properties: {
      region: ['africa', 'east africa'],
      language: ['swahili', 'english'],
      features: ['safari', 'wildlife', 'savanna', 'marathon runners', 'masai mara'],
      neighbors: ['ethiopia', 'somalia', 'south sudan', 'uganda', 'tanzania']
    }
  },
  'argentina': {
    name: 'argentina',
    related: ['south america', 'latin america'],
    properties: {
      region: ['south america', 'latin america'],
      language: ['spanish'],
      features: ['tango', 'beef', 'pampas', 'soccer', 'patagonia'],
      neighbors: ['chile', 'bolivia', 'paraguay', 'brazil', 'uruguay']
    }
  },
  'thailand': {
    name: 'thailand',
    related: ['asia', 'southeast asia'],
    properties: {
      region: ['asia', 'southeast asia'],
      language: ['thai'],
      features: ['beaches', 'temples', 'elephants', 'pad thai', 'bangkok'],
      neighbors: ['myanmar', 'laos', 'cambodia', 'malaysia']
    }
  }
};
