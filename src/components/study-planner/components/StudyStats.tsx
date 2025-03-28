
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { StudyStatistics } from '../types';

interface StudyStatsProps {
  statistics: StudyStatistics;
}

const StudyStats: React.FC<StudyStatsProps> = ({ statistics }) => {
  if (statistics.totalSessionsCount === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No study sessions available yet. Add a session to start tracking your progress.
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">Completion Progress</span>
          <span className="text-sm font-medium">{statistics.completionPercentage}%</span>
        </div>
        <Progress value={statistics.completionPercentage} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{statistics.completedSessionsCount} completed</span>
          <span>{statistics.totalSessionsCount - statistics.completedSessionsCount} remaining</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="flex flex-col space-y-1 border rounded-md p-3">
          <div className="flex items-center text-sm font-medium">
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            Completion
          </div>
          <span className="text-2xl font-bold">{statistics.completionPercentage}%</span>
          <span className="text-xs text-muted-foreground">
            {statistics.completedSessionsCount} of {statistics.totalSessionsCount} sessions
          </span>
        </div>
        
        <div className="flex flex-col space-y-1 border rounded-md p-3">
          <div className="flex items-center text-sm font-medium">
            <Clock className="mr-2 h-4 w-4 text-blue-500" />
            Study Time
          </div>
          <span className="text-2xl font-bold">{Math.round(statistics.completedMinutes / 60)} hrs</span>
          <span className="text-xs text-muted-foreground">
            {statistics.completedMinutes} of {statistics.totalMinutes} minutes
          </span>
        </div>
        
        <div className="flex flex-col space-y-1 border rounded-md p-3">
          <div className="flex items-center text-sm font-medium">
            <Calendar className="mr-2 h-4 w-4 text-purple-500" />
            Next Session
          </div>
          {statistics.upcomingSessions.length > 0 ? (
            <>
              <span className="text-lg font-bold truncate">
                {statistics.upcomingSessions[0].title}
              </span>
              <span className="text-xs text-muted-foreground">
                {format(statistics.upcomingSessions[0].date, "MMM d, h:mm a")}
              </span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground pt-2">No upcoming sessions</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyStats;
