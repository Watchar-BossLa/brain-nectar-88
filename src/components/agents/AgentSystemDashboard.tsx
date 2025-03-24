
import React, { useEffect, useState } from 'react';
import { useMultiAgentSystem } from '@/hooks/useMultiAgentSystem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  BookOpen, 
  FileText, 
  PenTool, 
  Zap, 
  MessageSquare, 
  Layout, 
  Calendar 
} from 'lucide-react';

const agentIcons = {
  'COGNITIVE_PROFILE': Brain,
  'LEARNING_PATH': BookOpen,
  'CONTENT_ADAPTATION': FileText,
  'ASSESSMENT': PenTool,
  'ENGAGEMENT': Zap,
  'FEEDBACK': MessageSquare,
  'UI_UX': Layout,
  'SCHEDULING': Calendar
};

const AgentSystemDashboard = () => {
  const { isInitialized, systemState, submitTask, TaskTypes } = useMultiAgentSystem();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleGenerateLearningPath = async () => {
    if (!isInitialized) {
      toast({
        title: 'System not ready',
        description: 'The multi-agent system is still initializing.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await submitTask(
        TaskTypes.LEARNING_PATH_GENERATION,
        'Generate a personalized learning path',
        { qualificationId: 'sample-qualification-id' },
        'HIGH'
      );
      
      toast({
        title: 'Task submitted',
        description: 'Your personalized learning path is being generated.',
      });
    } catch (error) {
      console.error('Error submitting task:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit task. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-primary" />
            Master Control Program
          </CardTitle>
          <CardDescription>
            Autonomous multi-agent system status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">System Status</span>
              <Badge variant={isInitialized ? "default" : "outline"}>
                {isInitialized ? 'Active' : 'Initializing...'}
              </Badge>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Active Agents</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {systemState?.activeAgents.map(agent => {
                  const Icon = agentIcons[agent as keyof typeof agentIcons] || Brain;
                  return (
                    <div 
                      key={agent} 
                      className="flex items-center p-2 bg-muted/50 rounded-md text-xs"
                    >
                      <Icon className="h-3.5 w-3.5 mr-1.5 text-primary" />
                      {agent.replace('_', ' ')}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="mt-4">
              <Button 
                onClick={handleGenerateLearningPath} 
                disabled={!isInitialized || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Generate Learning Path'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {systemState?.metrics && Object.entries(systemState.metrics).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}
                  </span>
                  <span className="font-medium">
                    {typeof value === 'number' ? (value * 100).toFixed(0) + '%' : value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-center text-sm text-muted-foreground">
                Activity log will appear here as you interact with the system.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentSystemDashboard;
