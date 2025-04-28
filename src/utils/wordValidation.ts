
// Word validation that properly handles words of all lengths
import { categoryWords } from '../data/semantic/wordLists';

// Create a Set of all valid words from all categories for faster lookup
const allGameWords = new Set<string>();

// Populate the set with all words from all categories
for (const category in categoryWords) {
  categoryWords[category].forEach(word => {
    allGameWords.add(word.toLowerCase());
  });
}

export const isValidWord = (word: string): boolean => {
  if (!word || word.trim() === '') return false;
  
  // Allow multi-word terms (e.g. "New York", "Ice Cream")
  const normalizedWord = word.trim().toLowerCase();
  
  // Check each word segment for validity
  const wordSegments = normalizedWord.split(' ');
  
  for (const segment of wordSegments) {
    // Each segment should contain only letters
    if (!/^[a-z]+$/.test(segment)) {
      return false;
    }
    
    // Reject very short words (less than 3 letters) unless they're in our whitelist
    if (segment.length < 3) {
      const validShortWords = [
        'am', 'an', 'as', 'at', 'be', 'by', 'do', 'go', 'he', 'hi', 'if', 'in', 
        'is', 'it', 'me', 'my', 'no', 'of', 'on', 'or', 'so', 'to', 'up', 'us', 
        'we', 'ox', 'ax', 'pi', 'mu', 'nu', 'xi', 'yo', 'ad', 'ah', 'ai', 'al',
        'ar', 'aw', 'ax', 'ay', 'eh', 'el', 'em', 'en', 'er', 'es', 'et', 'ex',
        'go', 'ha', 'he', 'hi', 'hm', 'ho', 'id', 'if', 'in', 'is', 'it', 'lo',
        'la', 'li', 'lo', 'ma', 'me', 'mi', 'mm', 'mo', 'mu', 'my', 'na', 'ne',
        'no', 'nu', 'od', 'oe', 'of', 'oh', 'oi', 'ok', 'om', 'on', 'op', 'or',
        'os', 'ow', 'ox', 'oy', 'pa', 'pe', 'pi', 'qi', 're', 'sh', 'si', 'so',
        'ta', 'ti', 'to', 'uh', 'um', 'un', 'up', 'us', 'ut', 'we', 'wo', 'xi',
        'xu', 'ya', 'ye', 'yo', 'za', 'a', 'i', 'o', 'jo', 'ju' // Include single letters that are valid words
      ];
      
      if (!validShortWords.includes(segment)) {
        return false;
      }
    }
    
    // Basic length check (most real words aren't extremely long)
    if (normalizedWord.length > 25) {
      return false;
    }
  }
  
  return true;
}

// Check if a word is in our game dictionary
export const isInGameDictionary = (word: string): boolean => {
  const normalizedWord = word.trim().toLowerCase();
  return allGameWords.has(normalizedWord);
}

// Function to check if a word exists using the OpenAI API
export const checkWordWithAI = async (word: string): Promise<boolean> => {
  try {
    // First check if the word is in our game dictionary - if so, it's valid (fast path)
    const normalizedWord = word.trim().toLowerCase();
    if (isInGameDictionary(normalizedWord)) {
      console.log(`Word "${normalizedWord}" found in dictionary, skipping AI validation`);
      return true; // Skip API call for words in our game dictionary
    }
    
    const { supabase } = await import('../integrations/supabase/client');
    
    const { data, error } = await supabase.functions.invoke('calculate-similarity', {
      body: {
        guess: word,
        action: 'validate'
      }
    });
    
    if (error) {
      console.error('Error validating word with AI:', error);
      return true; // Default to true if there's an error with the API
    }
    
    return data?.isValid !== false; // Default to true unless explicitly false
  } catch (error) {
    console.error('Error checking word with API:', error);
    return true; // Default to true if there's an error
  }
}
