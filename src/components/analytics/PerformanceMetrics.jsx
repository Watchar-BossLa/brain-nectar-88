import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpRight, ArrowDownRight, Minus, Clock, Brain, Zap, Target } from 'lucide-react';

/**
 * Performance Metrics Component
 * Shows key performance metrics for learning
 * 
 * @param {Object} props - Component props
 * @param {Object} props.metrics - Performance metrics data
 * @param {string} props.title - Component title
 * @param {string} props.description - Component description
 * @returns {React.ReactElement} Performance metrics component
 */
const PerformanceMetrics = ({ 
  metrics = {}, 
  title = "Performance Metrics", 
  description = "Key metrics about your learning performance" 
}) => {
  // Get trend icon based on trend value
  const getTrendIcon = (trend) => {
    if (trend > 0) {
      return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    } else if (trend < 0) {
      return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    } else {
      return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  // If no metrics, show placeholder
  if (!metrics || Object.keys(metrics).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground">No metrics available</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="retention">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="retention" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span>Retention</span>
            </TabsTrigger>
            <TabsTrigger value="efficiency" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Efficiency</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>Goals</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="retention" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Retention Rate</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold">{metrics.retention_rate}%</span>
                    {getTrendIcon(metrics.retention_trend)}
                  </div>
                </div>
                <Progress value={metrics.retention_rate} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Review Accuracy</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold">{metrics.review_accuracy}%</span>
                    {getTrendIcon(metrics.accuracy_trend)}
                  </div>
                </div>
                <Progress value={metrics.review_accuracy} className="h-2" />
              </div>
            </div>
            
            <div className="pt-2">
              <h4 className="text-sm font-medium mb-2">Memory Strength</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground mb-1">Short-term</div>
                  <div className="text-lg font-bold">{metrics.short_term_memory}%</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground mb-1">Medium-term</div>
                  <div className="text-lg font-bold">{metrics.medium_term_memory}%</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground mb-1">Long-term</div>
                  <div className="text-lg font-bold">{metrics.long_term_memory}%</div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="efficiency" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Learning Speed</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold">{metrics.learning_speed} items/hr</span>
                    {getTrendIcon(metrics.speed_trend)}
                  </div>
                </div>
                <Progress value={metrics.learning_speed_percent} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Study Efficiency</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold">{metrics.study_efficiency}%</span>
                    {getTrendIcon(metrics.efficiency_trend)}
                  </div>
                </div>
                <Progress value={metrics.study_efficiency} className="h-2" />
              </div>
            </div>
            
            <div className="pt-2">
              <h4 className="text-sm font-medium mb-2">Time Distribution</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground mb-1">Learning</div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-lg font-bold">{metrics.learning_time}h</span>
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground mb-1">Reviewing</div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-lg font-bold">{metrics.review_time}h</span>
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground mb-1">Total</div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-lg font-bold">{metrics.total_time}h</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="goals" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Goal Completion Rate</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold">{metrics.goal_completion_rate}%</span>
                  {getTrendIcon(metrics.goal_trend)}
                </div>
              </div>
              <Progress value={metrics.goal_completion_rate} className="h-2" />
            </div>
            
            <div className="pt-2">
              <h4 className="text-sm font-medium mb-2">Goal Status</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground mb-1">Completed</div>
                  <div className="text-lg font-bold">{metrics.completed_goals}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground mb-1">In Progress</div>
                  <div className="text-lg font-bold">{metrics.in_progress_goals}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground mb-1">Upcoming</div>
                  <div className="text-lg font-bold">{metrics.upcoming_goals}</div>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <h4 className="text-sm font-medium mb-2">Current Focus</h4>
              <div className="rounded-lg border p-3">
                <div className="text-xs text-muted-foreground mb-1">Primary Goal</div>
                <div className="text-md font-medium">{metrics.primary_goal || 'No active goal'}</div>
                {metrics.primary_goal_progress !== undefined && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{metrics.primary_goal_progress}%</span>
                    </div>
                    <Progress value={metrics.primary_goal_progress} className="h-1.5" />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
