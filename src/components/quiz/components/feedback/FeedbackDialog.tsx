
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquarePlus, Flag, ThumbsUp } from 'lucide-react';

interface FeedbackDialogProps {
  questionId: string;
  questionText: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitFeedback: (feedback: {
    questionId: string;
    feedbackType: 'issue' | 'suggestion' | 'praise';
    feedbackText: string;
  }) => void;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  questionId,
  questionText,
  isOpen,
  onClose,
  onSubmitFeedback
}) => {
  const [feedbackType, setFeedbackType] = useState<'issue' | 'suggestion' | 'praise'>('suggestion');
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!feedbackText.trim()) {
      toast({
        title: "Feedback text required",
        description: "Please provide some details in your feedback",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    onSubmitFeedback({
      questionId,
      feedbackType,
      feedbackText: feedbackText.trim()
    });

    // Reset form
    setFeedbackText('');
    setFeedbackType('suggestion');
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Provide Question Feedback</DialogTitle>
          <DialogDescription>
            Help us improve our questions by providing feedback
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="bg-muted/50 p-3 rounded-md text-sm mb-4">
            <p className="font-medium mb-1">Question:</p>
            <p className="text-muted-foreground">{questionText}</p>
          </div>
          
          <div className="space-y-2">
            <Label>Feedback Type</Label>
            <RadioGroup
              value={feedbackType}
              onValueChange={(value) => setFeedbackType(value as 'issue' | 'suggestion' | 'praise')}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="issue" id="issue" />
                <Label htmlFor="issue" className="flex items-center gap-2">
                  <Flag className="h-4 w-4 text-destructive" />
                  Report an Issue
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="suggestion" id="suggestion" />
                <Label htmlFor="suggestion" className="flex items-center gap-2">
                  <MessageSquarePlus className="h-4 w-4 text-amber-500" />
                  Suggestion
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="praise" id="praise" />
                <Label htmlFor="praise" className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-green-500" />
                  Praise
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="feedback">Your Feedback</Label>
            <Textarea
              id="feedback"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder={
                feedbackType === 'issue' 
                  ? "Describe the issue with this question..." 
                  : feedbackType === 'suggestion'
                    ? "Share your suggestions for improvement..."
                    : "Tell us what you liked about this question..."
              }
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !feedbackText.trim()}
          >
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
