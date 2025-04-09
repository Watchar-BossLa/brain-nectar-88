import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Target, Clock, CheckCircle2, Plus } from 'lucide-react';

/**
 * Daily Study Goal Component
 * Shows progress towards daily study goals
 * 
 * @returns {React.ReactElement} Daily study goal component
 */
const DailyStudyGoal = () => {
  // In a real implementation, these would be fetched from an API
  const goals = {
    daily: {
      target: 60, // minutes
      current: 45,
      progress: 75 // percentage
    },
    items: {
      target: 20,
      completed: 15,
      progress: 75 // percentage
    },
    streak: 7 // days
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Daily Study Goal</CardTitle>
            <CardDescription>Track your daily learning progress</CardDescription>
          </div>
          <Target className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Time Goal */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>Study Time</span>
              </div>
              <span>{goals.daily.current} / {goals.daily.target} min</span>
            </div>
            <Progress value={goals.daily.progress} className="h-2" />
          </div>
          
          {/* Items Goal */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>Items Completed</span>
              </div>
              <span>{goals.items.completed} / {goals.items.target}</span>
            </div>
            <Progress value={goals.items.progress} className="h-2" />
          </div>
          
          {/* Streak */}
          <div className="bg-muted/50 rounded-lg p-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Current Streak</div>
              <div className="text-2xl font-bold">{goals.streak} days</div>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Target className="h-5 w-5 text-primary" />
            </div>
          </div>
          
          {/* Add Goal Button */}
          <Button variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add New Goal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyStudyGoal;
