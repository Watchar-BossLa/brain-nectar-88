
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the chart
const progressData = [
  { day: 'Mon', hours: 1.5 },
  { day: 'Tue', hours: 2.0 },
  { day: 'Wed', hours: 0.5 },
  { day: 'Thu', hours: 1.8 },
  { day: 'Fri', hours: 1.2 },
  { day: 'Sat', hours: 3.0 },
  { day: 'Sun', hours: 2.2 },
];

const StudyProgress = () => {
  // Calculate completion percentage
  const weeklyGoal = 12; // hours
  const totalHours = progressData.reduce((sum, day) => sum + day.hours, 0);
  const completionPercentage = Math.round((totalHours / weeklyGoal) * 100);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Study Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Weekly Goal</span>
              <span className="text-sm text-muted-foreground">{totalHours}/{weeklyGoal} hours</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
          
          <div className="h-[180px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyProgress;
