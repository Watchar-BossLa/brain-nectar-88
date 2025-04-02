
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Clock, Award } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

const Assessment = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Assessments</h1>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming">
              <TabsList className="mb-4">
                <TabsTrigger value="upcoming">
                  <Clock className="h-4 w-4 mr-2" />
                  Upcoming
                </TabsTrigger>
                <TabsTrigger value="completed">
                  <Award className="h-4 w-4 mr-2" />
                  Completed
                </TabsTrigger>
                <TabsTrigger value="all">
                  <FileText className="h-4 w-4 mr-2" />
                  All
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                <div className="space-y-4">
                  <p>You have 3 upcoming assessments scheduled.</p>
                  {/* Assessment items would go here */}
                </div>
              </TabsContent>
              
              <TabsContent value="completed">
                <div className="space-y-4">
                  <p>You've completed 5 assessments.</p>
                  {/* Completed assessment items would go here */}
                </div>
              </TabsContent>
              
              <TabsContent value="all">
                <div className="space-y-4">
                  <p>View all your assessments here.</p>
                  {/* All assessment items would go here */}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Assessment;
