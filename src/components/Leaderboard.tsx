
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Trophy, ListFilter, AlertCircle, Loader2 } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { GameMode } from '@/hooks/useGame';
import { Database } from '@/integrations/supabase/types';
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const [totalEntries, setTotalEntries] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = showFilters ? limit : 10;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First, get total count for pagination
        let countQuery = supabase
          .from('leaderboard')
          .select('*', { count: 'exact', head: true });
        
        if (selectedCategory) {
          countQuery = countQuery.eq('category_id', selectedCategory);
        }
        
        if (selectedMode) {
          countQuery = countQuery.eq('game_mode', selectedMode);
        }
        
        const { count, error: countError } = await countQuery;
        
        if (countError) throw countError;
        
        setTotalEntries(count || 0);
        
        // Then get paginated data
        let query = supabase
          .from('leaderboard')
          .select(`
            *,
            profiles:user_id (
              username
            )
          `)
          .order(selectedMode === 'speedrun' ? 'score' : 'time_seconds', { ascending: selectedMode !== 'speedrun' });
        
        if (selectedCategory) {
          query = query.eq('category_id', selectedCategory);
        }
        
        if (selectedMode) {
          query = query.eq('game_mode', selectedMode);
        }
        
        // Apply pagination if we're not limiting by a fixed number
        if (showFilters) {
          const from = (currentPage - 1) * entriesPerPage;
          const to = from + entriesPerPage - 1;
          query = query.range(from, to);
        } else {
          query = query.limit(limit);
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
  }, [selectedCategory, selectedMode, limit, currentPage, entriesPerPage, showFilters]);
  
  const handleAuth = () => {
    navigate('/auth');
  };

  const goToPage = (page: number) => {
    if (page > 0 && page <= Math.ceil(totalEntries / entriesPerPage)) {
      setCurrentPage(page);
    }
  };

  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  
  const renderPaginationItems = () => {
    const items = [];
    
    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          onClick={() => goToPage(1)} 
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => goToPage(i)} 
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Show ellipsis if needed
    if (currentPage < totalPages - 2 && totalPages > 1) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            onClick={() => goToPage(totalPages)} 
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };
  
  // Helper function to display the correct username
  const displayUsername = (entry: LeaderboardEntry) => {
    // If there's a user_id, display the username from profiles or "User" as fallback
    if (entry.user_id) {
      return entry.profiles?.username || 'User';
    }
    // If no user_id (anonymous player), display "Anonymous"
    return 'Anonymous';
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
                    onChange={(e) => {
                      setSelectedCategory(e.target.value || undefined);
                      setCurrentPage(1); // Reset to first page when filter changes
                    }}
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
                    onChange={(e) => {
                      setSelectedMode(e.target.value as GameMode || undefined);
                      setCurrentPage(1); // Reset to first page when filter changes
                    }}
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
        <div className="text-center py-8 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading leaderboard...
        </div>
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
        <ScrollArea className={showFilters ? "h-[400px]" : "max-h-[300px]"}>
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
                  <TableCell className="font-medium text-center">{showFilters ? (currentPage - 1) * entriesPerPage + index + 1 : index + 1}</TableCell>
                  <TableCell>
                    {displayUsername(entry)}
                  </TableCell>
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
        </ScrollArea>
      )}
      
      {showFilters && totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => goToPage(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {renderPaginationItems()}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => goToPage(currentPage + 1)}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
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
