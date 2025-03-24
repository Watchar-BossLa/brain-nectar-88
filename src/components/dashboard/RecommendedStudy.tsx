
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

// Mock data
const recommendedTopics = [
  {
    id: '1',
    title: 'Depreciation Methods',
    category: 'Financial Accounting',
    strength: 40,
  },
  {
    id: '2',
    title: 'Cost Allocation Techniques',
    category: 'Management Accounting',
    strength: 35,
  }
];

const RecommendedStudy = () => {
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
      <h2 className="text-xl font-semibold mb-4">Recommended Study</h2>
      
      <div className="space-y-4">
        {recommendedTopics.map((topic) => (
          <div key={topic.id} className="p-3 rounded-lg border border-border hover:bg-accent/30 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">{topic.title}</h3>
                <p className="text-sm text-muted-foreground">{topic.category}</p>
              </div>
              <Button size="sm" variant="outline">Review</Button>
            </div>
            
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Knowledge strength</span>
                <span>{topic.strength}%</span>
              </div>
              <Progress value={topic.strength} className="h-1.5" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecommendedStudy;
