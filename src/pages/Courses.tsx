
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, FileText, User, MessageCircle } from 'lucide-react';
import ModulesList from '@/components/courses/ModulesList';
import ResourcesTab from '@/components/courses/ResourcesTab';
import AssessmentsTab from '@/components/courses/AssessmentsTab';
import DiscussionTab from '@/components/courses/DiscussionTab';
import MainLayout from '@/components/layout/MainLayout';
import CourseHeader from '@/components/courses/CourseHeader';

const Courses = () => {
  const [activeTab, setActiveTab] = useState('modules');
  
  // Sample course metadata for the header
  const courseMeta = {
    title: "Financial Accounting Fundamentals",
    description: "Learn the core principles of financial accounting, including balance sheets, income statements, and cash flow analysis.",
    category: "Accounting",
    progress: 45,
    modules: 8,
    completed: 3,
    totalDuration: "16 hours"
  };

  // Sample modules data for the modules list
  const modules = [
    {
      id: "module-1",
      title: "Introduction to Financial Accounting",
      progress: 100,
      totalDuration: "2 hours",
      topics: [
        { id: "topic-1-1", title: "Accounting Principles", duration: "30 min", isCompleted: true },
        { id: "topic-1-2", title: "Financial Statements Overview", duration: "45 min", isCompleted: true },
        { id: "topic-1-3", title: "The Accounting Equation", duration: "45 min", isCompleted: true }
      ]
    },
    {
      id: "module-2",
      title: "Recording Business Transactions",
      progress: 66,
      totalDuration: "3 hours",
      topics: [
        { id: "topic-2-1", title: "Double-Entry Accounting", duration: "1 hour", isCompleted: true },
        { id: "topic-2-2", title: "Journal Entries", duration: "1 hour", isCompleted: true },
        { id: "topic-2-3", title: "T-Accounts and Trial Balance", duration: "1 hour", isCompleted: false }
      ]
    },
    {
      id: "module-3",
      title: "Adjusting Entries and Financial Statements",
      progress: 33,
      totalDuration: "2.5 hours",
      topics: [
        { id: "topic-3-1", title: "Accruals and Deferrals", duration: "45 min", isCompleted: true },
        { id: "topic-3-2", title: "Adjusting Journal Entries", duration: "45 min", isCompleted: false },
        { id: "topic-3-3", title: "Preparing Financial Statements", duration: "1 hour", isCompleted: false }
      ]
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        {/* Course Header with metadata */}
        <CourseHeader courseMeta={courseMeta} />
        
        <Card>
          <CardHeader>
            <CardTitle>Course Content</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="modules">
                  <Book className="h-4 w-4 mr-2" />
                  Modules
                </TabsTrigger>
                <TabsTrigger value="resources">
                  <FileText className="h-4 w-4 mr-2" />
                  Resources
                </TabsTrigger>
                <TabsTrigger value="assessments">
                  <User className="h-4 w-4 mr-2" />
                  Assessments
                </TabsTrigger>
                <TabsTrigger value="discussion">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Discussion
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="modules">
                <ModulesList modules={modules} />
              </TabsContent>
              
              <TabsContent value="resources">
                <ResourcesTab />
              </TabsContent>
              
              <TabsContent value="assessments">
                <AssessmentsTab />
              </TabsContent>
              
              <TabsContent value="discussion">
                <DiscussionTab />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Courses;
