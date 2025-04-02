
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, FileText, User, MessageCircle } from 'lucide-react';
import { ModulesList } from '@/components/courses/ModulesList';
import { ResourcesTab } from '@/components/courses/ResourcesTab';
import { AssessmentsTab } from '@/components/courses/AssessmentsTab';
import { DiscussionTab } from '@/components/courses/DiscussionTab';
import MainLayout from '@/components/layout/MainLayout';

const Courses = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Accounting Courses</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Financial Accounting Fundamentals</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="modules">
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
                <ModulesList />
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
