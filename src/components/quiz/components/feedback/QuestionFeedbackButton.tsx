
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import FeedbackDialog from './FeedbackDialog';

interface QuestionFeedbackButtonProps {
  questionId: string;
  questionText: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm';
}

const QuestionFeedbackButton: React.FC<QuestionFeedbackButtonProps> = ({
  questionId,
  questionText,
  variant = 'ghost',
  size = 'sm'
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmitFeedback = (feedback: {
    questionId: string;
    feedbackType: 'issue' | 'suggestion' | 'praise';
    feedbackText: string;
  }) => {
    // In a real app, we would save this to the database
    console.log('Feedback submitted:', feedback);
    
    // For now, we'll just show a toast notification
    toast({
      title: "Feedback received",
      description: "Thank you for helping us improve our questions!",
    });
  };

  return (
    <>
      <Button 
        variant={variant} 
        size={size}
        className="flex items-center gap-1"
        onClick={() => setIsDialogOpen(true)}
      >
        <MessageSquare className="h-4 w-4" />
        Feedback
      </Button>

      <FeedbackDialog
        questionId={questionId}
        questionText={questionText}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmitFeedback={handleSubmitFeedback}
      />
    </>
  );
};

export default QuestionFeedbackButton;
