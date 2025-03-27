
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import AdaptiveQuizPlatform from '@/components/quiz/AdaptiveQuizPlatform';
import { motion } from 'framer-motion';
import { BookOpen, Brain, ChevronRight } from 'lucide-react';

const AdaptiveQuiz = () => {
  return (
    <MainLayout>
      <div className="p-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Brain className="h-7 w-7 text-primary" /> 
                Adaptive Quiz Platform
              </h1>
              <p className="text-muted-foreground mt-2">
                Our intelligent system adjusts question difficulty based on your performance
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="/quiz">
                  Standard Quiz
                </a>
              </Button>
              <Button size="sm" className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                Study Material
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AdaptiveQuizPlatform />
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default AdaptiveQuiz;
