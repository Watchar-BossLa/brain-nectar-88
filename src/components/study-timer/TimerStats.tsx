
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Calendar, BarChart2 } from 'lucide-react';
import { TimerStatsProps } from '@/types/components/timer';
import { Skeleton } from '@/components/ui/skeleton';

const TimerStats: React.FC<TimerStatsProps> = ({
  isLoading,
  sessionsToday,
  totalMinutesToday,
  sessionsThisWeek,
  totalMinutesThisWeek,
  sessionsThisMonth,
  totalMinutesThisMonth
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      title: "Today",
      icon: Clock,
      sessions: sessionsToday,
      minutes: totalMinutesToday,
    },
    {
      title: "This Week",
      icon: Calendar,
      sessions: sessionsThisWeek,
      minutes: totalMinutesThisWeek,
    },
    {
      title: "This Month",
      icon: BarChart2,
      sessions: sessionsThisMonth,
      minutes: totalMinutesThisMonth,
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Your Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.title} className="flex flex-col space-y-1 p-4 border rounded-lg">
              <div className="flex items-center text-muted-foreground mb-1">
                <stat.icon className="h-4 w-4 mr-1" />
                <span className="text-sm">{stat.title}</span>
              </div>
              <div className="text-2xl font-bold">{stat.minutes} min</div>
              <div className="text-sm text-muted-foreground">
                {stat.sessions} {stat.sessions === 1 ? 'session' : 'sessions'}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimerStats;
