
// Word validation that properly handles words of all lengths
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
    
    // Short words (2 letters) need to be real words
    if (segment.length === 2) {
      const validTwoLetterWords = [
        'am', 'an', 'as', 'at', 'be', 'by', 'do', 'go', 'he', 'hi', 'if', 'in', 
        'is', 'it', 'me', 'my', 'no', 'of', 'on', 'or', 'so', 'to', 'up', 'us', 
        'we', 'ox', 'ax', 'pi', 'mu', 'nu', 'xi', 'yo'
      ];
      
      if (!validTwoLetterWords.includes(segment)) {
        return false;
      }
    }
    
    // Filter out keyboard mashing patterns
    if (/^([qwert]+|[asdfg]+|[zxcvb]+|[yuiop]+|[hjkl]+|[nm]+)$/.test(segment)) {
      return false;
    }
    
    // Filter out repetitive character sequences (like "aaaa", "bbbb")
    if (/^(.)\1{2,}$/.test(segment)) {
      return false;
    }
  }
  
  // Basic length check (most real words aren't extremely long)
  if (normalizedWord.length > 30) {
    return false;
  }
  
  return true;
};
