
import React from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import StudyPlanner from '@/components/study-planner/StudyPlanner';
import { CalendarClock } from 'lucide-react';

const StudyPlannerPage = () => {
  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-semibold flex items-center gap-2">
            <CalendarClock className="h-7 w-7" />
            Study Planner & Scheduler
          </h1>
          <p className="text-muted-foreground mt-1">
            Plan and track your study sessions to optimize your learning journey
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <StudyPlanner />
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default StudyPlannerPage;
