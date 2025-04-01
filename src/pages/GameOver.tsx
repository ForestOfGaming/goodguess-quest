
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import Leaderboard from '@/components/Leaderboard';

const GameOver = () => {
  const { categoryId = '', wordsGuessed = '0' } = useParams<{ 
    categoryId: string;
    wordsGuessed: string;
  }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const wordsCount = parseInt(wordsGuessed);
  
  useEffect(() => {
    const saveScore = async () => {
      if (!user) return;
      
      try {
        const { error } = await supabase
          .from('leaderboard')
          .insert({
            user_id: user.id,
            category_id: categoryId,
            game_mode: 'speedrun',
            score: wordsCount,
            time_seconds: 60 // Speedrun is always 60 seconds
          });
        
        if (error) throw error;
        
        console.log('Score saved to leaderboard');
      } catch (err) {
        console.error('Error saving score:', err);
      }
    };
    
    saveScore();
  }, [user, categoryId, wordsCount]);
  
  const handlePlayAgain = () => {
    navigate(`/game/${categoryId}/speedrun`);
  };
  
  const handleChangeCategoryOrMode = () => {
    navigate('/categories');
  };
  
  const handleShare = () => {
    const text = `I guessed ${wordsGuessed} words in 60 seconds on GoodGuess! Try to beat my score!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'GoodGuess',
        text
      }).catch(() => {
        navigator.clipboard.writeText(text);
        toast.success('Result copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Result copied to clipboard!');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-goodguess-background p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.6,
          type: 'spring',
          bounce: 0.5
        }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Clock className="w-24 h-24 text-goodguess-warning animate-pulse" />
        </div>
        <h1 className="text-7xl font-extrabold text-goodguess-warning text-center">
          Time Over
        </h1>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="bg-goodguess-primary text-goodguess-secondary text-3xl font-bold px-8 py-4 rounded-2xl shadow-lg">
          You made {wordsGuessed} guesses!
        </div>
      </motion.div>
      
      <div className="flex flex-col space-y-4 w-full max-w-xs">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          onClick={handlePlayAgain}
          className="bg-goodguess-primary text-white font-bold text-xl py-3 px-6 rounded-xl shadow-md hover:bg-goodguess-primary-dark transition-colors"
        >
          Play Again
        </motion.button>
        
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          onClick={handleChangeCategoryOrMode}
          className="bg-white text-goodguess-primary font-bold text-xl py-3 px-6 rounded-xl shadow-md hover:bg-gray-50 transition-colors border-2 border-goodguess-primary"
        >
          Change Category
        </motion.button>
        
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          onClick={handleShare}
          className="bg-goodguess-secondary text-goodguess-text font-bold text-xl py-3 px-6 rounded-xl shadow-md hover:bg-opacity-90 transition-colors"
        >
          <Share2 className="inline-block mr-2" />
          Share Result
        </motion.button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          className="mt-8"
        >
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate('/leaderboard')}
          >
            View Leaderboard
          </Button>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="mt-12 w-full max-w-2xl bg-white p-6 rounded-lg shadow-md"
      >
        <Leaderboard categoryId={categoryId} mode="speedrun" limit={5} showFilters={false} />
      </motion.div>
    </div>
  );
};

export default GameOver;
