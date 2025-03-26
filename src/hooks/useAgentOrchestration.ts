
import { useState } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/components/ui/use-toast';
import { agentOrchestrator } from '@/services/agents/orchestration/agentOrchestrator';

/**
 * Hook for using the agent orchestration system in components
 */
export function useAgentOrchestration() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPending, setIsPending] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, any>>({});
  
  /**
   * Generate an adaptive learning path
   */
  const generateLearningPath = async (
    qualificationId: string,
    options?: {
      priorityTopics?: string[];
      timeConstraint?: number;
      complexityPreference?: 'basic' | 'standard' | 'advanced';
    }
  ) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to generate a learning path.",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      setIsPending(prev => ({ ...prev, learningPath: true }));
      
      const result = await agentOrchestrator.generateAdaptiveLearningPath(
        user.id,
        qualificationId,
        options
      );
      
      setResults(prev => ({ ...prev, learningPath: result }));
      
      toast({
        title: "Learning Path Generation Started",
        description: "Your personalized learning path is being created.",
      });
      
      return result;
    } catch (error) {
      console.error("Error generating learning path:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate your learning path. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsPending(prev => ({ ...prev, learningPath: false }));
    }
  };
  
  /**
   * Create an adaptive assessment
   */
  const createAdaptiveAssessment = async (
    topicIds: string[],
    options?: {
      initialDifficulty?: number;
      adaptationRate?: number;
      questionCount?: number;
      timeLimit?: number;
    }
  ) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create an assessment.",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      setIsPending(prev => ({ ...prev, assessment: true }));
      
      const result = await agentOrchestrator.createAdaptiveAssessment(
        user.id,
        topicIds,
        options
      );
      
      setResults(prev => ({ ...prev, assessment: result }));
      
      toast({
        title: "Assessment Generation Started",
        description: "Your adaptive assessment is being created.",
      });
      
      return result;
    } catch (error) {
      console.error("Error creating assessment:", error);
      toast({
        title: "Assessment Failed",
        description: "Failed to create your assessment. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsPending(prev => ({ ...prev, assessment: false }));
    }
  };
  
  /**
   * Optimize study schedule
   */
  const optimizeStudySchedule = async (
    options?: {
      dailyAvailableTime?: number;
      priorityTopics?: string[];
      startDate?: string;
      endDate?: string;
      goalDate?: string;
    }
  ) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to optimize your study schedule.",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      setIsPending(prev => ({ ...prev, schedule: true }));
      
      const result = await agentOrchestrator.optimizeStudySchedule(
        user.id,
        options
      );
      
      setResults(prev => ({ ...prev, schedule: result }));
      
      toast({
        title: "Schedule Optimization Started",
        description: "Your optimized study schedule is being created.",
      });
      
      return result;
    } catch (error) {
      console.error("Error optimizing schedule:", error);
      toast({
        title: "Optimization Failed",
        description: "Failed to optimize your schedule. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsPending(prev => ({ ...prev, schedule: false }));
    }
  };
  
  return {
    isPending,
    results,
    generateLearningPath,
    createAdaptiveAssessment,
    optimizeStudySchedule
  };
}
