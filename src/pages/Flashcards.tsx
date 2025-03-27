import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FlashcardForm from '@/components/flashcards/FlashcardForm';
import FlashcardGrid from '@/components/flashcards/FlashcardGrid';
import FlashcardReviewSystem from '@/components/flashcards/FlashcardReviewSystem';
import FlashcardStats from '@/components/flashcards/FlashcardStats';
import AdvancedFlashcardForm from '@/components/flashcards/AdvancedFlashcardForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { deleteFlashcard } from '@/services/spacedRepetition';
import { Loader2, PlusCircle, Calculator, BookText, Brain } from 'lucide-react';
import { useFlashcardsPage } from '@/hooks/useFlashcardsPage';
import { useToast } from '@/components/ui/use-toast';
import { Flashcard as SupabaseFlashcard } from '@/types/supabase';

const convertToSupabaseFlashcard = (flashcard: any): SupabaseFlashcard => {
  return {
    id: flashcard.id,
    user_id: flashcard.user_id || '',
    topic_id: flashcard.topicId || null,
    front_content: flashcard.front || flashcard.front_content || '',
    back_content: flashcard.back || flashcard.back_content || '',
    difficulty: flashcard.difficulty || 0,
    next_review_date: flashcard.next_review_date || new Date().toISOString(),
    repetition_count: flashcard.repetitionCount || 0,
    mastery_level: flashcard.mastery_level || 0,
    created_at: flashcard.created_at || new Date().toISOString(),
    updated_at: flashcard.updated_at || new Date().toISOString(),
    easiness_factor: flashcard.easinessFactor || 2.5,
    last_retention: flashcard.last_retention || 0,
    last_reviewed_at: flashcard.last_reviewed_at || null
  };
};

const Flashcards = () => {
  const {
    activeTab,
    setActiveTab,
    isCreating,
    setIsCreating,
    flashcards,
    dueFlashcards,
    isLoading,
    stats,
    handleCreateFlashcard,
    handleFlashcardCreated,
    handleStartReview,
    handleUpdateStats
  } = useFlashcardsPage();
  
  const { toast } = useToast();
  const [isAdvancedForm, setIsAdvancedForm] = useState(false);
  
  const handleDeleteFlashcard = async (id: string) => {
    try {
      const { error } = await deleteFlashcard(id);
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Flashcard deleted successfully.'
      });
      
      handleUpdateStats();
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete flashcard',
        variant: 'destructive'
      });
    }
  };

  const supabaseFlashcards = flashcards.map(convertToSupabaseFlashcard);
  const supaDueFlashcards = dueFlashcards.map(convertToSupabaseFlashcard);

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Flashcards</h2>
            <p className="text-muted-foreground">
              Create and review flashcards with spaced repetition
            </p>
          </div>
          {!isCreating && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => {
                setIsAdvancedForm(false); 
                handleCreateFlashcard();
              }}>
                <BookText className="mr-2 h-4 w-4" />
                Simple Flashcard
              </Button>
              <Button onClick={() => {
                setIsAdvancedForm(true);
                handleCreateFlashcard();
              }}>
                <Calculator className="mr-2 h-4 w-4" />
                Advanced Flashcard
              </Button>
            </div>
          )}
        </div>
        
        <FlashcardStats stats={stats} />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Cards</TabsTrigger>
            <TabsTrigger value="due" disabled={dueFlashcards.length === 0}>
              Due ({dueFlashcards.length})
            </TabsTrigger>
            <TabsTrigger value="create" disabled={!isCreating}>Create</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : supabaseFlashcards.length > 0 ? (
              <FlashcardGrid 
                flashcards={supabaseFlashcards} 
                onDelete={handleDeleteFlashcard}
                onCardUpdated={handleUpdateStats} 
              />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center space-y-4 py-12">
                  <h3 className="text-lg font-medium">No flashcards yet</h3>
                  <p className="text-center text-sm text-muted-foreground max-w-md">
                    Start creating flashcards to help you learn and retain information more effectively with spaced repetition.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={() => {
                      setIsAdvancedForm(false); 
                      handleCreateFlashcard();
                    }}>
                      <BookText className="mr-2 h-4 w-4" />
                      Simple Flashcard
                    </Button>
                    <Button onClick={() => {
                      setIsAdvancedForm(true);
                      handleCreateFlashcard();
                    }}>
                      <Calculator className="mr-2 h-4 w-4" />
                      Advanced Flashcard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="due" className="mt-6">
            {supaDueFlashcards.length > 0 ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Cards Due for Review</h3>
                  <Button onClick={handleStartReview}>
                    <Brain className="mr-2 h-4 w-4" />
                    Start Review
                  </Button>
                </div>
                <FlashcardGrid 
                  flashcards={supaDueFlashcards} 
                  onDelete={handleDeleteFlashcard}
                  onCardUpdated={handleUpdateStats} 
                />
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center space-y-4 py-12">
                  <h3 className="text-lg font-medium">No cards due for review</h3>
                  <p className="text-center text-sm text-muted-foreground max-w-md">
                    Great job! You've reviewed all your due flashcards. Check back later or create new cards.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={() => {
                      setIsAdvancedForm(false); 
                      handleCreateFlashcard();
                    }}>
                      <BookText className="mr-2 h-4 w-4" />
                      Simple Flashcard
                    </Button>
                    <Button onClick={() => {
                      setIsAdvancedForm(true);
                      handleCreateFlashcard();
                    }}>
                      <Calculator className="mr-2 h-4 w-4" />
                      Advanced Flashcard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="create" className="mt-6">
            {isAdvancedForm ? (
              <AdvancedFlashcardForm 
                onSuccess={handleFlashcardCreated} 
                onCancel={() => setIsCreating(false)}
              />
            ) : (
              <Card>
                <CardContent className="py-6">
                  <FlashcardForm onFlashcardCreated={handleFlashcardCreated} />
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="review" className="mt-6">
            <FlashcardReviewSystem 
              onComplete={() => {
                handleUpdateStats();
                setActiveTab('all');
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Flashcards;
