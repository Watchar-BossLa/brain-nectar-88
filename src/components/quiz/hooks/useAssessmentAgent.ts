
import { useState } from 'react';
import { useMultiAgentSystem } from '@/hooks/useMultiAgentSystem';
import { useToast } from '@/components/ui/use-toast';
import { TaskTypes } from '@/hooks/multiAgentSystem/useTaskSubmission';

export function useAssessmentAgent() {
  const { submitTask, isInitialized } = useMultiAgentSystem();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  /**
   * Request the assessment agent to generate adaptive questions
   */
  const generateAdaptiveQuestions = async (
    topicIds: string[],
    options?: {
      difficulty?: 1 | 2 | 3;
      count?: number;
      adaptationRate?: number;
    }
  ) => {
    if (!isInitialized()) {
      toast({
        title: 'System Not Ready',
        description: 'The assessment system is not initialized yet.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      setIsGenerating(true);
      
      // Submit task to the multi-agent system
      const result = await submitTask(TaskTypes.ASSESSMENT_GENERATION, { 
        topicIds,
        difficulty: options?.difficulty || 2,
        count: options?.count || 10,
        adaptationRate: options?.adaptationRate || 0.5
      });
      
      if (result) {
        // In a real implementation, we would fetch the generated questions
        // For now, we'll just use a simulated response
        toast({
          title: 'Questions Generated',
          description: `${options?.count || 10} questions have been prepared for your assessment.`,
        });
        
        // In a production environment, this would be replaced with actual data from the agent
        setGeneratedQuestions([
          // This would be filled with actual questions from the agent
        ]);
        
        return result;
      }
      
      return null;
    } catch (error) {
      console.error('Error generating adaptive questions:', error);
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate assessment questions. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Submit quiz results to be analyzed by the assessment agent
   */
  const submitQuizResults = async (results: any) => {
    if (!isInitialized()) {
      toast({
        title: 'System Not Ready',
        description: 'The assessment system is not initialized yet.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      const result = await submitTask(TaskTypes.ASSESSMENT_GENERATION, { 
        action: 'analyze',
        results
      });
      
      if (result) {
        toast({
          title: 'Results Analyzed',
          description: 'Your performance has been analyzed and added to your learning profile.',
        });
        return result;
      }
      
      return null;
    } catch (error) {
      console.error('Error submitting quiz results:', error);
      toast({
        title: 'Submission Failed',
        description: 'Failed to submit quiz results. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  };

  return {
    isGenerating,
    generatedQuestions,
    generateAdaptiveQuestions,
    submitQuizResults
  };
}
