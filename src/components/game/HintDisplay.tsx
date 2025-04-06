
import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { Switch as SwitchUI } from '../../components/ui/switch';

interface HintDisplayProps {
  hintsEnabled: boolean;
  toggleHints: () => void;
  currentHint: string | null;
  revealedHints?: string[];
}

const HintDisplay: React.FC<HintDisplayProps> = ({ 
  hintsEnabled, 
  toggleHints, 
  currentHint,
  revealedHints = []
}) => {
  const visibleHints = hintsEnabled ? revealedHints : [];

  return (
    <>
      <div className="flex items-center space-x-2">
        <Lightbulb className={`w-5 h-5 ${hintsEnabled ? 'text-yellow-500' : 'text-gray-400'}`} />
        <span className="text-sm font-medium">Hints</span>
        <SwitchUI 
          checked={hintsEnabled}
          onCheckedChange={toggleHints}
          className="data-[state=checked]:bg-yellow-500"
        />
        <span className="text-xs text-gray-500">(every 15 guesses)</span>
      </div>
      
      {visibleHints.length > 0 && hintsEnabled && (
        <div className="space-y-2 mt-4">
          {visibleHints.map((hint, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg flex items-center"
            >
              <Lightbulb className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0" />
              <span className="text-sm">Hint: {hint}</span>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
};

export default HintDisplay;
