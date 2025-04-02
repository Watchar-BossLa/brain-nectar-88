
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import AdaptiveQuizPlatform from '@/components/quiz/AdaptiveQuizPlatform';
import { BrainCircuit, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import HomeNavigation from '@/components/layout/HomeNavigation';
import { Card } from '@/components/ui/card';
import { SubjectSelector } from '@/components/subjects';

const Quiz = () => {
  const [selectedSubject, setSelectedSubject] = useState('accounting');
  
  return (
    <MainLayout>
      <div className="container p-6 md:p-8 mx-auto">
        <div className="mb-4">
          <HomeNavigation />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-semibold flex items-center gap-2">
                <BrainCircuit className="h-7 w-7" />
                Quiz Platform
              </h1>
              <p className="text-muted-foreground mt-1">
                Test your knowledge with our quiz system
              </p>
            </div>
            <Link to="/adaptive-quiz">
              <Button className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Try Adaptive Quiz
              </Button>
            </Link>
          </div>
        </motion.div>

        <Card className="p-4 mb-6">
          <h2 className="text-lg font-medium mb-3">Choose Subject Area</h2>
          <SubjectSelector 
            currentSubject={selectedSubject}
            onSelect={setSelectedSubject}
            displayStyle="buttons"
          />
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AdaptiveQuizPlatform initialSubject={selectedSubject} />
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Quiz;
