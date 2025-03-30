
import { useState } from 'react';
import { useMultiAgentSystem } from '@/hooks/useMultiAgentSystem';
import { useToast } from '@/components/ui/use-toast';
import { QuizQuestion } from '@/types/quiz';
import { AssessmentService } from '@/services/agents/assessment/assessmentService';

export function useAssessmentGeneration() {
  const { submitTask, TaskTypes } = useMultiAgentSystem();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQuestions = async (
    topics: string[],
    options?: {
      difficulty?: 1 | 2 | 3;
      questionCount?: number;
      previousPerformance?: any[];
    }
  ): Promise<QuizQuestion[] | null> => {
    if (!submitTask || !TaskTypes) {
      toast({
        title: 'System Not Ready',
        description: 'The assessment system is not initialized.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      setIsGenerating(true);
      
      // Instead of relying on the submitTask to return the assessment data directly,
      // we'll use the AssessmentService to generate the questions
      const userId = 'current-user'; // In a real implementation, get this from auth context
      
      const result = await AssessmentService.generateAssessment(userId, {
        topics,
        difficulty: options?.difficulty || 2,
        questionCount: options?.questionCount || 10,
        previousPerformance: options?.previousPerformance || []
      });

      if (result.status === 'success' && result.data?.assessment?.questions) {
        toast({
          title: 'Questions Generated',
          description: `${result.data.assessment.questions.length} questions have been prepared for your assessment.`,
        });
        
        return result.data.assessment.questions;
      }
      
      throw new Error('Failed to generate questions');
    } catch (error) {
      console.error('Error generating questions:', error);
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

  return {
    generateQuestions,
    isGenerating
  };
}
