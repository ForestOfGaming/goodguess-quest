
import { SemanticData, getDatabaseForCategory } from '../data/semanticDatabases';

// Calculate semantic similarity between words
export const calculateSemanticProximity = (guess: string, targetWord: string, categoryId: string): number => {
  // Base similarity score using string comparison
  const stringProximity = calculateStringProximity(guess, targetWord);
  
  // Get semantic database based on category
  const semanticDatabase = getDatabaseForCategory(categoryId);
  
  if (!semanticDatabase) {
    return stringProximity; // Fall back to string comparison for other categories
  }
  
  // Normalize input words
  const normalizedGuess = guess.toLowerCase().trim();
  const normalizedTarget = targetWord.toLowerCase().trim();
  
  // If either word isn't in our database, fall back to string comparison
  if (!semanticDatabase[normalizedGuess] || !semanticDatabase[normalizedTarget]) {
    return stringProximity;
  }
  
  // Get data for both words
  const guessData = semanticDatabase[normalizedGuess];
  const targetData = semanticDatabase[normalizedTarget];
  
  // Calculate semantic similarity based on shared properties
  let semanticScore = 0;
  let totalPossibleScore = 0;
  
  // Check if words are directly related
  if (guessData.related.includes(normalizedTarget) || targetData.related.includes(normalizedGuess)) {
    semanticScore += 30;
  }
  totalPossibleScore += 30;
  
  // Compare properties
  for (const [property, values] of Object.entries(targetData.properties)) {
    if (guessData.properties[property]) {
      const guessValues = guessData.properties[property];
      
      // Count shared property values
      let sharedValues = 0;
      for (const value of values) {
        if (guessValues.includes(value)) {
          sharedValues++;
        }
      }
      
      // Score based on percentage of shared values
      const propertyScore = 20 * (sharedValues / Math.max(values.length, guessValues.length));
      semanticScore += propertyScore;
      totalPossibleScore += 20;
    }
  }
  
  // Combine string and semantic proximity
  const combinedProximity = 0.4 * stringProximity + 0.6 * (semanticScore / totalPossibleScore * 100);
  
  return Math.min(Math.round(combinedProximity), 99); // Cap at 99% unless exact match
};

// Calculate string proximity using Levenshtein distance and other metrics
export const calculateStringProximity = (guess: string, targetWord: string): number => {
  const normalizedGuess = guess.toLowerCase().trim();
  const normalizedTarget = targetWord.toLowerCase().trim();
  
  // Exact match
  if (normalizedGuess === normalizedTarget) {
    return 100;
  }
  
  // Calculate Levenshtein distance
  const levenshtein = levenshteinDistance(normalizedGuess, normalizedTarget);
  
  // Maximum possible distance for normalization
  const maxLength = Math.max(normalizedGuess.length, normalizedTarget.length);
  
  // Normalize distance to a percentage
  const normalizedDistance = (maxLength - levenshtein) / maxLength;
  
  // Convert to proximity percentage
  const proximityPercentage = Math.round(normalizedDistance * 100);
  
  return proximityPercentage;
};

// Calculate Levenshtein distance between strings
export const levenshteinDistance = (str1: string, str2: string): number => {
  const m = str1.length;
  const n = str2.length;
  
  // Create distance matrix
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  // Initialize first row and column
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }
  
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }
  
  // Fill the matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  
  return dp[m][n];
};
