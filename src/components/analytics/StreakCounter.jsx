import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame, Calendar, Trophy, Clock } from 'lucide-react';

/**
 * Streak Counter Component
 * Shows the user's current study streak and related stats
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Streak data
 * @param {string} props.title - Component title
 * @param {string} props.description - Component description
 * @returns {React.ReactElement} Streak counter component
 */
const StreakCounter = ({ 
  data = {}, 
  title = "Study Streak", 
  description = "Your consistent study habits" 
}) => {
  // If no data, show placeholder
  if (!data || Object.keys(data).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[100px] flex items-center justify-center">
            <p className="text-muted-foreground">No streak data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate progress to next milestone
  const nextMilestone = Math.ceil(data.current_streak / 10) * 10;
  const progressToNextMilestone = (data.current_streak / nextMilestone) * 100;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <Flame className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-3xl font-bold">{data.current_streak}</div>
              <div className="text-sm text-muted-foreground">day{data.current_streak !== 1 ? 's' : ''} streak</div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm font-medium">Next milestone: {nextMilestone} days</div>
            <Progress value={progressToNextMilestone} className="h-2 w-24 mt-1" />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="rounded-lg border p-3">
            <div className="flex items-center text-sm font-medium mb-1">
              <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
              <span>Best Streak</span>
            </div>
            <div className="text-lg font-bold">{data.best_streak} days</div>
          </div>
          
          <div className="rounded-lg border p-3">
            <div className="flex items-center text-sm font-medium mb-1">
              <Calendar className="h-4 w-4 mr-1 text-blue-500" />
              <span>Total Days</span>
            </div>
            <div className="text-lg font-bold">{data.total_study_days}</div>
          </div>
          
          <div className="rounded-lg border p-3">
            <div className="flex items-center text-sm font-medium mb-1">
              <Clock className="h-4 w-4 mr-1 text-green-500" />
              <span>Avg. Time</span>
            </div>
            <div className="text-lg font-bold">{data.average_study_time} min</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakCounter;
