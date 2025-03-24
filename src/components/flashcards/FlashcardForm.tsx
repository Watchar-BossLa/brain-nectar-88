
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createFlashcard } from '@/services/flashcardService';
import { Flashcard } from '@/types/supabase';
import { useAuth } from '@/context/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FlashcardFormProps {
  onSuccess?: (flashcard: Flashcard) => void;
  flashcard?: Flashcard;
  topics?: Array<{ id: string; title: string }>;
}

const FlashcardForm: React.FC<FlashcardFormProps> = ({ 
  onSuccess, 
  flashcard,
  topics = []
}) => {
  const [frontContent, setFrontContent] = useState(flashcard?.front_content || '');
  const [backContent, setBackContent] = useState(flashcard?.back_content || '');
  const [topicId, setTopicId] = useState(flashcard?.topic_id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="front-content">Front (Question)</Label>
            <Textarea
              id="front-content"
              placeholder="Enter the question or prompt"
              value={frontContent}
              onChange={(e) => setFrontContent(e.target.value)}
              rows={3}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="back-content">Back (Answer)</Label>
            <Textarea
              id="back-content"
              placeholder="Enter the answer or explanation"
              value={backContent}
              onChange={(e) => setBackContent(e.target.value)}
              rows={3}
              required
            />
          </div>
          {topics.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="topic">Topic (Optional)</Label>
              <Select value={topicId} onValueChange={setTopicId}>
                <SelectTrigger id="topic">
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No topic</SelectItem>
                  {topics.map(topic => (
                    <SelectItem key={topic.id} value={topic.id}>
                      {topic.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : flashcard ? 'Update' : 'Create'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FlashcardForm;
