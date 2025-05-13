
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';
import NavBar from '../components/NavBar';
import GameModeCard from '../components/GameModeCard';

const GameModeSelection = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  
  const handleModeSelect = (mode: 'speedrun' | 'classic') => {
    navigate(`/game/${categoryId}/${mode}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-goodguess-background">
      <NavBar />
      
      <div className="flex-1 flex flex-col p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 mx-auto"
        >
          <Logo />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl font-bold text-center mb-12"
        >
          Choose your gamemode
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
          <div className="w-full">
            <GameModeCard mode="speedrun" onClick={handleModeSelect} />
          </div>
          <div className="w-full">
            <GameModeCard mode="classic" onClick={handleModeSelect} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameModeSelection;
