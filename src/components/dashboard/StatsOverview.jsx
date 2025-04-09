import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart2, Clock, Brain, Target, ArrowRight } from 'lucide-react';

/**
 * Stats Overview Component
 * Shows key learning statistics on the dashboard
 * 
 * @returns {React.ReactElement} Stats overview component
 */
const StatsOverview = () => {
  // In a real implementation, these would be fetched from an API
  const stats = {
    studyTime: {
      today: 45,
      week: 210,
      trend: '+15%'
    },
    retention: {
      rate: 85,
      items: 120,
      trend: '+5%'
    },
    streak: {
      current: 7,
      best: 14,
      trend: 'Consistent'
    },
    goals: {
      completed: 5,
      inProgress: 3,
      trend: '2 due soon'
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Learning Stats</h2>
        <Link to="/learning-analytics">
          <Button variant="ghost" size="sm" className="gap-1 text-primary">
            <span>View detailed analytics</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Study Time */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">Study Time</h3>
                </div>
                <div className="text-2xl font-bold">{stats.studyTime.today} min</div>
                <div className="text-sm text-muted-foreground">
                  {stats.studyTime.week} min this week
                </div>
              </div>
              <div className="text-xs font-medium text-green-500">
                {stats.studyTime.trend}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Retention Rate */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <h3 className="font-medium">Retention Rate</h3>
                </div>
                <div className="text-2xl font-bold">{stats.retention.rate}%</div>
                <div className="text-sm text-muted-foreground">
                  {stats.retention.items} items reviewed
                </div>
              </div>
              <div className="text-xs font-medium text-green-500">
                {stats.retention.trend}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Study Streak */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BarChart2 className="h-5 w-5 text-orange-500" />
                  <h3 className="font-medium">Study Streak</h3>
                </div>
                <div className="text-2xl font-bold">{stats.streak.current} days</div>
                <div className="text-sm text-muted-foreground">
                  Best: {stats.streak.best} days
                </div>
              </div>
              <div className="text-xs font-medium text-blue-500">
                {stats.streak.trend}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Learning Goals */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">Learning Goals</h3>
                </div>
                <div className="text-2xl font-bold">{stats.goals.completed} completed</div>
                <div className="text-sm text-muted-foreground">
                  {stats.goals.inProgress} in progress
                </div>
              </div>
              <div className="text-xs font-medium text-amber-500">
                {stats.goals.trend}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatsOverview;
