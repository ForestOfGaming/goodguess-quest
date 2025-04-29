
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logo: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105"
      onClick={() => navigate('/')}
    >
      <img
        className="w-48 h-48"
        src="https://hxydxswrmpkspvbdbckd.supabase.co/storage/v1/object/public/images//783b28c9-66b5-427b-a46b-226de081486b.jfif"
        alt="Good Guess Logo"
      />
    </div>
  );
};

export default Logo;
