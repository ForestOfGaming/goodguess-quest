
/**
 * Validates if a string is a real word
 */
export const isValidWord = (word: string): boolean => {
  if (!word || word.trim() === '') return false;
  
  // Allow multi-word terms (e.g. "New York", "Ice Cream")
  const normalizedWord = word.trim().toLowerCase();
  
  // Check each word segment for validity
  const wordSegments = normalizedWord.split(' ');
  
  for (const segment of wordSegments) {
    // Each segment should be at least 2 characters and contain only letters
    if (segment.length < 2 || !/^[a-z]+$/.test(segment)) {
      return false;
    }
    
    // Special validation for short words (2-3 letters)
    if (segment.length <= 3) {
      // Common valid 2-letter words
      const validTwoLetterWords = [
        'am', 'an', 'as', 'at', 'be', 'by', 'do', 'go', 'he', 'hi', 'if', 'in', 
        'is', 'it', 'me', 'my', 'no', 'of', 'on', 'or', 'so', 'to', 'up', 'us', 
        'we', 'ox', 'ax'
      ];
      
      // Common valid 3-letter words
      const validThreeLetterWords = [
        'act', 'add', 'age', 'ago', 'aid', 'aim', 'air', 'all', 'and', 'any', 'arm',
        'art', 'ask', 'ate', 'bad', 'bag', 'ban', 'bar', 'bat', 'bay', 'bed', 'bee',
        'beg', 'bet', 'bid', 'big', 'bit', 'bog', 'boy', 'bud', 'bug', 'bun', 'bus',
        'but', 'buy', 'can', 'cap', 'car', 'cat', 'cow', 'cry', 'cup', 'cut', 'dad',
        'day', 'did', 'die', 'dig', 'dim', 'dip', 'dog', 'dot', 'dry', 'due', 'dug',
        'ear', 'eat', 'egg', 'end', 'eye', 'fan', 'far', 'fat', 'fee', 'few', 'fig',
        'fit', 'fix', 'fly', 'fog', 'for', 'fox', 'fun', 'fur', 'gap', 'gas', 'get',
        'got', 'gum', 'gun', 'gut', 'guy', 'gym', 'had', 'ham', 'has', 'hat', 'hay',
        'hen', 'her', 'hey', 'hid', 'him', 'hip', 'his', 'hit', 'hog', 'hot', 'how',
        'hub', 'hug', 'hut', 'ice', 'ill', 'ink', 'inn', 'jam', 'jar', 'jaw', 'jet',
        'job', 'jog', 'joy', 'key', 'kid', 'kit', 'lab', 'lac', 'lap', 'law', 'lay',
        'led', 'leg', 'let', 'lid', 'lie', 'lip', 'lit', 'log', 'lot', 'low', 'mad',
        'man', 'map', 'mat', 'may', 'men', 'met', 'mix', 'mob', 'mom', 'mop', 'mud',
        'mug', 'nap', 'net', 'new', 'nod', 'not', 'now', 'nun', 'nut', 'off', 'oil',
        'old', 'one', 'our', 'out', 'owe', 'owl', 'own', 'pad', 'pan', 'paw', 'pay',
        'pea', 'pen', 'pet', 'pie', 'pig', 'pin', 'pit', 'pop', 'pot', 'pry', 'pub',
        'put', 'rag', 'ran', 'rat', 'raw', 'ray', 'red', 'rib', 'rid', 'rim', 'rip',
        'rob', 'rod', 'rot', 'row', 'rub', 'rug', 'run', 'sad', 'sat', 'saw', 'say',
        'sea', 'see', 'set', 'sew', 'she', 'shy', 'sip', 'sir', 'sit', 'six', 'ski',
        'sky', 'sly', 'son', 'spy', 'sum', 'sun', 'tag', 'tan', 'tap', 'tax', 'tea',
        'ten', 'the', 'tie', 'tin', 'tip', 'toe', 'top', 'toy', 'try', 'tub', 'two',
        'use', 'van', 'vat', 'vet', 'vie', 'war', 'was', 'wax', 'way', 'web', 'wed',
        'wet', 'who', 'why', 'wig', 'win', 'wit', 'won', 'wry', 'yes', 'yet', 'you',
        'yum', 'zip', 'zoo'
      ];
      
      if (segment.length === 2 && !validTwoLetterWords.includes(segment)) {
        return false;
      }
      
      if (segment.length === 3 && !validThreeLetterWords.includes(segment)) {
        return false;
      }
    }
  }
  
  // Check for common non-words patterns (expanded blacklist approach)
  const nonWords = ['aaa', 'bbb', 'ccc', 'ddd', 'eee', 'fff', 'ggg', 'hhh', 'iii', 
                   'jjj', 'kkk', 'lll', 'mmm', 'nnn', 'ooo', 'ppp', 'qqq', 'rrr', 
                   'sss', 'ttt', 'uuu', 'vvv', 'www', 'xxx', 'yyy', 'zzz',
                   'asd', 'qwe', 'zxc', 'asdf', 'qwer', 'wasd'];
                   
  if (nonWords.includes(normalizedWord)) {
    return false;
  }
  
  // Basic length check (most real words aren't extremely long)
  if (normalizedWord.length > 30) {
    return false;
  }
  
  // Check for repeating characters (e.g., "aaaa", "lllll")
  if (/(.)\1{2,}/.test(normalizedWord)) {
    return false;
  }
  
  // Check for common keyboard patterns that aren't real words
  if (/^[qwertasdfgzxcvb]{3,}$/.test(normalizedWord) || 
      /^[yuiophjklnm]{3,}$/.test(normalizedWord)) {
    return false;
  }
  
  // Check for words with unusual consonant patterns (non-pronounceable)
  if (/[bcdfghjklmnpqrstvwxz]{4,}/.test(normalizedWord)) {
    return false;
  }
  
  return true;
};
