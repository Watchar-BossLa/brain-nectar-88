import React, { useState, useEffect } from 'react';
import { useSpacedRepetition } from '@/services/spaced-repetition';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BarChart, 
  Calendar, 
  Clock, 
  Award, 
  TrendingUp,
  Flame,
  BarChart2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

/**
 * Study Statistics Component
 * Displays statistics about the user's study habits and performance
 * @returns {React.ReactElement} Study statistics component
 */
const StudyStats = () => {
  const { user } = useAuth();
  const spacedRepetition = useSpacedRepetition();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load statistics
  useEffect(() => {
    if (!user) return;
    
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await spacedRepetition.getLearningStats(user.id);
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Error loading study statistics:', err);
        setError(err.message || 'Failed to load study statistics');
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();
  }, [user, spacedRepetition]);
  
  // Render loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-48" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription>Failed to load study statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // Render no data state
  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Study Statistics</CardTitle>
          <CardDescription>No study data available yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Start reviewing cards to see your statistics.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Statistics</CardTitle>
        <CardDescription>Your learning performance and habits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Total Items */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-2">
              <BarChart className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total Items</p>
            <p className="text-2xl font-bold">{stats.totalItems}</p>
          </div>
          
          {/* Due Today */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-orange-100 p-3 rounded-full mb-2">
              <Calendar className="h-6 w-6 text-orange-500" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Due Today</p>
            <p className="text-2xl font-bold">{stats.dueToday}</p>
          </div>
          
          {/* Retention Score */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 p-3 rounded-full mb-2">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Retention</p>
            <p className="text-2xl font-bold">{Math.round(stats.retentionScore)}%</p>
          </div>
          
          {/* Current Streak */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-red-100 p-3 rounded-full mb-2">
              <Flame className="h-6 w-6 text-red-500" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Streak</p>
            <p className="text-2xl font-bold">{stats.streak} days</p>
          </div>
        </div>
        
        {/* Recent Sessions */}
        {stats.recentSessions && stats.recentSessions.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Recent Sessions</h3>
            <div className="space-y-3">
              {stats.recentSessions.slice(0, 3).map((session) => (
                <div key={session.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {session.item_count} items reviewed
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(session.end_time), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                      <span className="text-sm text-muted-foreground">
                        {Math.round(session.duration / 60)} min
                      </span>
                    </div>
                  </div>
                  
                  {session.metrics && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <Award className="h-4 w-4 text-muted-foreground mr-1" />
                        <span className="text-sm">
                          {Math.round(session.metrics.averageRating * 10) / 10} avg. rating
                        </span>
                      </div>
                      <div className="flex items-center">
                        <BarChart2 className="h-4 w-4 text-muted-foreground mr-1" />
                        <span className="text-sm">
                          {session.metrics.perfectCount} perfect recalls
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudyStats;
