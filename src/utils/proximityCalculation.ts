import { 
  foodDatabase, 
  animalsDatabase, 
  countriesDatabase, 
  sportsDatabase, 
  moviesDatabase, 
  SemanticData 
} from '../data/semantic';
import { supabase } from "../integrations/supabase/client";

// Function to calculate word similarity (basic algorithm as fallback)
export const calculateWordSimilarity = (word1: string, word2: string): number => {
  word1 = word1.toLowerCase();
  word2 = word2.toLowerCase();
  
  // Exact match
  if (word1 === word2) return 100;
  
  // Length-based penalty
  const lengthDiff = Math.abs(word1.length - word2.length);
  const lengthPenalty = Math.min(lengthDiff * 5, 25); // Reduced from 30 to 25
  
  // Character-based similarity
  let commonChars = 0;
  const word1Chars = [...word1];
  const word2Chars = [...word2];
  
  for (const char of word1Chars) {
    const index = word2Chars.indexOf(char);
    if (index !== -1) {
      commonChars++;
      word2Chars.splice(index, 1); // Remove the character so it's not counted twice
    }
  }
  
  const charSimilarity = (commonChars / Math.max(word1.length, word2.length)) * 100;
  
  // Common prefix and suffix bonuses
  let prefixBonus = 0;
  let suffixBonus = 0;
  
  const minLength = Math.min(word1.length, word2.length);
  
  // Prefix check
  for (let i = 0; i < minLength; i++) {
    if (word1[i] === word2[i]) {
      prefixBonus += 2;
    } else {
      break;
    }
  }
  
  // Suffix check
  for (let i = 1; i <= minLength; i++) {
    if (word1[word1.length - i] === word2[word2.length - i]) {
      suffixBonus += 2;
    } else {
      break;
    }
  }
  
  prefixBonus = Math.min(prefixBonus, 20);
  suffixBonus = Math.min(suffixBonus, 15);
  
  // Calculate final similarity with a base minimum of 5 for any comparison
  let similarity = Math.max(5, charSimilarity - lengthPenalty + prefixBonus + suffixBonus);
  
  // First letter match bonus (small bonus)
  if (word1.charAt(0) === word2.charAt(0)) {
    similarity += 5;
  }
  
  // Last letter match bonus (small bonus)
  if (word1.charAt(word1.length - 1) === word2.charAt(word2.length - 1)) {
    similarity += 3;
  }
  
  // Ensure the value is within 0-100 range
  similarity = Math.max(0, Math.min(similarity, 100));
  
  return Math.round(similarity);
};

// Calculate semantic similarity using AI when possible, with fallback to algorithmic approach
export const calculateSemanticSimilarity = async (guess: string, targetWord: string, categoryId: string): Promise<number> => {
  const normalizedGuess = guess.toLowerCase();
  const normalizedTarget = targetWord.toLowerCase();
  
  // If the words are identical, return 100% immediately
  if (normalizedGuess === normalizedTarget) return 100;
  
  try {
    // Try to use the OpenAI API via our edge function
    const { data, error } = await supabase.functions.invoke('calculate-similarity', {
      body: { 
        guess: normalizedGuess, 
        target: normalizedTarget, 
        category: categoryId 
      }
    });

    // If we got a valid proximity score from OpenAI, use it
    if (!error && data && data.proximity !== null && data.proximity !== undefined) {
      console.log(`AI-calculated proximity: ${data.proximity}`);
      return data.proximity;
    }

    // If API call failed, log and fall back to algorithmic calculation
    if (error) {
      console.warn('Error calling AI for similarity:', error.message);
    } else {
      console.warn('AI returned invalid proximity:', data);
    }
  } catch (e) {
    console.error('Exception during AI similarity calculation:', e);
  }

  // Fallback to algorithmic calculation
  console.log('Falling back to algorithmic calculation');
  return fallbackCalculateSemanticSimilarity(normalizedGuess, normalizedTarget, categoryId);
};

// The original algorithmic calculation, now as a fallback
const fallbackCalculateSemanticSimilarity = (guess: string, target: string, categoryId: string): number => {
  // Base similarity from word comparison
  let similarity = calculateWordSimilarity(guess, target);
  
  // Category-specific semantic relationships
  switch (categoryId) {
    case 'food':
      similarity = calculateFoodSimilarity(guess, target, similarity);
      break;
    case 'animals':
      similarity = calculateAnimalSimilarity(guess, target, similarity);
      break;
    case 'countries':
      similarity = calculateCountrySimilarity(guess, target, similarity);
      break;
    case 'sports':
      similarity = calculateSportSimilarity(guess, target, similarity);
      break;
    case 'movies':
      similarity = calculateMovieSimilarity(guess, target, similarity);
      break;
  }
  
  // Apply a small base minimum to semantic similarity as well
  similarity = Math.max(3, similarity);
  
  // Ensure the value is within 0-100 range
  similarity = Math.max(0, Math.min(similarity, 100));
  
  return Math.round(similarity);
};

