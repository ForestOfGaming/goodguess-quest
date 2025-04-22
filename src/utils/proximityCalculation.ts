import { 
  foodDatabase, 
  animalsDatabase, 
  countriesDatabase, 
  sportsDatabase, 
  moviesDatabase, 
  SemanticData 
} from '../data/semantic';

// Function to calculate word similarity with reduced weight
export const calculateWordSimilarity = (word1: string, word2: string): number => {
  word1 = word1.toLowerCase();
  word2 = word2.toLowerCase();
  
  // Exact match
  if (word1 === word2) return 100;
  
  // Length-based penalty (reduced weight)
  const lengthDiff = Math.abs(word1.length - word2.length);
  const lengthPenalty = Math.min(lengthDiff * 2, 10); // Reduced from 25 to 10
  
  // Character-based similarity (reduced weight)
  let commonChars = 0;
  const word1Chars = [...word1];
  const word2Chars = [...word2];
  
  for (const char of word1Chars) {
    const index = word2Chars.indexOf(char);
    if (index !== -1) {
      commonChars++;
      word2Chars.splice(index, 1);
    }
  }
  
  const charSimilarity = (commonChars / Math.max(word1.length, word2.length)) * 50; // Reduced from 100 to 50
  
  // Common prefix and suffix bonuses (reduced)
  let prefixBonus = 0;
  let suffixBonus = 0;
  
  const minLength = Math.min(word1.length, word2.length);
  
  // Prefix check (reduced weight)
  for (let i = 0; i < minLength; i++) {
    if (word1[i] === word2[i]) {
      prefixBonus += 1; // Reduced from 2
    } else {
      break;
    }
  }
  
  // Suffix check (reduced weight)
  for (let i = 1; i <= minLength; i++) {
    if (word1[word1.length - i] === word2[word2.length - i]) {
      suffixBonus += 1; // Reduced from 2
    } else {
      break;
    }
  }
  
  prefixBonus = Math.min(prefixBonus, 10); // Reduced from 20
  suffixBonus = Math.min(suffixBonus, 5); // Reduced from 15
  
  let similarity = Math.max(5, charSimilarity - lengthPenalty + prefixBonus + suffixBonus);
  
  // First and last letter match bonuses (reduced)
  if (word1.charAt(0) === word2.charAt(0)) {
    similarity += 2; // Reduced from 5
  }
  
  if (word1.charAt(word1.length - 1) === word2.charAt(word2.length - 1)) {
    similarity += 1; // Reduced from 3
  }
  
  return Math.min(similarity, 100);
};

// Calculate semantic similarity based on category
export const calculateSemanticSimilarity = (guess: string, targetWord: string, categoryId: string): number => {
  const normalizedGuess = guess.toLowerCase();
  const normalizedTarget = targetWord.toLowerCase();
  
  // Base similarity from word comparison
  let similarity = calculateWordSimilarity(normalizedGuess, normalizedTarget);
  
  // Category-specific semantic relationships
  switch (categoryId) {
    case 'food':
      similarity = calculateFoodSimilarity(normalizedGuess, normalizedTarget, similarity);
      break;
    case 'animals':
      similarity = calculateAnimalSimilarity(normalizedGuess, normalizedTarget, similarity);
      break;
    case 'countries':
      similarity = calculateCountrySimilarity(normalizedGuess, normalizedTarget, similarity);
      break;
    case 'sports':
      similarity = calculateSportSimilarity(normalizedGuess, normalizedTarget, similarity);
      break;
    case 'movies':
      similarity = calculateMovieSimilarity(normalizedGuess, normalizedTarget, similarity);
      break;
  }
  
  // Apply a small base minimum to semantic similarity as well
  similarity = Math.max(3, similarity);
  
  // Ensure the value is within 0-100 range
  similarity = Math.max(0, Math.min(similarity, 100));
  
  return Math.round(similarity);
};

