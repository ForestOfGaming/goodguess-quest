
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Trophy, ListFilter, AlertCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { GameMode } from '@/hooks/useGame';

interface LeaderboardEntry {
  id: string;
  user_id: string;
  category_id: string;
  game_mode: string;
  score: number;
  time_seconds: number | null;
  created_at: string;
  profiles: {
    username: string | null;
  };
}

interface LeaderboardProps {
  categoryId?: string;
  mode?: GameMode;
  limit?: number;
  showFilters?: boolean;
}

const Leaderboard = ({ categoryId, mode, limit = 10, showFilters = true }: LeaderboardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(categoryId);
  const [selectedMode, setSelectedMode] = useState<GameMode | undefined>(mode);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let query = supabase
          .from('leaderboard')
          .select(`
            *,
            profiles:user_id (
              username
            )
          `)
          .order(selectedMode === 'speedrun' ? 'score' : 'time_seconds', { ascending: selectedMode !== 'speedrun' })
          .limit(limit);
        
        if (selectedCategory) {
          query = query.eq('category_id', selectedCategory);
        }
        
        if (selectedMode) {
          query = query.eq('game_mode', selectedMode);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setEntries(data as LeaderboardEntry[]);
      } catch (err: any) {
        console.error('Error fetching leaderboard:', err);
        setError(err.message || 'Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [selectedCategory, selectedMode, limit]);
  
  const handleAuth = () => {
    navigate('/auth');
  };
  
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <Trophy className="mr-2 text-yellow-500" />
          Leaderboard
        </h2>
        
        {showFilters && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <ListFilter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Leaderboard</SheetTitle>
                <SheetDescription>
                  Choose category and game mode to filter the leaderboard results.
                </SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value || undefined)}
                  >
                    <option value="">All Categories</option>
                    <option value="animals">Animals</option>
                    <option value="countries">Countries</option>
                    <option value="food">Food</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Game Mode</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={selectedMode || ''}
                    onChange={(e) => setSelectedMode(e.target.value as GameMode || undefined)}
                  >
                    <option value="">All Modes</option>
                    <option value="classic">Classic</option>
                    <option value="speedrun">Speedrun</option>
                  </select>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md flex items-center">
          <AlertCircle className="mr-2" />
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-8">Loading leaderboard...</div>
      ) : entries.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <p className="text-gray-500">No leaderboard entries found.</p>
          {!user && (
            <Button 
              onClick={handleAuth} 
              className="mt-4 bg-goodguess-primary hover:bg-goodguess-primary-dark"
            >
              Sign in to compete
            </Button>
          )}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-center">#</TableHead>
              <TableHead>Player</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry, index) => (
              <TableRow key={entry.id} className={user?.id === entry.user_id ? "bg-goodguess-primary/10" : ""}>
                <TableCell className="font-medium text-center">{index + 1}</TableCell>
                <TableCell>{entry.profiles.username || 'Anonymous'}</TableCell>
                <TableCell>{entry.category_id}</TableCell>
                <TableCell className="capitalize">{entry.game_mode}</TableCell>
                <TableCell className="text-right">
                  {entry.game_mode === 'speedrun'
                    ? `${entry.score} words`
                    : `${entry.time_seconds}s`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      {!user && (
        <div className="text-center mt-4">
          <Button 
            onClick={handleAuth} 
            className="bg-goodguess-primary hover:bg-goodguess-primary-dark"
          >
            Sign in to compete
          </Button>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
