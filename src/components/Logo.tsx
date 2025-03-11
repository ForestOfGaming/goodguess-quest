
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logo: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105"
      onClick={() => navigate('/')}
    >
      <div className="relative">
        <div className="flex">
          {['G', 'o', 'o', 'd'].map((letter, i) => (
            <div 
              key={`good-${i}`}
              className="w-16 h-16 rounded-full bg-goodguess-primary flex items-center justify-center text-white font-bold text-2xl shadow-md animate-float"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              {letter}
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="bg-goodguess-secondary rounded-2xl px-4 py-2 shadow-md">
            <span className="font-bold text-2xl text-goodguess-text">GUESS?</span>
          </div>
          <div className="absolute -left-8 -top-1 animate-float" style={{ animationDelay: '0.8s' }}>
            <div className="w-12 h-12 rounded-full bg-goodguess-primary flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-white">
                <div className="w-3 h-3 rounded-full bg-black absolute top-4 left-3"></div>
                <div className="w-3 h-3 rounded-full bg-black absolute top-4 right-3"></div>
              </div>
            </div>
            <div className="w-8 h-2 rounded-full bg-goodguess-secondary mx-auto mt-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logo;
