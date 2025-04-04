
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
    
    // Reject any word containing the letter 'j'
    if (segment.includes('j')) {
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
        'xu', 'ya', 'ye', 'yo', 'za', 'a', 'i', 'o' // Include single letters that are valid words
      ];
      
      if (!validShortWords.includes(segment)) {
        return false;
      }
    }
    
    // Filter out keyboard mashing patterns
    if (/^([qwert]+|[asdfg]+|[zxcvb]+|[yuiop]+|[hjkl]+|[nm]+)$/.test(segment)) {
      return false;
    }
    
    // Filter out repetitive character sequences (like "aaaa", "bbbb")
    if (/(.)\1{2,}/.test(segment)) {
      return false;
    }
    
    // Filter out words with too many consecutive consonants
    const consonantPattern = /[bcdfghjklmnpqrstvwxyz]{4,}/;
    if (consonantPattern.test(segment)) {
      return false;
    }
    
    // Filter out words with too many consecutive vowels
    const vowelPattern = /[aeiou]{4,}/;
    if (vowelPattern.test(segment)) {
      return false;
    }
    
    // Filter out obviously non-existent words (like "qxz", "jzx", etc.)
    if (/[qxz]{2,}/.test(segment) || 
        /[^aeiouy]{5,}/.test(segment) || // 5+ consonants in a row is unlikely
        /q[^u]/.test(segment)) {  // q is almost always followed by u in English
      return false;
    }
    
    // Reject words with unusual consonant clusters
    const unusualClusters = [
      'bkb', 'bgb', 'bsb', 'czj', 'dfb', 'dtg', 'fgb', 'fkf', 'gkb', 'hzj', 'jfj', 'jvj', 
      'kgk', 'lzx', 'mzx', 'pzp', 'qkq', 'tgb', 'vkv', 'wzx', 'xzx', 'zxc', 'vxt', 'kzs',
      'mfp', 'bfg', 'qsd', 'wsx', 'kpt', 'ngl', 'fvl', 'qwt'
    ];
    
    for (const cluster of unusualClusters) {
      if (segment.includes(cluster)) {
        return false;
      }
    }
    
    // Reject words that don't have enough vowels (every real word typically has vowels)
    const vowels = segment.match(/[aeiou]/g);
    if (!vowels && segment.length > 2 && !['cry', 'fly', 'try', 'shy', 'why', 'dry', 'rhythm', 'myth'].includes(segment)) {
      return false;
    }
    
    // For longer words, ensure they have a reasonable vowel-to-consonant ratio
    if (segment.length > 5) {
      const vowelCount = vowels ? vowels.length : 0;
      const consonantCount = segment.length - vowelCount;
      
      // Most English words have a somewhat balanced vowel-to-consonant ratio
      if (vowelCount < 1 || consonantCount / vowelCount > 5) {
        return false;
      }
    }
  }
  
  // Basic length check (most real words aren't extremely long)
  if (normalizedWord.length > 25) {
    return false;
  }
  
  return true;
};
