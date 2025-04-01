
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { createFlashcard } from "@/services/spacedRepetition";
import { useAuth } from "@/context/auth";

interface AddFlashcardFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFlashcardCreated: () => void;
}

const AddFlashcardForm: React.FC<AddFlashcardFormProps> = ({ 
  open, 
  onOpenChange,
  onFlashcardCreated
}) => {
  const [frontContent, setFrontContent] = useState('');
  const [backContent, setBackContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!frontContent || !backContent) {
      toast({
        title: "Missing fields",
        description: "Please fill in both the front and back of the flashcard.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be signed in to create flashcards.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { data, error } = await createFlashcard(
        user.id, 
        frontContent, 
        backContent
      );
      
      if (error) throw error;
      
      toast({
        title: "Flashcard created",
        description: "Your flashcard has been successfully created.",
      });
      
      setFrontContent('');
      setBackContent('');
      onOpenChange(false);
      onFlashcardCreated();
      
    } catch (error) {
      console.error("Error creating flashcard:", error);
      toast({
        title: "Error",
        description: "Failed to create flashcard. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a new flashcard</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="front" className="text-sm font-medium">
              Front (Question)
            </label>
            <Textarea
              id="front"
              placeholder="Enter the question or prompt"
              value={frontContent}
              onChange={(e) => setFrontContent(e.target.value)}
              className="min-h-[100px]"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="back" className="text-sm font-medium">
              Back (Answer)
            </label>
            <Textarea
              id="back"
              placeholder="Enter the answer"
              value={backContent}
              onChange={(e) => setBackContent(e.target.value)}
              className="min-h-[100px]"
              disabled={isSubmitting}
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Flashcard'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFlashcardForm;
