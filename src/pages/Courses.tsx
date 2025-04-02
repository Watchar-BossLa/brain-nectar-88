
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DiscussionTab from '@/components/courses/DiscussionTab';

const Courses = () => {
  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">My Courses</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Financial Accounting</CardTitle>
              <CardDescription>Introduction to financial statements and accounting principles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>Progress: 45%</p>
                <div className="w-full bg-muted h-2 mt-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Management Accounting</CardTitle>
              <CardDescription>Cost analysis and budgeting fundamentals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>Progress: 20%</p>
                <div className="w-full bg-muted h-2 mt-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Business Law</CardTitle>
              <CardDescription>Legal principles for accounting professionals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>Progress: 10%</p>
                <div className="w-full bg-muted h-2 mt-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="modules">
          <TabsList>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="discussion">Discussion</TabsTrigger>
          </TabsList>
          <TabsContent value="modules" className="mt-6">
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-2">Course Modules</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Select a course above to view its modules.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="resources" className="mt-6">
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-2">Course Resources</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Select a course above to view its resources.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="assessments" className="mt-6">
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-2">Course Assessments</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Select a course above to view its assessments.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="discussion" className="mt-6">
            <DiscussionTab />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Courses;
