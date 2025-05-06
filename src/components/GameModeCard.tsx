
import React from 'react';
import { motion } from 'framer-motion';
import { Timer } from 'lucide-react';

interface GameModeCardProps {
  mode: 'speedrun' | 'classic';
  onClick: (mode: 'speedrun' | 'classic') => void;
}

const GameModeCard: React.FC<GameModeCardProps> = ({ mode, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: mode === 'speedrun' ? 0.1 : 0.2 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="rounded-3xl overflow-hidden shadow-lg bg-goodguess-primary border-4 border-goodguess-primary-dark cursor-pointer h-full w-full"
      onClick={() => onClick(mode)}
    >
      <div className="h-full w-full flex flex-col items-center justify-center p-8">
        {mode === 'speedrun' ? (
          <>
            <Timer className="w-12 h-12 text-goodguess-secondary mb-4" />
            <h3 className="text-3xl font-extrabold text-goodguess-secondary">
              speedrun
            </h3>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full">
            <img 
              src="/lovable-uploads/3cf2364e-9378-4c39-8e66-621371f16019.png" 
              alt="Classic mode" 
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GameModeCard;
