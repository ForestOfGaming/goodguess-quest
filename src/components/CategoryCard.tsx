
import React from 'react';
import { motion } from 'framer-motion';
import { Category } from '../data/categories';

interface CategoryCardProps {
  category: Category;
  onClick: (category: Category) => void;
  index: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="rounded-3xl overflow-hidden shadow-lg bg-goodguess-primary cursor-pointer w-full aspect-square"
      onClick={() => onClick(category)}
    >
      <div className="h-full w-full flex flex-col items-center justify-center p-4">
        <span className="text-4xl mb-2">{category.emoji}</span>
        <h3 className="text-lg font-bold text-white text-center">{category.name}</h3>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
