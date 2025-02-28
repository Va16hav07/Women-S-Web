import React from 'react';
import { motion } from 'framer-motion';

interface TechCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const TechCard: React.FC<TechCardProps> = ({ icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-50px" }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-indigo-500"
    >
      <div className="flex items-center mb-4">
        <div className="mr-4 text-indigo-600">{icon}</div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </motion.div>
  );
};

export default TechCard;