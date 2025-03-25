
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { createFlashcard } from '@/services/spacedRepetition';
import { Flashcard } from '@/types/supabase';
import { useAuth } from '@/context/AuthContext';
import FlashcardPreview from './FlashcardPreview';
import FlashcardFormInputs from './FlashcardFormInputs';

interface FlashcardFormProps {
  onSuccess?: (flashcard: Flashcard) => void;
  onCancel?: () => void;
  flashcard?: Flashcard;
  topics?: Array<{ id: string; title: string }>;
}

const FlashcardForm: React.FC<FlashcardFormProps> = ({ 
  onSuccess, 
  onCancel,
  flashcard,
  topics = []
}) => {
  const [frontContent, setFrontContent] = useState(flashcard?.front_content || '');
  const [backContent, setBackContent] = useState(flashcard?.back_content || '');
  const [topicId, setTopicId] = useState(flashcard?.topic_id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useLatex, setUseLatex] = useState(
    flashcard?.front_content?.includes('$$') || flashcard?.back_content?.includes('$$') || false
  );
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create flashcards",
        variant: "destructive"
      });
      return;
    }

    if (!frontContent.trim() || !backContent.trim()) {
      toast({
        title: "Missing content",
        description: "Please fill out both sides of the flashcard",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await createFlashcard(
        frontContent, 
        backContent, 
        topicId || undefined
      );

      if (error || !data) {
        throw new Error(error?.message || "Failed to create flashcard");
      }

      toast({
        title: "Success",
        description: "Flashcard created successfully"
      });

      // Clear form
      setFrontContent('');
      setBackContent('');
      setTopicId('');

      // Call success callback
      if (onSuccess && data[0]) {
        onSuccess(data[0]);
      }
    } catch (error) {
      console.error("Error creating flashcard:", error);
      toast({
        title: "Error",
        description: "Failed to create flashcard. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{flashcard ? 'Edit Flashcard' : 'Create New Flashcard'}</CardTitle>
        <div className="flex items-center space-x-2 mt-2">
          <Switch 
            id="latex-toggle" 
            checked={useLatex} 
            onCheckedChange={setUseLatex}
          />
          <Label htmlFor="latex-toggle">Enable LaTeX for math formulas (use $$formula$$)</Label>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Tabs defaultValue="edit" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit" className="space-y-4">
              <FlashcardFormInputs
                frontContent={frontContent}
                setFrontContent={setFrontContent}
                backContent={backContent}
                setBackContent={setBackContent}
                topicId={topicId}
                setTopicId={setTopicId}
                topics={topics}
              />
            </TabsContent>
            
            <TabsContent value="preview">
              <FlashcardPreview 
                frontContent={frontContent}
                backContent={backContent}
                useLatex={useLatex}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : flashcard ? 'Update' : 'Create'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FlashcardForm;
