
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';

// Mock data
const upcomingAssessments = [
  {
    id: '1',
    title: 'Financial Accounting Quiz',
    date: 'Tomorrow, 10:00 AM',
    duration: '45 min',
  },
  {
    id: '2',
    title: 'Management Accounting Practice Test',
    date: 'Sep 28, 2:00 PM',
    duration: '90 min',
  }
];

const UpcomingAssessments = () => {
  // Animation variant
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="border border-border rounded-xl p-5 bg-card"
      variants={item}
    >
      <h2 className="text-xl font-semibold mb-4">Upcoming Assessments</h2>
      
      <div className="space-y-4">
        {upcomingAssessments.map((assessment) => (
          <motion.div 
            key={assessment.id} 
            className="flex justify-between items-center p-3 rounded-lg border border-border hover:bg-accent/30 transition-colors"
            whileHover={{ x: 5 }}
          >
            <div>
              <h3 className="font-medium">{assessment.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{assessment.date}</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground inline-block"></span>
                <Clock className="h-3.5 w-3.5" />
                <span>{assessment.duration}</span>
              </div>
            </div>
            <Button size="sm">Prepare</Button>
          </motion.div>
        ))}
      </div>
      
      {upcomingAssessments.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No upcoming assessments</p>
        </div>
      )}
    </motion.div>
  );
};

export default UpcomingAssessments;
