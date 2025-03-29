
import React, { useRef } from 'react';
import { motion } from 'framer-motion';

interface GuessFormProps {
  guess: string;
  setGuess: (guess: string) => void;
  submitGuess: (guess: string) => void;
}

const GuessForm: React.FC<GuessFormProps> = ({ guess, setGuess, submitGuess }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitGuess(guess);
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="relative"
      >
        <input
          ref={inputRef}
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          className="w-full h-16 px-4 rounded-2xl border-2 border-goodguess-primary text-lg focus:outline-none focus:ring-2 focus:ring-goodguess-primary focus:border-transparent"
          placeholder="Type your guess..."
          autoComplete="off"
        />
        <button 
          type="submit"
          className="absolute right-2 top-2 h-12 px-4 bg-goodguess-primary text-white rounded-xl font-semibold hover:bg-goodguess-primary-dark transition-colors"
        >
          Guess
        </button>
      </motion.div>
    </form>
  );
};

export default GuessForm;
