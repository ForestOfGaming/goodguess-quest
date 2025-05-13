
import React from 'react';
import { motion } from 'framer-motion';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

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
      <div className="relative w-full h-full">
        <AspectRatio ratio={16/9} className="w-full h-full">
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
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <span className="text-white text-2xl font-bold text-shadow">
              {mode === 'speedrun' ? 'Speedrun' : 'Classic'}
            </span>
          </div>
        </AspectRatio>
      </div>
    </motion.div>
  );
};

export default GameModeCard;
