
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProximityBar from '../ProximityBar';

interface GuessListProps {
  guesses: Array<{ word: string; proximity: number }>;
  wordsGuessed?: number;
  isSpeedrun: boolean;
}

const GuessList: React.FC<GuessListProps> = ({ guesses, wordsGuessed = 0, isSpeedrun }) => {
  return (
    <div className="space-y-2">
      {isSpeedrun && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-6 text-xl font-bold"
        >
          Words guessed: {wordsGuessed}
        </motion.div>
      )}
      
      <AnimatePresence>
        {guesses.map((guess, index) => (
          <motion.div
            key={`${guess.word}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
            <div className="flex justify-between mb-1">
              <span className="font-semibold">{guess.word}</span>
              <span className="font-bold">{guess.proximity}%</span>
            </div>
            <ProximityBar percentage={guess.proximity} index={index} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default GuessList;
