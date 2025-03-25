
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock } from 'lucide-react';

const PersonalizedRecommendation: React.FC = () => {
  return (
    <motion.div 
      className="mt-10 border border-border rounded-lg p-6 bg-card/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
    >
      <h2 className="text-xl font-semibold mb-4">Personalized Recommendation</h2>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1">
          <p className="mb-4">
            Based on your current progress and career goals in corporate accounting, we recommend:
          </p>
          <div className="p-4 border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-medium flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              Complete ACCA Financial Reporting (FR) next
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              This module builds on your Financial Accounting knowledge and is essential for your long-term career goals in corporate accounting.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-background">Next Exam: Oct 15</Badge>
              <Badge variant="outline" className="bg-background flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Est. Study Time: 120 hours
              </Badge>
            </div>
          </div>
        </div>
        <Button className="md:self-center">Prepare for FR Exam</Button>
      </div>
    </motion.div>
  );
};

export default PersonalizedRecommendation;
