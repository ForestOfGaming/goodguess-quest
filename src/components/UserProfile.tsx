
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { UserRound, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  if (!user) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate('/auth')}
        className="flex items-center gap-2"
      >
        <UserRound size={16} />
        Sign In
      </Button>
    );
  }
  
  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
    navigate('/');
  };
  
  const getInitials = () => {
    if (!user) return '?';
    
    // Try to get username from user metadata
    const username = user.user_metadata?.username;
    if (username) {
      return username.substring(0, 2).toUpperCase();
    }
    
    // Fallback to email
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    
    return 'U';
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="p-0 h-10 w-10 rounded-full">
          <Avatar>
            <AvatarFallback className="bg-goodguess-primary text-white">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="space-y-3">
          <div className="font-medium">
            {user.user_metadata?.username || user.email}
          </div>
          <div className="text-sm text-gray-500">
            {user.email}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start" 
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserProfile;
