
import React from 'react';
import { motion } from 'framer-motion';

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
      className="rounded-3xl overflow-hidden shadow-lg cursor-pointer h-full w-full"
      onClick={() => onClick(mode)}
    >
      {mode === 'speedrun' ? (
        <img 
          src="/lovable-uploads/921a785a-988d-424d-bee3-5160a754342e.png" 
          alt="Speedrun mode" 
          className="w-full h-full object-cover"
        />
      ) : (
        <img 
          src="/lovable-uploads/3cf2364e-9378-4c39-8e66-621371f16019.png" 
          alt="Classic mode" 
          className="w-full h-full object-cover"
        />
      )}
    </motion.div>
  );
};

export default GameModeCard;
