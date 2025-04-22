
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { categories } from '../data/categories';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { GameMode } from '@/hooks/useGame';
import Leaderboard from '@/components/Leaderboard';

const WinScreen = () => {
  const { categoryId = '', mode = 'classic', time = '0' } = useParams<{ 
    categoryId: string; 
    mode: GameMode;
    time: string;
  }>();
  const navigate = useNavigate();
  const timeSeconds = parseInt(time);
  const { user } = useAuth();
  
  const category = categories.find(c => c.id === categoryId);
  
  useEffect(() => {
    const saveScore = async () => {
      try {
        if (user) {
          // Check if user has a profile record
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single();
            
          if (profileError && profileError.code !== 'PGRST116') {
            // PGRST116 means no rows returned
            console.error('Error checking profile:', profileError);
          }
          
          // If no profile exists or username is null, ensure we have one with the username from user metadata
          if (!profileData || profileData.username === null) {
            const username = user.user_metadata?.username || user.email?.split('@')[0] || 'User';
            
            const { error: upsertError } = await supabase
              .from('profiles')
              .upsert({ 
                id: user.id,
                username: username
              });
              
            if (upsertError) {
              console.error('Error updating profile:', upsertError);
            }
          }
        }
        
        // Insert the score into the leaderboard
        const { error } = await supabase
          .from('leaderboard')
          .insert({
            user_id: user ? user.id : null,  // Use null for anonymous users
            category_id: categoryId,
            game_mode: mode,
            score: mode === 'speedrun' ? 1 : 100, // For classic mode, score is always 100 (win)
            time_seconds: timeSeconds
          });
        
        if (error) throw error;
        
        console.log('Score saved to leaderboard');
      } catch (err) {
        console.error('Error saving score:', err);
      }
    };
    
    saveScore();
  }, [user, categoryId, mode, timeSeconds]);
  
  const handlePlayAgain = () => {
    navigate(`/game/${categoryId}/${mode}`);
  };
  
  const handleChangeCategoryOrMode = () => {
    navigate('/categories');
  };
  
  const handleShare = () => {
    const text = `I found the word in ${time} seconds on GoodGuess! Can you beat my time?`;
    
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
          <Heart className="w-24 h-24 text-red-500" />
        </div>
        <h1 className="text-6xl md:text-7xl font-extrabold text-goodguess-primary text-center">
          You Won!
        </h1>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="bg-goodguess-secondary text-goodguess-text text-2xl md:text-3xl font-bold px-8 py-4 rounded-2xl shadow-lg">
          {time} seconds
        </div>
        <p className="mt-4 text-lg">
          Category: <span className="font-bold">{category?.name || categoryId}</span>
        </p>
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
        <Leaderboard categoryId={categoryId} mode={mode as GameMode} limit={5} showFilters={false} />
      </motion.div>
    </div>
  );
};

export default WinScreen;
