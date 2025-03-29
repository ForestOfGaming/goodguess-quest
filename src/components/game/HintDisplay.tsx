
import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Switch } from 'lucide-react';
import { Switch as SwitchUI } from '../../components/ui/switch';

interface HintDisplayProps {
  hintsEnabled: boolean;
  toggleHints: () => void;
  currentHint: string | null;
}

const HintDisplay: React.FC<HintDisplayProps> = ({ hintsEnabled, toggleHints, currentHint }) => {
  return (
    <>
      <div className="flex items-center justify-center mb-6 space-x-2">
        <Lightbulb className={`w-5 h-5 ${hintsEnabled ? 'text-yellow-500' : 'text-gray-400'}`} />
        <span className="text-sm font-medium">Hints</span>
        <SwitchUI 
          checked={hintsEnabled}
          onCheckedChange={toggleHints}
          className="data-[state=checked]:bg-yellow-500"
        />
        <span className="text-xs text-gray-500">(every 15 guesses)</span>
      </div>
      
      {currentHint && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg mb-6 flex items-center"
        >
          <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
          <span className="text-sm">Hint: {currentHint}</span>
        </motion.div>
      )}
    </>
  );
};

export default HintDisplay;
