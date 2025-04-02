
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/auth';
import { useTranslation } from 'react-i18next';
import QuizBasedLearningPath from '@/components/learning/QuizBasedLearningPath';
import StudyProgress from './StudyProgress';
import UpcomingAssessments from './UpcomingAssessments';
import RecommendedStudy from './RecommendedStudy';
import RecentActivity from './RecentActivity';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  // Animation variants for staggered animation
  const container = {
    show: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome message */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">{t('dashboard.welcome')}, {user?.user_metadata?.name || t('common.student')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('dashboard.progress')}
        </p>
      </motion.div>
      
      {/* Dashboard grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* First column */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={item}>
            <StudyProgress />
          </motion.div>
          
          <motion.div variants={item}>
            <QuizBasedLearningPath />
          </motion.div>
        </div>
        
        {/* Second column */}
        <div className="space-y-6">
          <motion.div variants={item}>
            <UpcomingAssessments />
          </motion.div>
          
          <motion.div variants={item}>
            <RecentActivity />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
