
import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip';
import { GameMode } from '../../hooks/useGame';

interface GameHeaderProps {
  categoryName: string;
  timeRemaining: number | null;
  getElapsedTime: () => number;
  mode: GameMode;
  categoryId: string;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  categoryName, 
  timeRemaining, 
  getElapsedTime, 
  mode, 
  categoryId 
}) => {
  const getCategoryTooltipContent = () => {
    switch(categoryId) {
      case 'food':
        return "For food items, guesses are matched by ingredients and country of origin in addition to word similarity!";
      case 'animals':
        return "For animals, guesses are matched by species, habitat, and features in addition to word similarity!";
      case 'countries':
        return "For countries, guesses are matched by region, language, and cultural features in addition to word similarity!";
      case 'sports':
        return "For sports, guesses are matched by type, equipment, and characteristics in addition to word similarity!";
      case 'movies':
        return "For movies, guesses are matched by genre, directors, and themes in addition to word similarity!";
      case 'celebrities':
        return "For celebrities, guesses are matched by profession, nationality, and accomplishments in addition to word similarity!";
      case 'technology':
        return "For technology items, guesses are matched by function, type, and features in addition to word similarity!";
      case 'music':
        return "For music terms, guesses are matched by genre, instrument type, and characteristics in addition to word similarity!";
      case 'nature':
        return "For nature terms, guesses are matched by type, location, and properties in addition to word similarity!";
      case 'vehicles':
        return "For vehicles, guesses are matched by type, use, and characteristics in addition to word similarity!";
      case 'professions':
        return "For professions, guesses are matched by field, skills, and workplace in addition to word similarity!";
      case 'fruits':
        return "For fruits, guesses are matched by type, origin, and properties in addition to word similarity!";
      default:
        return "Guesses are matched by word similarity!";
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-lg font-semibold"
        >
          {categoryName}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="ml-2 cursor-help inline-flex">
                  <Info size={16} className="text-goodguess-primary" />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm max-w-xs">
                  {getCategoryTooltipContent()}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`text-xl font-bold ${
            mode === 'speedrun' && timeRemaining && timeRemaining < 10
              ? 'text-goodguess-danger animate-pulse'
              : ''
          }`}
        >
          {mode === 'speedrun' ? (
            <>
              {timeRemaining}s
              <motion.div
                className="h-1 bg-goodguess-primary mt-1 rounded-full"
                initial={{ width: '100%' }}
                animate={{ width: `${(timeRemaining! / 60) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </>
          ) : (
            `${getElapsedTime()}s`
          )}
        </motion.div>
      </div>
      
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl md:text-3xl font-bold text-center mb-8"
      >
        guess the word
      </motion.h1>
    </>
  );
};

export default GameHeader;
