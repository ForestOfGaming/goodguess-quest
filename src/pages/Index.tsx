
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Add a small delay before navigation
    const timeout = setTimeout(() => {
      navigate('/categories');
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-goodguess-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
        className="mb-8"
      >
        <Logo />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-center max-w-md"
      >
        <h1 className="text-4xl font-bold text-goodguess-text mb-4">
          Test your word knowledge!
        </h1>
        <p className="text-xl text-goodguess-text/80">
          Guess words based on proximity feedback in classic or speedrun mode
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="mt-12"
      >
        <div className="w-12 h-12 border-t-4 border-goodguess-primary rounded-full animate-spin"></div>
      </motion.div>
    </div>
  );
};

export default Index;
