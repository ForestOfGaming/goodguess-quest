
export interface Category {
  id: string;
  name: string;
  emoji: string;
  wordList?: string[]; // Added optional wordList property
}

export const categories: Category[] = [
  {
    id: 'animals',
    name: 'Animals',
    emoji: '🐼'
  },
  {
    id: 'food',
    name: 'Food',
    emoji: '🍕'
  },
  {
    id: 'countries',
    name: 'Countries',
    emoji: '🌎'
  },
  {
    id: 'sports',
    name: 'Sports',
    emoji: '⚽'
  },
  {
    id: 'movies',
    name: 'Movies',
    emoji: '🎬'
  },
  {
    id: 'celebrities',
    name: 'Celebrities',
    emoji: '🌟'
  },
  {
    id: 'technology',
    name: 'Technology',
    emoji: '💻'
  },
  {
    id: 'italianbrainrot',
    name: 'Italian Brainrot',
    emoji: '🇮🇹'
  },
  {
    id: 'nature',
    name: 'Nature',
    emoji: '🌿'
  },
  {
    id: 'vehicles',
    name: 'Vehicles',
    emoji: '🚗'
  },
  {
    id: 'professions',
    name: 'Professions',
    emoji: '👨‍⚕️'
  },
  {
    id: 'fruits',
    name: 'Fruits',
    emoji: '🍎'
  }
];
