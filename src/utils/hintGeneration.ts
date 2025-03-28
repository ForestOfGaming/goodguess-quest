
import { getDatabaseForCategory } from '../data/semanticDatabases';

// Generate a hint based on the target word and category
export const generateHint = (targetWord: string, categoryId: string): string => {
  const normalizedTarget = targetWord.toLowerCase().trim();
  
  // Get database based on category
  const semanticDatabase = getDatabaseForCategory(categoryId);
  
  if (!semanticDatabase) {
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
export const getRandomWord = (categoryId: string): string => {
  const semanticDatabase = getDatabaseForCategory(categoryId);
  
  if (semanticDatabase) {
    const words = Object.keys(semanticDatabase);
    return words[Math.floor(Math.random() * words.length)];
  }
  
  // Hardcoded words for categories without semantic databases
  const wordLists: Record<string, string[]> = {
    'celebrities': ['beyonce', 'einstein', 'shakespeare', 'madonna', 'picasso'],
    'technology': ['computer', 'smartphone', 'internet', 'robot', 'satellite'],
    'music': ['piano', 'guitar', 'orchestra', 'concert', 'symphony'],
    'nature': ['mountain', 'forest', 'river', 'ocean', 'desert'],
    'vehicles': ['car', 'airplane', 'bicycle', 'submarine', 'helicopter'],
    'professions': ['doctor', 'teacher', 'engineer', 'chef', 'astronaut'],
    'fruits': ['apple', 'banana', 'orange', 'strawberry', 'watermelon']
  };
  
  if (wordLists[categoryId]) {
    return wordLists[categoryId][Math.floor(Math.random() * wordLists[categoryId].length)];
  }
  
  return 'default'; // Fallback word
};
