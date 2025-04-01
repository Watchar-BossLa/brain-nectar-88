
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { createFlashcard } from '@/services/spacedRepetition';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth';

interface FlashcardFormProps {
  onFlashcardCreated?: () => void;
}

const FlashcardForm: React.FC<FlashcardFormProps> = ({ onFlashcardCreated }) => {
  const [frontContent, setFrontContent] = useState('');
  const [backContent, setBackContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!frontContent || !backContent) {
      toast({
        title: 'Error',
        description: 'Both front and back content are required.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create flashcards.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create the flashcard with front and back content
      await createFlashcard(user.id, frontContent, backContent);
      
      toast({
        title: 'Success',
        description: 'Flashcard created successfully.',
      });
      
      setFrontContent('');
      setBackContent('');
      
      if (onFlashcardCreated) {
        onFlashcardCreated();
      }
    } catch (error) {
      console.error('Error creating flashcard:', error);
      toast({
        title: 'Error',
        description: 'Failed to create flashcard. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="frontContent">Front Content</Label>
        <Textarea
          id="frontContent"
          placeholder="Question or prompt"
          value={frontContent}
          onChange={(e) => setFrontContent(e.target.value)}
          required
          disabled={isSubmitting}
          className="min-h-20"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="backContent">Back Content</Label>
        <Textarea
          id="backContent"
          placeholder="Answer or explanation"
          value={backContent}
          onChange={(e) => setBackContent(e.target.value)}
          required
          disabled={isSubmitting}
          className="min-h-20"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
            Creating Flashcard...
          </div>
        ) : (
          'Create Flashcard'
        )}
      </Button>
    </form>
  );
};

export default FlashcardForm;
