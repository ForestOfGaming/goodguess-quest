
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
          <Timer className="w-12 h-12 text-goodguess-secondary mb-4" />
        ) : (
          <img
            src="https://hxydxswrmpkspvbdbckd.supabase.co/storage/v1/object/sign/ah/Capture2.PNG?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhaC9DYXB0dXJlMi5QTkciLCJpYXQiOjE3NDU5NTA3ODgsImV4cCI6MTc3NzQ4Njc4OH0.791PN5lN4qnRtqFDNvr-que0w_yqBPzEFNV6xR1_OT4"
            alt="Classic Mode"
            className="w-12 h-12 text-goodguess-secondary mb-4"
          />
        )}
        <h3 className="text-3xl font-extrabold text-goodguess-secondary">
          {mode === 'speedrun' ? 'speedrun' : 'classic'}
        </h3>
      </div>
    </motion.div>
  );
};

export default GameModeCard;
