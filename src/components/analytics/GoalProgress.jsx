import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, Calendar, Clock, CheckCircle2 } from 'lucide-react';

/**
 * Goal Progress Component
 * Shows progress towards learning goals
 * 
 * @param {Object} props - Component props
 * @param {Array} props.goals - Goals data
 * @param {string} props.title - Component title
 * @param {string} props.description - Component description
 * @returns {React.ReactElement} Goal progress component
 */
const GoalProgress = ({ 
  goals = [], 
  title = "Learning Goals", 
  description = "Track progress towards your learning goals" 
}) => {
  // If no goals, show placeholder
  if (!goals || goals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[150px] flex items-center justify-center">
            <p className="text-muted-foreground">No goals available</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Get priority badge
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="default">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Calculate days remaining
  const getDaysRemaining = (dateString) => {
    const targetDate = new Date(dateString);
    const today = new Date();
    
    // Reset time part for accurate day calculation
    targetDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal, index) => (
            <div key={goal.id || index} className="rounded-lg border p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="font-medium">{goal.title}</h3>
                </div>
                {getPriorityBadge(goal.priority)}
              </div>
              
              {goal.description && (
                <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
              )}
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-3">
                {goal.target_date && (
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>
                      {formatDate(goal.target_date)}
                      {getDaysRemaining(goal.target_date) > 0 && (
                        <span className="text-xs text-muted-foreground ml-1">
                          ({getDaysRemaining(goal.target_date)} days left)
                        </span>
                      )}
                    </span>
                  </div>
                )}
                
                {goal.estimated_time && (
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{goal.estimated_time} hours estimated</span>
                  </div>
                )}
                
                {goal.completed_items !== undefined && goal.total_items !== undefined && (
                  <div className="flex items-center text-sm">
                    <CheckCircle2 className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{goal.completed_items} of {goal.total_items} items completed</span>
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

export default GoalProgress;