// Update the similarity calculation functions to consider the new properties
const calculateCountrySimilarity = (guess: string, target: string, baseSimilarity: number): number => {
  const guessCountry = countriesDatabase[guess];
  const targetCountry = countriesDatabase[target];
  
  if (!guessCountry || !targetCountry) return baseSimilarity;
  
  let bonusPoints = 0;
  
  // Region match (high weight)
  if (guessCountry.properties.region?.some(region => 
    targetCountry.properties.region?.includes(region))) {
    bonusPoints += 40;
  }
  
  // Geography match
  const guessGeography = guessCountry.properties.geography || [];
  const targetGeography = targetCountry.properties.geography || [];
  const commonGeography = guessGeography.filter(g => targetGeography.includes(g));
  if (commonGeography.length > 0) {
    bonusPoints += Math.min(commonGeography.length * 10, 30);
  }
  
  // Climate match
  const guessClimate = guessCountry.properties.climate || [];
  const targetClimate = targetCountry.properties.climate || [];
  const commonClimate = guessClimate.filter(c => targetClimate.includes(c));
  if (commonClimate.length > 0) {
    bonusPoints += Math.min(commonClimate.length * 8, 25);
  }
  
  // Culture match
  const guessCulture = guessCountry.properties.culture || [];
  const targetCulture = targetCountry.properties.culture || [];
  const commonCulture = guessCulture.filter(c => targetCulture.includes(c));
  if (commonCulture.length > 0) {
    bonusPoints += Math.min(commonCulture.length * 5, 20);
  }
  
  // Economy match
  if (guessCountry.properties.economy?.some(e => 
    targetCountry.properties.economy?.includes(e))) {
    bonusPoints += 15;
  }
  
  // Related terms match (moderate weight)
  const commonRelated = guessCountry.related.filter(term => 
    targetCountry.related.includes(term));
  bonusPoints += Math.min(commonRelated.length * 5, 20);
  
  // Calculate final similarity
  let finalSimilarity = (baseSimilarity * 0.2) + bonusPoints; // Base similarity only counts for 20%
  
  return Math.min(finalSimilarity, 100);
};

// Similar updates for other category calculation functions
const calculateFoodSimilarity = (guess: string, target: string, baseSimilarity: number): number => {
  const guessFood = foodDatabase[guess];
  const targetFood = foodDatabase[target];
  
  if (!guessFood || !targetFood) return baseSimilarity;
  
  let bonusPoints = 0;
  
  // Ingredient matches (high weight)
  const commonIngredients = guessFood.properties.ingredients?.filter(i => 
    targetFood.properties.ingredients?.includes(i)) || [];
  bonusPoints += Math.min(commonIngredients.length * 10, 40);
  
  // Type matches
  if (guessFood.properties.type?.some(t => 
    targetFood.properties.type?.includes(t))) {
    bonusPoints += 30;
  }
  
  // Texture matches
  if (guessFood.properties.texture?.some(t => 
    targetFood.properties.texture?.includes(t))) {
    bonusPoints += 20;
  }
  
  // Temperature matches
  if (guessFood.properties.temperature?.some(t => 
    targetFood.properties.temperature?.includes(t))) {
    bonusPoints += 15;
  }
  
  // Occasion matches
  if (guessFood.properties.occasion?.some(o => 
    targetFood.properties.occasion?.includes(o))) {
    bonusPoints += 15;
  }
  
  // Related terms
  const commonRelated = guessFood.related.filter(term => 
    targetFood.related.includes(term));
  bonusPoints += Math.min(commonRelated.length * 5, 20);
  
  let finalSimilarity = (baseSimilarity * 0.2) + bonusPoints;
  
  return Math.min(finalSimilarity, 100);
};

