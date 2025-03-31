
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth';

const LearningPath = () => {
  const { user } = useAuth();
  
  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Learning Path</h1>
        <p className="text-muted-foreground mb-8">Your personalized learning journey through accounting concepts.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Personal Learning Path</CardTitle>
                <CardDescription>
                  Recommended topics and resources based on your progress and goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4 items-center p-4 border rounded-md">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <span className="font-bold text-xl text-primary">1</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Financial Accounting Basics</h3>
                      <p className="text-sm text-muted-foreground">Complete the core concepts module to build your foundation</p>
                    </div>
                    <Button>Start</Button>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4 items-center p-4 border rounded-md">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <span className="font-bold text-xl text-primary">2</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">The Accounting Equation</h3>
                      <p className="text-sm text-muted-foreground">Master the fundamental equation that drives all accounting</p>
                    </div>
                    <Button variant="outline">Continue</Button>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4 items-center p-4 border rounded-md opacity-70">
                    <div className="bg-muted p-3 rounded-full">
                      <span className="font-bold text-xl">3</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Financial Statements</h3>
                      <p className="text-sm text-muted-foreground">Learn to create and interpret financial statements</p>
                    </div>
                    <Button variant="ghost" disabled>Locked</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Learning Stats</CardTitle>
                <CardDescription>
                  Your progress across the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Topics Mastered</span>
                    <span className="text-sm font-bold">4/24</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: '16.67%' }}></div>
                  </div>
                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Daily Streak</span>
                      <span className="font-medium">3 days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Time Studied</span>
                      <span className="font-medium">12.5 hours</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Average Quiz Score</span>
                      <span className="font-medium">78%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LearningPath;
