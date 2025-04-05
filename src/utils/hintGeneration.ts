
import { 
  foodDatabase, 
  animalsDatabase, 
  countriesDatabase, 
  sportsDatabase, 
  moviesDatabase 
} from '../data/semantic';

// Generate hint based on guess history and category
export const generateHint = (
  targetWord: string, 
  categoryId: string, 
  guesses: Array<{ word: string; proximity: number }>
): string => {
  let hint = "";
  
  // Different hint strategies based on category
  switch (categoryId) {
    case 'food':
      if (foodDatabase[targetWord]) {
        const food = foodDatabase[targetWord];
        const randomIndex = Math.floor(Math.random() * 3);
        if (randomIndex === 0 && food.properties.country && food.properties.country.length > 0) {
          hint = `This food is from ${food.properties.country[0].charAt(0).toUpperCase() + food.properties.country[0].slice(1)}.`;
        } else if (randomIndex === 1 && food.properties.ingredients && food.properties.ingredients.length > 0) {
          const randomIngredient = food.properties.ingredients[Math.floor(Math.random() * food.properties.ingredients.length)];
          hint = `This food contains ${randomIngredient}.`;
        } else {
          hint = `This food has ${targetWord.length} letters.`;
        }
      }
      break;
      
    case 'animals':
      if (animalsDatabase[targetWord]) {
        const animal = animalsDatabase[targetWord];
        const randomIndex = Math.floor(Math.random() * 3);
        if (randomIndex === 0 && animal.properties.habitat && animal.properties.habitat.length > 0) {
          hint = `This animal lives in the ${animal.properties.habitat[0]}.`;
        } else if (randomIndex === 1 && animal.properties.species && animal.properties.species.length > 0) {
          hint = `This animal is a ${animal.properties.species[0]}.`;
        } else if (animal.properties.features && animal.properties.features.length > 0) {
          const randomFeature = animal.properties.features[Math.floor(Math.random() * animal.properties.features.length)];
          hint = `This animal is known for its ${randomFeature}.`;
        } else {
          hint = `This animal has ${targetWord.length} letters.`;
        }
      }
      break;
      
    case 'countries':
      if (countriesDatabase[targetWord]) {
        const country = countriesDatabase[targetWord];
        const randomIndex = Math.floor(Math.random() * 3);
        if (randomIndex === 0 && country.properties.region && country.properties.region.length > 0) {
          hint = `This country is in ${country.properties.region[0]}.`;
        } else if (randomIndex === 1 && country.properties.language && country.properties.language.length > 0) {
          hint = `They speak ${country.properties.language[0]} in this country.`;
        } else if (country.properties.features && country.properties.features.length > 0) {
          const randomFeature = country.properties.features[Math.floor(Math.random() * country.properties.features.length)];
          hint = `This country is known for ${randomFeature}.`;
        } else {
          hint = `This country has ${targetWord.length} letters.`;
        }
      }
      break;
      
    case 'sports':
      if (sportsDatabase[targetWord]) {
        const sport = sportsDatabase[targetWord];
        const randomIndex = Math.floor(Math.random() * 3);
        if (randomIndex === 0 && sport.properties.type && sport.properties.type.length > 0) {
          hint = `This is a ${sport.properties.type[0]}.`;
        } else if (randomIndex === 1 && sport.properties.equipment && sport.properties.equipment.length > 0) {
          const randomEquipment = sport.properties.equipment[Math.floor(Math.random() * sport.properties.equipment.length)];
          hint = `This sport uses a ${randomEquipment}.`;
        } else if (sport.properties.features && sport.properties.features.length > 0) {
          const randomFeature = sport.properties.features[Math.floor(Math.random() * sport.properties.features.length)];
          hint = `This sport is known for ${randomFeature}.`;
        } else {
          hint = `This sport has ${targetWord.length} letters.`;
        }
      }
      break;
      
    case 'movies':
      if (moviesDatabase[targetWord]) {
        const movie = moviesDatabase[targetWord];
        const randomIndex = Math.floor(Math.random() * 3);
        if (randomIndex === 0 && movie.properties.genre && movie.properties.genre.length > 0) {
          hint = `This movie is a ${movie.properties.genre[0]}.`;
        } else if (randomIndex === 1 && movie.properties.director && movie.properties.director.length > 0) {
          hint = `This movie was directed by ${movie.properties.director[0]}.`;
        } else if (movie.properties.features && movie.properties.features.length > 0) {
          const randomFeature = movie.properties.features[Math.floor(Math.random() * movie.properties.features.length)];
          hint = `This movie features ${randomFeature}.`;
        } else {
          hint = `This movie has ${targetWord.length} letters.`;
        }
      }
      break;
      
    default:
      hint = `The word has ${targetWord.length} letters.`;
  }
  
  // If no specific category hint was generated, use a letter position hint
  if (!hint) {
    hint = `The word has ${targetWord.length} letters.`;
  }
  
  return hint;
};

// Generate a letter position hint safely (avoids revealing the whole word)
export const generateLetterPositionHint = (targetWord: string): string => {
  // Don't reveal too many letters for short words
  if (targetWord.length <= 5) {
    // For short words, just give the length
    return `The word has ${targetWord.length} letters.`;
  }
  
  // Select a random position, but not the first letter for fairness
  const position = Math.floor(Math.random() * (targetWord.length - 1)) + 1;
  const letter = targetWord[position];
  
  return `The word has ${targetWord.length} letters, and the ${
    position + 1
  }${getOrdinalSuffix(position + 1)} letter is "${letter}".`;
};

// Helper function for ordinal suffixes
export const getOrdinalSuffix = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};
