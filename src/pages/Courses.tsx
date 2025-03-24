
import React from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import LearningModule from '@/components/ui/learning-module';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Search, Filter, BookOpen } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const Courses = () => {
  // Mock data
  const courseMeta = {
    title: "Financial Accounting Fundamentals",
    description: "Master the core principles of financial accounting including the accounting cycle, financial statements, and GAAP.",
    category: "ACCA",
    progress: 65,
    modules: 8,
    completed: 4,
    totalDuration: "24 hours"
  };
  
  const modules = [
    {
      id: 'module-1',
      title: 'Introduction to Financial Accounting',
      progress: 100,
      totalDuration: '3h 45m',
      topics: [
        { id: '1-1', title: 'The Accounting Environment', duration: '45m', isCompleted: true },
        { id: '1-2', title: 'Financial Statements Overview', duration: '1h', isCompleted: true },
        { id: '1-3', title: 'Users of Financial Information', duration: '1h', isCompleted: true },
        { id: '1-4', title: 'Accounting Standards Framework', duration: '1h', isCompleted: true },
      ]
    },
    {
      id: 'module-2',
      title: 'The Accounting Cycle',
      progress: 100,
      totalDuration: '4h 30m',
      topics: [
        { id: '2-1', title: 'Double-Entry Bookkeeping', duration: '1h 15m', isCompleted: true },
        { id: '2-2', title: 'Journal Entries and Ledgers', duration: '1h', isCompleted: true },
        { id: '2-3', title: 'Trial Balance Preparation', duration: '1h 15m', isCompleted: true },
        { id: '2-4', title: 'Adjusting Entries', duration: '1h', isCompleted: true },
      ]
    },
    {
      id: 'module-3',
      title: 'Financial Statements',
      progress: 75,
      totalDuration: '5h 15m',
      topics: [
        { id: '3-1', title: 'Income Statement', duration: '1h 30m', isCompleted: true },
        { id: '3-2', title: 'Balance Sheet', duration: '1h 30m', isCompleted: true },
        { id: '3-3', title: 'Cash Flow Statement', duration: '1h 15m', isCompleted: true },
        { id: '3-4', title: 'Statement of Changes in Equity', duration: '1h', isCompleted: false },
      ]
    },
    {
      id: 'module-4',
      title: 'Accounting for Assets',
      progress: 50,
      totalDuration: '4h',
      topics: [
        { id: '4-1', title: 'Current Assets', duration: '1h', isCompleted: true },
        { id: '4-2', title: 'Non-Current Assets', duration: '1h 30m', isCompleted: true },
        { id: '4-3', title: 'Depreciation Methods', duration: '1h 30m', isCompleted: false },
      ]
    },
    {
      id: 'module-5',
      title: 'Accounting for Liabilities',
      progress: 0,
      totalDuration: '4h 30m',
      topics: [
        { id: '5-1', title: 'Current Liabilities', duration: '1h 30m', isCompleted: false },
        { id: '5-2', title: 'Non-Current Liabilities', duration: '1h 30m', isCompleted: false },
        { id: '5-3', title: 'Provisions and Contingencies', duration: '1h 30m', isCompleted: false },
      ]
    },
  ];

  return (
    <MainLayout>
      <div className="p-6 md:p-8">
        <motion.div 
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Course Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <Badge className="mb-2">{courseMeta.category}</Badge>
                <h1 className="text-2xl md:text-3xl font-semibold">{courseMeta.title}</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl">{courseMeta.description}</p>
              </div>
              <Button className="w-full md:w-auto">Continue Learning</Button>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:gap-8">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Overall Progress</p>
                <div className="flex items-center gap-2">
                  <Progress value={courseMeta.progress} className="w-40 h-2" />
                  <span className="text-sm font-medium">{courseMeta.progress}%</span>
                </div>
              </div>
              
              <div className="flex gap-4 sm:gap-8">
                <div>
                  <p className="text-sm text-muted-foreground">Modules</p>
                  <p className="font-medium">{courseMeta.completed}/{courseMeta.modules} completed</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Duration</p>
                  <p className="font-medium">{courseMeta.totalDuration}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Course Tabs */}
          <Tabs defaultValue="modules" className="mb-8">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="assessments">Assessments</TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
            </TabsList>
            
            <TabsContent value="modules" className="mt-6">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search modules and topics..." 
                    className="pl-9"
                  />
                </div>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
              
              {/* Modules List */}
              <div className="space-y-5">
                {modules.map((module, index) => (
                  <LearningModule
                    key={module.id}
                    id={module.id}
                    title={module.title}
                    topics={module.topics}
                    progress={module.progress}
                    totalDuration={module.totalDuration}
                    isActive={index === 3} // Set the current module as active
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="resources">
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Course Resources</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Access supplementary materials, readings, and practice files for this course.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="assessments">
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Course Assessments</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Take quizzes and practice tests to gauge your understanding of the material.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="discussion">
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Course Discussion</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Engage with instructors and fellow students to discuss course topics.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Courses;
