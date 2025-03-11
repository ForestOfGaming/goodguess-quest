
import React from 'react';
import { Menu, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavBarProps {
  onMenuClick?: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  
  return (
    <nav className="h-16 w-full px-4 flex items-center justify-between bg-goodguess-background border-b border-goodguess-primary/20">
      <button 
        onClick={onMenuClick}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-goodguess-primary/10 transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>
      
      <button 
        onClick={() => navigate('/')}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-goodguess-primary/10 transition-colors"
      >
        <User className="w-6 h-6" />
      </button>
    </nav>
  );
};

export default NavBar;
