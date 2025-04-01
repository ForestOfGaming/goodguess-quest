
import React from 'react';
import { motion } from 'framer-motion';

interface ProximityBarProps {
  percentage: number;
  index: number;
}

const ProximityBar: React.FC<ProximityBarProps> = ({ percentage, index }) => {
  // Determine color based on proximity
  const getColor = () => {
    if (percentage >= 75) return 'bg-goodguess-success';
    if (percentage >= 40) return 'bg-goodguess-warning';
    if (percentage >= 20) return 'bg-yellow-400';
    if (percentage >= 10) return 'bg-orange-400';
    return 'bg-goodguess-danger';
  };
  
  return (
    <motion.div 
      className="w-full h-10 bg-white border-2 border-black rounded-full overflow-hidden mb-3 shadow-md"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <motion.div 
        className={`h-full ${getColor()} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(5, percentage)}%` }} {/* Minimum bar width of 5% for visibility */}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
    </motion.div>
  );
};

export default ProximityBar;
