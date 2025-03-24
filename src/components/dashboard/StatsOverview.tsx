
import React from 'react';
import { motion } from 'framer-motion';
import StatsCard from '@/components/ui/stats-card';
import { Trophy, Clock, BookOpen, BarChart2 } from 'lucide-react';

const StatsOverview = () => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <StatsCard 
        title="Study Streak" 
        value="12 days" 
        trend="up" 
        trendValue="+3 from last week"
        icon={<Trophy size={20} />} 
      />
      <StatsCard 
        title="Study Time" 
        value="18.5 hours" 
        description="This week" 
        icon={<Clock size={20} />} 
      />
      <StatsCard 
        title="Completed Modules" 
        value="24/86" 
        icon={<BookOpen size={20} />} 
      />
      <StatsCard 
        title="Knowledge Mastery" 
        value="68%" 
        trend="up" 
        trendValue="+5% this month"
        icon={<BarChart2 size={20} />} 
      />
    </motion.div>
  );
};

export default StatsOverview;
