
import React from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import LearningPathDisplay from '@/components/learning-path/LearningPathDisplay';
import AIRecommendations from '@/components/learning-path/AIRecommendations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Brain, Award } from 'lucide-react';
import ErrorBoundary from '@/components/ui/error-boundary';

const LearningPath = () => {
  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold tracking-tight">Learning Path</h1>
          <p className="text-muted-foreground mt-1">
            Track your progress and follow your personalized learning journey
          </p>
        </motion.div>
        
        <Tabs defaultValue="path">
          <TabsList className="mb-6">
            <TabsTrigger value="path" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Learning Path</span>
            </TabsTrigger>
            <TabsTrigger value="ai-recommendations" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span>AI Recommendations</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>Achievements</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="path">
            <ErrorBoundary>
              <LearningPathDisplay />
            </ErrorBoundary>
          </TabsContent>
          
          <TabsContent value="ai-recommendations">
            <ErrorBoundary>
              <AIRecommendations />
            </ErrorBoundary>
          </TabsContent>
          
          <TabsContent value="achievements">
            <div className="p-12 text-center border rounded-lg">
              <Award className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Achievements Coming Soon</h3>
              <p className="text-muted-foreground">
                Track your learning milestones and earn digital badges as you progress
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default LearningPath;
