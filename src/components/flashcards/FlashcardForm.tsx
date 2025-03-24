
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createFlashcard } from '@/services/spacedRepetition';
import { Flashcard } from '@/types/supabase';
import { useAuth } from '@/context/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FlashcardFormProps {
  onSuccess?: (flashcard: Flashcard) => void;
  onFlashcardCreated?: () => void;
  onCancel?: () => void;
  flashcard?: Flashcard;
  topics?: Array<{ id: string; title: string }>;
}

const FlashcardForm: React.FC<FlashcardFormProps> = ({ 
  onSuccess, 
  onFlashcardCreated,
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
  const [previewTab, setPreviewTab] = useState<'front' | 'back'>('front');
  const { toast } = useToast();
  const { user } = useAuth();

  // Helper function to render LaTeX and plain text content
  const renderContent = (content: string) => {
    if (!useLatex) return content;
    
    // Replace $$formula$$ with LaTeX rendered formula
    const parts = content.split(/(\\?\$\$[^$]*\$\$)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const formula = part.slice(2, -2);
        try {
          return <InlineMath key={index} math={formula} />;
        } catch (error) {
          console.error('LaTeX rendering error:', error);
          return <span key={index} className="text-red-500">{part}</span>;
        }
      }
      return <span key={index}>{part}</span>;
    });
  };

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
        user.id,
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

      // Call success callbacks
      if (onSuccess && data[0]) {
        onSuccess(data[0]);
      }
      
      if (onFlashcardCreated) {
        onFlashcardCreated();
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
              <div className="space-y-2">
                <Label htmlFor="front-content">Front (Question)</Label>
                <Textarea
                  id="front-content"
                  placeholder="Enter the question or prompt (use $$formula$$ for math formulas)"
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
                  placeholder="Enter the answer or explanation (use $$formula$$ for math formulas)"
                  value={backContent}
                  onChange={(e) => setBackContent(e.target.value)}
                  rows={3}
                  required
                />
              </div>
            </TabsContent>
            
            <TabsContent value="preview">
              <div className="border rounded-md p-4 mb-4">
                <Tabs defaultValue="front">
                  <TabsList>
                    <TabsTrigger value="front">Front</TabsTrigger>
                    <TabsTrigger value="back">Back</TabsTrigger>
                  </TabsList>
                  <TabsContent value="front" className="min-h-[100px] pt-4">
                    {renderContent(frontContent) || <span className="text-muted-foreground">Question preview will appear here</span>}
                  </TabsContent>
                  <TabsContent value="back" className="min-h-[100px] pt-4">
                    {renderContent(backContent) || <span className="text-muted-foreground">Answer preview will appear here</span>}
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>
          </Tabs>
          
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
