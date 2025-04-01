
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';
import { Button } from '@/components/ui/button';
import { PlayCircle, Trophy } from 'lucide-react';
import Leaderboard from '@/components/Leaderboard';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-goodguess-background flex flex-col items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-12 mb-8"
      >
        <Logo />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-goodguess-primary mb-3">
          GoodGuess
        </h1>
        <p className="text-lg md:text-xl text-gray-700">
          How good is your semantic intuition?
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex flex-col md:flex-row gap-4 mb-16"
      >
        <Button 
          onClick={() => navigate('/categories')}
          className="text-xl py-6 px-8 bg-goodguess-primary hover:bg-goodguess-primary-dark"
          size="lg"
        >
          <PlayCircle className="mr-2 h-6 w-6" />
          Play Now
        </Button>
        
        {!user && (
          <Button 
            onClick={() => navigate('/auth')}
            className="text-xl py-6 px-8"
            variant="outline"
            size="lg"
          >
            Sign In
          </Button>
        )}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="w-full max-w-3xl"
      >
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Trophy className="mr-2 text-yellow-500" />
              Top Players
            </h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/leaderboard')}
            >
              View All
            </Button>
          </div>
          
          <Leaderboard limit={5} showFilters={false} />
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
