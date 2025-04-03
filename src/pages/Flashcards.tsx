
import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useFlashcardsPage } from '@/hooks/useFlashcardsPage';
import { deleteFlashcard } from '@/services/spacedRepetition';
import { convertToSupabaseFlashcard } from '@/components/flashcards/utils/flashcardTypeConverter';

// Component imports
import FlashcardStats from '@/components/flashcards/FlashcardStats';
import FlashcardsHeader from '@/components/flashcards/FlashcardsHeader';
import AllFlashcardsTab from '@/components/flashcards/tabs/AllFlashcardsTab';
import DueFlashcardsTab from '@/components/flashcards/tabs/DueFlashcardsTab';
import CreateFlashcardTab from '@/components/flashcards/tabs/CreateFlashcardTab';
import ReviewFlashcardsTab from '@/components/flashcards/tabs/ReviewFlashcardsTab';

const Flashcards = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  
  const {
    flashcards,
    dueFlashcards,
    stats,
    loading: isLoading,
    refreshFlashcards
  } = useFlashcardsPage();
  
  const { toast } = useToast();
  const [isAdvancedForm, setIsAdvancedForm] = useState(false);
  
  // Handle flashcard deletion
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

  // Handle updating stats after changes
  const handleUpdateStats = () => {
    refreshFlashcards();
  };

  // Create new flashcard
  const handleCreateFlashcard = () => {
    setIsCreating(true);
    setActiveTab('create');
  };

  // Handle flashcard creation completed
  const handleFlashcardCreated = () => {
    setIsCreating(false);
    setActiveTab('all');
    handleUpdateStats();
  };

  // Start flashcard review
  const handleStartReview = () => {
    setActiveTab('review');
  };

  // Create handlers for the different flashcard creation types
  const handleCreateSimpleFlashcard = () => {
    setIsAdvancedForm(false);
    handleCreateFlashcard();
  };

  const handleCreateAdvancedFlashcard = () => {
    setIsAdvancedForm(true);
    handleCreateFlashcard();
  };

  // Convert internal flashcard types to Supabase types for components
  const supabaseFlashcards = flashcards.map(convertToSupabaseFlashcard);
  const supaDueFlashcards = dueFlashcards.map(convertToSupabaseFlashcard);

  // Transform the stats to match the FlashcardStatsProps interface
  const displayStats = {
    totalCards: stats.totalCards || 0,
    masteredCards: stats.masteredCards || 0,
    dueCards: stats.dueCards || 0,
    reviewsToday: stats.reviewedToday || 0,
    averageDifficulty: stats.averageDifficulty || 0
  };

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        <FlashcardsHeader 
          isCreating={isCreating}
          onCreateSimpleFlashcard={handleCreateSimpleFlashcard}
          onCreateAdvancedFlashcard={handleCreateAdvancedFlashcard}
        />
        
        <FlashcardStats stats={displayStats} />
        
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
            <AllFlashcardsTab 
              isLoading={isLoading}
              flashcards={supabaseFlashcards}
              onDeleteFlashcard={handleDeleteFlashcard}
              onCardUpdated={handleUpdateStats}
              onCreateSimpleFlashcard={handleCreateSimpleFlashcard}
              onCreateAdvancedFlashcard={handleCreateAdvancedFlashcard}
            />
          </TabsContent>
          
          <TabsContent value="due" className="mt-6">
            <DueFlashcardsTab 
              flashcards={supaDueFlashcards}
              onStartReview={handleStartReview}
              onDeleteFlashcard={handleDeleteFlashcard}
              onCardUpdated={handleUpdateStats}
              onCreateSimpleFlashcard={handleCreateSimpleFlashcard}
              onCreateAdvancedFlashcard={handleCreateAdvancedFlashcard}
            />
          </TabsContent>
          
          <TabsContent value="create" className="mt-6">
            <CreateFlashcardTab 
              isAdvancedForm={isAdvancedForm}
              onFlashcardCreated={handleFlashcardCreated}
              onCancel={() => setIsCreating(false)}
            />
          </TabsContent>
          
          <TabsContent value="review" className="mt-6">
            <ReviewFlashcardsTab 
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
