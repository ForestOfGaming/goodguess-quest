
import { useState } from 'react';
import { GameMode } from './useGame';
import { categoryWords } from '../data/semantic';

export interface GameState {
  categoryId: string;
  mode: GameMode;
  targetWord: string;
  guesses: Array<{ word: string; proximity: number }>;
  isGameOver: boolean;
  isWon: boolean;
  startTime: number;
  endTime: number | null;
  timeLimit: number | null;
  wordsGuessed: number;
  hintsEnabled: boolean;
  currentHint: string | null;
  revealedHints: string[]; // Array to store all revealed hints
  hasResigned: boolean; // Track if player gave up
}

export const useGameState = (categoryId: string, mode: GameMode) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const targetList = categoryWords[categoryId] || [];
    const randomTarget = targetList.length > 0 
      ? targetList[Math.floor(Math.random() * targetList.length)]
      : "default";
    
    return {
      categoryId,
      mode,
      targetWord: randomTarget,
      guesses: [],
      isGameOver: false,
      isWon: false,
      startTime: Date.now(),
      endTime: null,
      timeLimit: mode === 'speedrun' ? 60 : null, // 60 seconds for speedrun mode
      wordsGuessed: 0,
      hintsEnabled: false,
      currentHint: null,
      revealedHints: [], // Initialize empty array for hints
      hasResigned: false, // Initialize as not resigned
    };
  });

  return { gameState, setGameState };
};
