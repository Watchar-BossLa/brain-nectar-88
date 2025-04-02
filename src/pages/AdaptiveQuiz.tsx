
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import AdaptiveQuizPlatform from '@/components/quiz/AdaptiveQuizPlatform';
import { motion } from 'framer-motion';
import { BookOpen, Brain, ChevronRight, LineChart, BarChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import HomeNavigation from '@/components/layout/HomeNavigation';
import { SubjectSelector } from '@/components/subjects';

const AdaptiveQuiz = () => {
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
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Brain className="h-7 w-7 text-primary" /> 
                Adaptive Quiz Platform
              </h1>
              <p className="text-muted-foreground mt-2">
                Our intelligent system adapts to your knowledge level in real-time
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

        <Card className="p-4 mb-6">
          <h2 className="text-lg font-medium mb-3">Choose Subject Area</h2>
          <SubjectSelector 
            currentSubject={selectedSubject}
            onSelect={setSelectedSubject}
            displayStyle="buttons"
          />
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Intelligent Adaptation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Questions adjust in real-time based on your performance and confidence level
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  Performance Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Detailed insights into your strengths and areas for improvement
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-primary" />
                  Topic Mastery Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  See your mastery level across different accounting concepts
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AdaptiveQuizPlatform initialSubject={selectedSubject} />
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default AdaptiveQuiz;
