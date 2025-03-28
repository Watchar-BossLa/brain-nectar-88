
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { format, isToday, isAfter } from 'date-fns';
import { StudyStatistics } from '../types';

interface StudyStatsProps {
  statistics: StudyStatistics;
}

const StudyStats: React.FC<StudyStatsProps> = ({ statistics }) => {
  const {
    completedSessionsCount,
    totalSessionsCount,
    completionPercentage,
    completedMinutes,
    totalMinutes,
    upcomingSessions
  } = statistics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="rounded-lg border p-3">
        <div className="text-sm font-medium text-muted-foreground mb-1">Completed</div>
        <div className="text-2xl font-bold">{completedSessionsCount}/{totalSessionsCount}</div>
        <Progress className="h-2 mt-2" value={completionPercentage} />
      </div>
      
      <div className="rounded-lg border p-3">
        <div className="text-sm font-medium text-muted-foreground mb-1">Study time</div>
        <div className="text-2xl font-bold">{Math.round(completedMinutes / 60)} hrs</div>
        <div className="text-xs text-muted-foreground mt-1">
          of {Math.round(totalMinutes / 60)} hrs planned
        </div>
      </div>
      
      <div className="rounded-lg border p-3">
        <div className="text-sm font-medium text-muted-foreground mb-1">Next session</div>
        {upcomingSessions.length > 0 ? (
          <>
            <div className="font-medium truncate">{upcomingSessions[0].title}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {format(upcomingSessions[0].date, "MMM d, h:mm a")}
            </div>
          </>
        ) : (
          <div className="text-sm">No upcoming sessions</div>
        )}
      </div>
    </div>
  );
};

export default StudyStats;
