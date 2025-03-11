
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';
import NavBar from '../components/NavBar';
import CategoryCard from '../components/CategoryCard';
import { categories, Category } from '../data/categories';

const CategorySelection = () => {
  const navigate = useNavigate();
  
  const handleCategorySelect = (category: Category) => {
    navigate(`/gamemode/${category.id}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-goodguess-background">
      <NavBar />
      
      <div className="flex-1 flex flex-col p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 mx-auto"
        >
          <Logo />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-3xl font-bold text-center mb-8"
        >
          Choose a category
        </motion.h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={handleCategorySelect}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySelection;
