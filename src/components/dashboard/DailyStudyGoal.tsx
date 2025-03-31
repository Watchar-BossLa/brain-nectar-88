
import React from 'react';
import { motion } from '@/lib/motion-imports';
import { Progress } from '@/components/ui/progress';

const DailyStudyGoal = () => {
  return (
    <motion.div 
      className="border border-border rounded-xl p-5 bg-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Daily Study Goal</h2>
          <p className="text-muted-foreground text-sm">You've studied 45 minutes today</p>
        </div>
        <span className="text-primary font-medium mt-2 sm:mt-0">1.5 hours goal</span>
      </div>
      
      <Progress value={50} className="h-2 mb-2" />
      
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-muted-foreground">45 minutes completed</span>
        <span className="text-sm text-muted-foreground">45 minutes remaining</span>
      </div>
    </motion.div>
  );
};

export default DailyStudyGoal;
