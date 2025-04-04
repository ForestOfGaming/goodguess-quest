
import { SemanticData } from './types';

// Food database with country of origin and main ingredients
export const foodDatabase: Record<string, SemanticData> = {
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
