
import React from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import StudyPlanner from '@/components/study-planner/StudyPlanner';
import { CalendarClock, Calendar, BookOpen, Clock, BarChart4 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const StudyPlannerPage = () => {
  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
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
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Daily Planning
              </CardTitle>
              <CardDescription>
                Optimize your study schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create a personalized daily study routine based on your learning style and available time.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Topic Prioritization
              </CardTitle>
              <CardDescription>
                Focus on what matters most
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our intelligent system helps you prioritize topics based on exam weighting and your proficiency.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart4 className="h-5 w-5" />
                Progress Tracking
              </CardTitle>
              <CardDescription>
                Monitor your study goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track your study hours, completed sessions, and overall progress toward exam readiness.
              </p>
            </CardContent>
          </Card>
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
