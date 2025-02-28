import React from 'react';
import { motion } from 'framer-motion';

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

const StepCard: React.FC<StepCardProps> = ({ number, title, description, icon, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-50px" }}
      className="relative flex flex-col md:flex-row items-start gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
    >
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900 text-pink-600 font-bold text-xl">
          {number}
        </div>
      </div>
      <div>
        <div className="flex items-center mb-2">
          <span className="mr-2 text-pink-600">{icon}</span>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </motion.div>
  );
};

export default StepCard;