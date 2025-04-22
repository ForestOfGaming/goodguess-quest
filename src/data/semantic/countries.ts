import { SemanticData } from './types';

export const countriesDatabase: Record<string, SemanticData> = {
  'france': {
    name: 'france',
    related: ['europe', 'european union', 'western europe', 'developed nation', 'republic'],
    properties: {
      region: ['europe', 'western europe', 'mediterranean'],
      language: ['french', 'romance'],
      features: ['eiffel tower', 'wine', 'fashion', 'cuisine', 'art'],
      climate: ['temperate', 'mediterranean', 'continental'],
      geography: ['coastal', 'mountains', 'rivers', 'plains'],
      economy: ['developed', 'industrial', 'tourism'],
      culture: ['wine', 'cuisine', 'art', 'fashion', 'literature']
    }
  },
  'japan': {
    name: 'japan',
    related: ['asia', 'island nation'],
    properties: {
      region: ['asia', 'east asia'],
      language: ['japanese'],
      features: ['sushi', 'anime', 'technology', 'cherry blossoms', 'mount fuji'],
      climate: ['temperate', 'subtropical'],
      geography: ['mountains', 'coastal'],
      economy: ['developed', 'industrial', 'tourism'],
      culture: ['anime', 'technology', 'cherry blossoms', 'mount fuji']
    }
  },
  'brazil': {
    name: 'brazil',
    related: ['south america', 'amazon'],
    properties: {
      region: ['south america', 'latin america'],
      language: ['portuguese'],
      features: ['amazon', 'carnival', 'soccer', 'beaches', 'rainforest'],
      climate: ['tropical', 'subtropical'],
      geography: ['rainforest', 'coastal', 'mountains'],
      economy: ['developed', 'industrial', 'tourism'],
      culture: ['amazon', 'carnival', 'soccer', 'beaches', 'rainforest']
    }
  },
  'australia': {
    name: 'australia',
    related: ['oceania', 'down under'],
    properties: {
      region: ['oceania', 'australia'],
      language: ['english'],
      features: ['kangaroo', 'koala', 'outback', 'barrier reef', 'sydney opera house'],
      climate: ['tropical', 'subtropical'],
      geography: ['coastal', 'mountains', 'rivers', 'plains'],
      economy: ['developed', 'industrial', 'tourism'],
      culture: ['kangaroo', 'koala', 'outback', 'barrier reef', 'sydney opera house']
    }
  },
  'canada': {
    name: 'canada',
    related: ['north america', 'maple leaf'],
    properties: {
      region: ['north america'],
      language: ['english', 'french'],
      features: ['maple syrup', 'hockey', 'mountains', 'lakes', 'forests'],
      climate: ['temperate', 'subtropical'],
      geography: ['mountains', 'coastal', 'rivers', 'plains'],
      economy: ['developed', 'industrial', 'tourism'],
      culture: ['maple syrup', 'hockey', 'mountains', 'lakes', 'forests']
    }
  },
  'mexico': {
    name: 'mexico',
    related: ['north america', 'latin america'],
    properties: {
      region: ['north america', 'latin america'],
      language: ['spanish'],
      features: ['tacos', 'mariachi', 'beaches', 'pyramids', 'tequila'],
      climate: ['tropical', 'subtropical'],
      geography: ['coastal', 'mountains', 'rivers', 'plains'],
      economy: ['developed', 'industrial', 'tourism'],
      culture: ['tacos', 'mariachi', 'beaches', 'pyramids', 'tequila']
    }
  },
  'germany': {
    name: 'germany',
    related: ['europe', 'european union'],
    properties: {
      region: ['europe', 'western europe'],
      language: ['german', 'germanic'],
      features: ['beer', 'cars', 'engineering', 'castles', 'pretzels'],
      climate: ['temperate', 'continental'],
      geography: ['coastal', 'mountains', 'rivers', 'plains'],
      economy: ['developed', 'industrial', 'tourism'],
      culture: ['beer', 'cars', 'engineering', 'castles', 'pretzels']
    }
  },
  'italy': {
    name: 'italy',
    related: ['europe', 'european union'],
    properties: {
      region: ['europe', 'southern europe'],
      language: ['italian', 'romance'],
      features: ['pizza', 'pasta', 'art', 'rome', 'colosseum'],
      climate: ['temperate', 'continental'],
      geography: ['coastal', 'mountains', 'rivers', 'plains'],
      economy: ['developed', 'industrial', 'tourism'],
      culture: ['pizza', 'pasta', 'art', 'rome', 'colosseum']
    }
  },
  'spain': {
    name: 'spain',
    related: ['europe', 'european union'],
    properties: {
      region: ['europe', 'southern europe'],
      language: ['spanish', 'romance'],
      features: ['paella', 'flamenco', 'bullfighting', 'beaches', 'siesta'],
      climate: ['temperate', 'continental'],
      geography: ['coastal', 'mountains', 'rivers', 'plains'],
      economy: ['developed', 'industrial', 'tourism'],
      culture: ['paella', 'flamenco', 'bullfighting', 'beaches', 'siesta']
    }
  },
  'china': {
    name: 'china',
    related: ['asia', 'east asia'],
    properties: {
      region: ['asia', 'east asia'],
      language: ['chinese', 'mandarin'],
      features: ['great wall', 'kung fu', 'dragons', 'pandas', 'rice'],
      climate: ['temperate', 'continental'],
      geography: ['mountains', 'coastal', 'rivers', 'plains'],
      economy: ['developed', 'industrial', 'tourism'],
      culture: ['great wall', 'kung fu', 'dragons', 'pandas', 'rice']
    }
  },
  'india': {
    name: 'india',
    related: ['asia', 'south asia'],
    properties: {
      region: ['asia', 'south asia'],
      language: ['hindi', 'english', 'bengali'],
      features: ['taj mahal', 'curry', 'bollywood', 'yoga', 'spices'],
      climate: ['temperate', 'subtropical'],
      geography: ['mountains', 'coastal', 'rivers', 'plains'],
      economy: ['developed', 'industrial', 'tourism'],
      culture: ['taj mahal', 'curry', 'bollywood', 'yoga', 'spices']
    }
  },
  'egypt': {
    name: 'egypt',
    related: ['africa', 'middle east'],
    properties: {
      region: ['africa', 'north africa', 'middle east'],
      language: ['arabic'],
      features: ['pyramids', 'sphinx', 'nile', 'pharaohs', 'desert'],
      climate: ['arid', 'temperate'],
      geography: ['desert', 'mountains', 'rivers', 'plains'],
      economy: ['developed', 'industrial', 'tourism'],
      culture: ['pyramids', 'sphinx', 'nile', 'pharaohs', 'desert']
    }
  },
  'kenya': {
    name: 'kenya',
    related: ['africa', 'east africa'],
    properties: {
      region: ['africa', 'east africa'],
      language: ['swahili', 'english'],
      features: ['safari', 'wildlife', 'savanna', 'marathon runners', 'masai mara'],
      climate: ['tropical', 'subtropical'],
      geography: ['savanna', 'mountains', 'rivers', 'plains'],
      economy: ['developed', 'industrial', 'tourism'],
      culture: ['safari', 'wildlife', 'savanna', 'marathon runners', 'masai mara']
    }
  },
  'argentina': {
    name: 'argentina',
    related: ['south america', 'latin america'],
    properties: {
      region: ['south america', 'latin america'],
      language: ['spanish'],
      features: ['tango', 'beef', 'pampas', 'soccer', 'patagonia'],
      climate: ['tropical', 'subtropical'],
      geography: ['pampas', 'mountains', 'rivers', 'plains'],
      economy: ['developed', 'industrial', 'tourism'],
      culture: ['tango', 'beef', 'pampas', 'soccer', 'patagonia']
    }
  },
  'thailand': {
    name: 'thailand',
    related: ['asia', 'southeast asia'],
    properties: {
      region: ['asia', 'southeast asia'],
      language: ['thai'],
      features: ['beaches', 'temples', 'elephants', 'pad thai', 'bangkok'],
      climate: ['tropical', 'subtropical'],
      geography: ['coastal', 'mountains', 'rivers', 'plains'],
      economy: ['developed', 'industrial', 'tourism'],
      culture: ['beaches', 'temples', 'elephants', 'pad thai', 'bangkok']
    }
  }
};