// Calculate food similarity using food database
const calculateFoodSimilarity = (guess: string, target: string, baseSimilarity: number): number => {
  const guessFood = foodDatabase[guess];
  const targetFood = foodDatabase[target];
  
  if (!guessFood || !targetFood) return baseSimilarity;
  
  let bonusPoints = 0;
  
  // Check for related terms
  if (guessFood.related.some(term => targetFood.related.includes(term))) {
    bonusPoints += 15;
  } else {
    // Small bonus just for being in the same category
    bonusPoints += 5;
  }
  
  // Check for country match
  if (guessFood.properties.country?.some(country => 
    targetFood.properties.country?.includes(country))) {
    bonusPoints += 20;
  }
  
  // Check for ingredient matches
  const guessIngredients = guessFood.properties.ingredients || [];
  const targetIngredients = targetFood.properties.ingredients || [];
  let commonIngredients = 0;
  
  for (const ingredient of guessIngredients) {
    if (targetIngredients.includes(ingredient)) {
      commonIngredients++;
    }
  }
  
  if (commonIngredients > 0) {
    const ingredientMatchPercentage = (commonIngredients / targetIngredients.length) * 100;
    bonusPoints += Math.min(ingredientMatchPercentage, 25);
  }
  
  return Math.min(baseSimilarity + bonusPoints, 100);
};

// Calculate animal similarity using animals database
const calculateAnimalSimilarity = (guess: string, target: string, baseSimilarity: number): number => {
  const guessAnimal = animalsDatabase[guess];
  const targetAnimal = animalsDatabase[target];
  
  if (!guessAnimal || !targetAnimal) return baseSimilarity;
  
  let bonusPoints = 0;
  
  // Check for related terms
  if (guessAnimal.related.some(term => targetAnimal.related.includes(term))) {
    bonusPoints += 15;
  } else {
    // Small bonus just for being in the same category
    bonusPoints += 5;
  }
  
  // Check for species match
  if (guessAnimal.properties.species?.some(species => 
    targetAnimal.properties.species?.includes(species))) {
    bonusPoints += 20;
  }
  
  // Check for habitat matches
  const guessHabitats = guessAnimal.properties.habitat || [];
  const targetHabitats = targetAnimal.properties.habitat || [];
  let commonHabitats = 0;
  
  for (const habitat of guessHabitats) {
    if (targetHabitats.includes(habitat)) {
      commonHabitats++;
    }
  }
  
  if (commonHabitats > 0) {
    const habitatMatchPercentage = (commonHabitats / targetHabitats.length) * 100;
    bonusPoints += Math.min(habitatMatchPercentage, 20);
  }
  
  // Check for feature matches
  const guessFeatures = guessAnimal.properties.features || [];
  const targetFeatures = targetAnimal.properties.features || [];
  let commonFeatures = 0;
  
  for (const feature of guessFeatures) {
    if (targetFeatures.includes(feature)) {
      commonFeatures++;
    }
  }
  
  if (commonFeatures > 0) {
    const featureMatchPercentage = (commonFeatures / targetFeatures.length) * 100;
    bonusPoints += Math.min(featureMatchPercentage, 20);
  }
  
  return Math.min(baseSimilarity + bonusPoints, 100);
};

