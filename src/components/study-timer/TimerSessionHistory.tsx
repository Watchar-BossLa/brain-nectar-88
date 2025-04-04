
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimerSessionHistoryProps } from '@/types/components/timer';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, Clock } from 'lucide-react';

const TimerSessionHistory: React.FC<TimerSessionHistoryProps> = ({ 
  isLoading, 
  sessions 
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between border-b pb-3">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-center">
            <div>
              <Clock className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <p className="mt-2 text-lg font-medium">No sessions yet</p>
              <p className="text-sm text-muted-foreground">
                Start a study session to track your progress
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recent Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
              <div>
                <p className="font-medium">
                  {session.durationMinutes} minute session
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(session.startTime), 'MMM d, yyyy • h:mm a')}
                </p>
              </div>
              <div className="flex items-center">
                {session.completed ? (
                  <div className="flex items-center text-green-500">
                    <Check className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                ) : (
                  <div className="flex items-center text-amber-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">In Progress</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimerSessionHistory;
