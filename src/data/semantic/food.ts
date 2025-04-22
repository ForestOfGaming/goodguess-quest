import { SemanticData } from './types';

export const foodDatabase: Record<string, SemanticData> = {
  'pizza': {
    name: 'pizza',
    related: ['flatbread', 'pie', 'italian food', 'fast food', 'takeout', 'baked'],
    properties: {
      country: ['italy', 'italian', 'mediterranean'],
      ingredients: ['dough', 'cheese', 'tomato', 'sauce', 'flour', 'yeast', 'herbs'],
      type: ['main dish', 'savory', 'baked', 'sharable'],
      texture: ['crispy', 'chewy', 'melted'],
      temperature: ['hot', 'warm'],
      occasion: ['party', 'dinner', 'lunch', 'casual']
    }
  },
  'burger': {
    name: 'burger',
    related: ['sandwich', 'hamburger', 'fast food', 'american food', 'takeout', 'grilled'],
    properties: {
      country: ['usa', 'american', 'germany', 'german'],
      ingredients: ['beef', 'bun', 'bread', 'meat', 'lettuce', 'tomato', 'cheese', 'pickles', 'onions'],
      type: ['main dish', 'savory', 'grilled', 'portable'],
      texture: ['juicy', 'soft', 'crispy'],
      temperature: ['hot', 'warm'],
      occasion: ['lunch', 'dinner', 'casual', 'bbq']
    }
  },
  'pasta': {
    name: 'pasta',
    related: ['noodles', 'spaghetti', 'italian food', 'comfort food', 'sauce', 'carbohydrate'],
    properties: {
      country: ['italy', 'italian', 'mediterranean'],
      ingredients: ['flour', 'egg', 'water', 'wheat', 'dough', 'semolina'],
      type: ['main dish', 'savory', 'cooked', 'versatile'],
      texture: ['smooth', 'firm', 'chewy'],
      temperature: ['hot', 'warm'],
      occasion: ['dinner', 'lunch', 'family meal', 'restaurant']
    }
  },
  'sushi': {
    name: 'sushi',
    related: ['maki', 'nigiri', 'sashimi', 'japanese food', 'seafood', 'rice'],
    properties: {
      country: ['japan', 'japanese', 'asian'],
      ingredients: ['rice', 'fish', 'seaweed', 'nori', 'vinegar', 'seafood', 'soy sauce'],
      type: ['main dish', 'savory', 'raw', 'delicate'],
      texture: ['sticky', 'smooth', 'firm'],
      temperature: ['cold', 'room temperature'],
      occasion: ['lunch', 'dinner', 'special occasion', 'restaurant']
    }
  },
  'taco': {
    name: 'taco',
    related: ['burrito', 'tortilla', 'mexican food', 'street food', 'spicy', 'savory'],
    properties: {
      country: ['mexico', 'mexican', 'latin american'],
      ingredients: ['tortilla', 'corn', 'meat', 'cheese', 'lettuce', 'tomato', 'beans', 'salsa'],
      type: ['main dish', 'savory', 'handheld', 'customizable'],
      texture: ['crispy', 'soft', 'chewy'],
      temperature: ['hot', 'warm'],
      occasion: ['lunch', 'dinner', 'casual', 'party']
    }
  },
  'sandwich': {
    name: 'sandwich',
    related: ['burger', 'sub', 'wrap', 'deli', 'lunch', 'portable'],
    properties: {
      country: ['england', 'english', 'britain', 'british'],
      ingredients: ['bread', 'meat', 'cheese', 'lettuce', 'tomato', 'spread', 'mayonnaise'],
      type: ['main dish', 'savory', 'cold', 'portable'],
      texture: ['soft', 'crispy', 'layered'],
      temperature: ['cold', 'room temperature'],
      occasion: ['lunch', 'picnic', 'work', 'travel']
    }
  },
  'chocolate': {
    name: 'chocolate',
    related: ['candy', 'cocoa', 'dessert', 'sweet', 'indulgence', 'treat'],
    properties: {
      country: ['switzerland', 'swiss', 'belgium', 'belgian'],
      ingredients: ['cocoa', 'sugar', 'milk', 'butter', 'vanilla'],
      type: ['dessert', 'sweet', 'snack', 'gift'],
      texture: ['smooth', 'creamy', 'rich'],
      temperature: ['cold', 'room temperature'],
      occasion: ['celebration', 'gift', 'snack', 'dessert']
    }
  },
  'cookie': {
    name: 'cookie',
    related: ['biscuit', 'dessert', 'sweet', 'baked', 'snack', 'treat'],
    properties: {
      country: ['usa', 'american'],
      ingredients: ['flour', 'sugar', 'butter', 'egg', 'chocolate', 'vanilla'],
      type: ['dessert', 'sweet', 'snack', 'baked'],
      texture: ['crispy', 'chewy', 'soft'],
      temperature: ['room temperature', 'warm'],
      occasion: ['snack', 'dessert', 'party', 'gift']
    }
  },
  'salad': {
    name: 'salad',
    related: ['vegetables', 'greens', 'healthy', 'light', 'refreshing', 'diet'],
    properties: {
      country: ['greece', 'greek', 'global'],
      ingredients: ['lettuce', 'vegetables', 'greens', 'dressing', 'tomato', 'cucumber', 'olives'],
      type: ['side dish', 'main dish', 'healthy', 'light'],
      texture: ['crisp', 'fresh', 'mixed'],
      temperature: ['cold', 'room temperature'],
      occasion: ['lunch', 'dinner', 'side dish', 'diet']
    }
  },
  'steak': {
    name: 'steak',
    related: ['beef', 'meat', 'protein', 'grilled', 'savory', 'dinner'],
    properties: {
      country: ['usa', 'american', 'argentina', 'argentinian'],
      ingredients: ['beef', 'meat', 'salt', 'pepper', 'butter', 'garlic'],
      type: ['main dish', 'savory', 'grilled', 'expensive'],
      texture: ['tender', 'juicy', 'firm'],
      temperature: ['hot', 'warm'],
      occasion: ['dinner', 'special occasion', 'restaurant', 'celebration']
    }
  },
  'pancake': {
    name: 'pancake',
    related: ['waffle', 'breakfast', 'flat', 'sweet', 'syrup', 'brunch'],
    properties: {
      country: ['usa', 'american', 'france', 'french'],
      ingredients: ['flour', 'milk', 'egg', 'butter', 'sugar', 'syrup', 'baking powder'],
      type: ['breakfast', 'dessert', 'sweet', 'brunch'],
      texture: ['fluffy', 'soft', 'light'],
      temperature: ['hot', 'warm'],
      occasion: ['breakfast', 'brunch', 'weekend', 'casual']
    }
  },
  'waffle': {
    name: 'waffle',
    related: ['pancake', 'breakfast', 'sweet', 'syrup', 'brunch', 'crispy'],
    properties: {
      country: ['belgium', 'belgian'],
      ingredients: ['flour', 'egg', 'milk', 'butter', 'sugar', 'syrup', 'baking powder'],
      type: ['breakfast', 'dessert', 'sweet', 'brunch'],
      texture: ['crispy', 'fluffy', 'light'],
      temperature: ['hot', 'warm'],
      occasion: ['breakfast', 'brunch', 'weekend', 'casual']
    }
  },
  'donut': {
    name: 'donut',
    related: ['pastry', 'dessert', 'sweet', 'fried', 'snack', 'treat'],
    properties: {
      country: ['usa', 'american'],
      ingredients: ['flour', 'sugar', 'yeast', 'oil', 'glaze', 'dough', 'sprinkles'],
      type: ['dessert', 'sweet', 'snack', 'fried'],
      texture: ['soft', 'chewy', 'glazed'],
      temperature: ['room temperature'],
      occasion: ['snack', 'breakfast', 'casual', 'treat']
    }
  },
  'icecream': {
    name: 'icecream',
    related: ['dessert', 'frozen', 'sweet', 'cold', 'treat', 'scoop'],
    properties: {
      country: ['italy', 'italian', 'global'],
      ingredients: ['milk', 'cream', 'sugar', 'flavor', 'egg', 'vanilla'],
      type: ['dessert', 'sweet', 'frozen', 'cold'],
      texture: ['creamy', 'smooth', 'rich'],
      temperature: ['cold', 'frozen'],
      occasion: ['dessert', 'snack', 'summer', 'celebration']
    }
  },
  'cupcake': {
    name: 'cupcake',
    related: ['cake', 'dessert', 'sweet', 'baked', 'treat', 'frosting'],
    properties: {
      country: ['usa', 'american', 'england', 'english'],
      ingredients: ['flour', 'sugar', 'butter', 'egg', 'frosting', 'cake', 'vanilla'],
      type: ['dessert', 'sweet', 'baked', 'individual'],
      texture: ['soft', 'moist', 'fluffy'],
      temperature: ['room temperature'],
      occasion: ['party', 'celebration', 'dessert', 'gift']
    }
  }
};
