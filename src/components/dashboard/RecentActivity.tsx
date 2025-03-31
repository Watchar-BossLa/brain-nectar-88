
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Clock, Award, BarChart2 } from 'lucide-react';

// Mock activity data
const recentActivities = [
  { 
    id: 1, 
    type: 'quiz', 
    title: 'Accounting Fundamentals Quiz', 
    description: 'Completed with 85% score',
    icon: <BarChart2 className="h-4 w-4" />,
    timestamp: '2 hours ago' 
  },
  { 
    id: 2, 
    type: 'study', 
    title: 'Double-Entry Bookkeeping', 
    description: 'Completed study session',
    icon: <BookOpen className="h-4 w-4" />,
    timestamp: '5 hours ago' 
  },
  { 
    id: 3, 
    type: 'achievement', 
    title: 'First Perfect Quiz', 
    description: 'Earned new achievement',
    icon: <Award className="h-4 w-4" />,
    timestamp: 'Yesterday' 
  },
  { 
    id: 4, 
    type: 'study', 
    title: 'Financial Statements', 
    description: 'Started new topic',
    icon: <BookOpen className="h-4 w-4" />,
    timestamp: '2 days ago' 
  },
];

const RecentActivity = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-3 border-b">
                <div className="mt-0.5 p-1.5 bg-primary/10 rounded-full text-primary">
                  {activity.icon}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="font-medium">{activity.title}</div>
                  <div className="text-sm text-muted-foreground">{activity.description}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {activity.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
