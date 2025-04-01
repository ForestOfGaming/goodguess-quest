
import React from 'react';
import NavBar from '../components/NavBar';
import Leaderboard from '../components/Leaderboard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const LeaderboardPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-goodguess-background flex flex-col">
      <NavBar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <Leaderboard showFilters={true} />
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
