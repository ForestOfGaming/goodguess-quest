
import React, { useRef } from 'react';
import { motion } from 'framer-motion';

interface GuessFormProps {
  guess: string;
  setGuess: (guess: string) => void;
  submitGuess: (guess: string) => void;
  isValidating?: boolean;
}

const GuessForm: React.FC<GuessFormProps> = ({ guess, setGuess, submitGuess, isValidating = false }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidating) {
      submitGuess(guess);
    }
    
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
          className={`w-full h-16 px-4 rounded-2xl border-2 text-lg focus:outline-none focus:ring-2 focus:border-transparent ${
            isValidating ? 'bg-gray-50 border-gray-300' : 'border-goodguess-primary focus:ring-goodguess-primary'
          }`}
          placeholder={isValidating ? "Checking your guess..." : "Type your guess..."}
          autoComplete="off"
          disabled={isValidating}
        />
        <button 
          type="submit"
          disabled={isValidating}
          className="absolute right-2 top-2 h-12 px-4 bg-goodguess-primary text-white rounded-xl font-semibold hover:bg-goodguess-primary-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
        >
          {isValidating ? 
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Checking...
            </span> : 
            "Guess"
          }
        </button>
      </motion.div>
    </form>
  );
};

export default GuessForm;