// Calculate country similarity using countries database
const calculateCountrySimilarity = (guess: string, target: string, baseSimilarity: number): number => {
  const guessCountry = countriesDatabase[guess];
  const targetCountry = countriesDatabase[target];
  
  if (!guessCountry || !targetCountry) return baseSimilarity;
  
  let bonusPoints = 0;
  
  // Check for related terms
  if (guessCountry.related.some(term => targetCountry.related.includes(term))) {
    bonusPoints += 15;
  } else {
    // Small bonus just for being in the same category
    bonusPoints += 5;
  }
  
  // Check for region match
  if (guessCountry.properties.region?.some(region => 
    targetCountry.properties.region?.includes(region))) {
    bonusPoints += 25;
  }
  
  // Check for language matches
  const guessLanguages = guessCountry.properties.language || [];
  const targetLanguages = targetCountry.properties.language || [];
  let commonLanguages = 0;
  
  for (const language of guessLanguages) {
    if (targetLanguages.includes(language)) {
      commonLanguages++;
    }
  }
  
  if (commonLanguages > 0) {
    const languageMatchPercentage = (commonLanguages / targetLanguages.length) * 100;
    bonusPoints += Math.min(languageMatchPercentage, 20);
  }
  
  // Check for feature matches
  const guessFeatures = guessCountry.properties.features || [];
  const targetFeatures = targetCountry.properties.features || [];
  let commonFeatures = 0;
  
  for (const feature of guessFeatures) {
    if (targetFeatures.includes(feature)) {
      commonFeatures++;
    }
  }
  
  if (commonFeatures > 0) {
    const featureMatchPercentage = (commonFeatures / targetFeatures.length) * 100;
    bonusPoints += Math.min(featureMatchPercentage, 15);
  }
  
  return Math.min(baseSimilarity + bonusPoints, 100);
};

// Calculate sport similarity using sports database
const calculateSportSimilarity = (guess: string, target: string, baseSimilarity: number): number => {
  const guessSport = sportsDatabase[guess];
  const targetSport = sportsDatabase[target];
  
  if (!guessSport || !targetSport) return baseSimilarity;
  
  let bonusPoints = 0;
  
  // Check for related terms
  if (guessSport.related.some(term => targetSport.related.includes(term))) {
    bonusPoints += 15;
  } else {
    // Small bonus just for being in the same category
    bonusPoints += 5;
  }
  
  // Check for type match
  if (guessSport.properties.type?.some(type => 
    targetSport.properties.type?.includes(type))) {
    bonusPoints += 25;
  }
  
  // Check for equipment matches
  const guessEquipment = guessSport.properties.equipment || [];
  const targetEquipment = targetSport.properties.equipment || [];
  let commonEquipment = 0;
  
  for (const item of guessEquipment) {
    if (targetEquipment.includes(item)) {
      commonEquipment++;
    }
  }
  
  if (commonEquipment > 0) {
    const equipmentMatchPercentage = (commonEquipment / targetEquipment.length) * 100;
    bonusPoints += Math.min(equipmentMatchPercentage, 20);
  }
  
  // Check for feature matches
  const guessFeatures = guessSport.properties.features || [];
  const targetFeatures = targetSport.properties.features || [];
  let commonFeatures = 0;
  
  for (const feature of guessFeatures) {
    if (targetFeatures.includes(feature)) {
      commonFeatures++;
    }
  }
  
  if (commonFeatures > 0) {
    const featureMatchPercentage = (commonFeatures / targetFeatures.length) * 100;
    bonusPoints += Math.min(featureMatchPercentage, 15);
  }
  
  return Math.min(baseSimilarity + bonusPoints, 100);
};

// Calculate movie similarity using movies database
const calculateMovieSimilarity = (guess: string, target: string, baseSimilarity: number): number => {
  const guessMovie = moviesDatabase[guess];
  const targetMovie = moviesDatabase[target];
  
  if (!guessMovie || !targetMovie) return baseSimilarity;
  
  let bonusPoints = 0;
  
  // Check for related terms
  if (guessMovie.related.some(term => targetMovie.related.includes(term))) {
    bonusPoints += 15;
  } else {
    // Small bonus just for being in the same category
    bonusPoints += 5;
  }
  
  // Check for genre match
  if (guessMovie.properties.genre?.some(genre => 
    targetMovie.properties.genre?.includes(genre))) {
    bonusPoints += 25;
  }
  
  // Check for director matches
  const guessDirectors = guessMovie.properties.director || [];
  const targetDirectors = targetMovie.properties.director || [];
  let commonDirectors = 0;
  
  for (const director of guessDirectors) {
    if (targetDirectors.includes(director)) {
      commonDirectors++;
    }
  }
  
  if (commonDirectors > 0) {
    bonusPoints += 30;
  }
  
  // Check for feature matches
  const guessFeatures = guessMovie.properties.features || [];
  const targetFeatures = targetMovie.properties.features || [];
  let commonFeatures = 0;
  
  for (const feature of guessFeatures) {
    if (targetFeatures.includes(feature)) {
      commonFeatures++;
    }
  }
  
  if (commonFeatures > 0) {
    const featureMatchPercentage = (commonFeatures / targetFeatures.length) * 100;
    bonusPoints += Math.min(featureMatchPercentage, 20);
  }
  
  return Math.min(baseSimilarity + bonusPoints, 100);
};
