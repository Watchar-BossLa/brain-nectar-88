
import React from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import DatabasedLearningPathView from '@/components/learning-path/DatabasedLearningPathView';
import { DatabasedLearningPathProvider } from '@/context/learning/DatabasedLearningPathContext';

/**
 * Page for displaying the new database-connected learning path
 */
const DatabasedLearningPath = () => {
  return (
    <MainLayout>
      <motion.div 
        className="p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto">
          <DatabasedLearningPathProvider>
            <DatabasedLearningPathView />
          </DatabasedLearningPathProvider>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default DatabasedLearningPath;
