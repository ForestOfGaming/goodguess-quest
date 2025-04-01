
// Simple word validation that focuses on filtering out non-words
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
    
    // Filter out keyboard mashing patterns
    if (/^([qwert]+|[asdfg]+|[zxcvb]+|[yuiop]+|[hjkl]+|[nm]+)$/.test(segment)) {
      return false;
    }
    
    // Filter out repetitive character sequences (like "aaaa", "bbbb")
    if (/^(.)\1{3,}$/.test(segment)) {
      return false;
    }
  }
  
  // Basic length check (most real words aren't extremely long)
  if (normalizedWord.length > 30) {
    return false;
  }
  
  return true;
};