// Update animal similarity calculation to prioritize species and habitat
const calculateAnimalSimilarity = (guess: string, target: string, baseSimilarity: number): number => {
  const guessAnimal = animalsDatabase[guess];
  const targetAnimal = animalsDatabase[target];
  
  if (!guessAnimal || !targetAnimal) return baseSimilarity;
  
  let bonusPoints = 0;
  
    // Species match (increased weight)
  if (guessAnimal.properties.species?.some(species => 
    targetAnimal.properties.species?.includes(species))) {
    bonusPoints += 40; // Increased from 20
  }
  
  // Habitat matches (increased weight)
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
    bonusPoints += Math.min(habitatMatchPercentage, 35); // Increased from 20
  }
  
    // Check for related terms (increased weight)
  if (guessAnimal.related.some(term => targetAnimal.related.includes(term))) {
    bonusPoints += 30; // Increased from 15
  }
  
    // Feature matches (slightly reduced weight)
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
    bonusPoints += Math.min(featureMatchPercentage, 15); // Reduced from 20
  }

  // Calculate final similarity with reduced base similarity weight
  let finalSimilarity = (baseSimilarity * 0.3) + bonusPoints; // Base similarity only counts for 30%
  
  return Math.min(finalSimilarity, 100);
};

// Update sport similarity calculation to prioritize type and equipment
const calculateSportSimilarity = (guess: string, target: string, baseSimilarity: number): number => {
  const guessSport = sportsDatabase[guess];
  const targetSport = sportsDatabase[target];
  
  if (!guessSport || !targetSport) return baseSimilarity;
  
  let bonusPoints = 0;
  
    // Check for type match (increased weight)
  if (guessSport.properties.type?.some(type => 
    targetSport.properties.type?.includes(type))) {
    bonusPoints += 40; // Increased from 25
  }
  
  // Check for equipment matches (increased weight)
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
    bonusPoints += Math.min(equipmentMatchPercentage, 35); // Increased from 20
  }
  
    // Check for related terms (increased weight)
  if (guessSport.related.some(term => targetSport.related.includes(term))) {
    bonusPoints += 30; // Increased from 15
  }
  
    // Feature matches (reduced weight)
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
    bonusPoints += Math.min(featureMatchPercentage, 15); // Reduced from 15
  }

  // Calculate final similarity with reduced base similarity weight
  let finalSimilarity = (baseSimilarity * 0.3) + bonusPoints; // Base similarity only counts for 30%
  
  return Math.min(finalSimilarity, 100);
};

// Update movie similarity calculation to prioritize genre and director
const calculateMovieSimilarity = (guess: string, target: string, baseSimilarity: number): number => {
  const guessMovie = moviesDatabase[guess];
  const targetMovie = moviesDatabase[target];
  
  if (!guessMovie || !targetMovie) return baseSimilarity;
  
  let bonusPoints = 0;
  
    // Check for genre match (increased weight)
  if (guessMovie.properties.genre?.some(genre => 
    targetMovie.properties.genre?.includes(genre))) {
    bonusPoints += 40; // Increased from 25
  }
  
  // Check for director matches (increased weight)
  const guessDirectors = guessMovie.properties.director || [];
  const targetDirectors = targetMovie.properties.director || [];
  let commonDirectors = 0;
  
  for (const director of guessDirectors) {
    if (targetDirectors.includes(director)) {
      commonDirectors++;
    }
  }
  
  if (commonDirectors > 0) {
    bonusPoints += 35; // Increased from 30
  }
  
    // Check for related terms (increased weight)
  if (guessMovie.related.some(term => targetMovie.related.includes(term))) {
    bonusPoints += 30; // Increased from 15
  }
  
    // Feature matches (reduced weight)
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
    bonusPoints += Math.min(featureMatchPercentage, 15); // Reduced from 20
  }

  // Calculate final similarity with reduced base similarity weight
  let finalSimilarity = (baseSimilarity * 0.3) + bonusPoints; // Base similarity only counts for 30%
  
  return Math.min(finalSimilarity, 100);
};
