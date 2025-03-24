
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import FlashcardList from '@/components/flashcards/FlashcardList';
import FlashcardForm from '@/components/flashcards/FlashcardForm';
import SpacedRepetitionCard from '@/components/flashcards/SpacedRepetitionCard';
import FlashcardStats from '@/components/flashcards/FlashcardStats';
import ReviewNotificationCard from '@/components/flashcards/ReviewNotificationCard';
import { useFlashcardsPage } from '@/hooks/useFlashcardsPage';

const Flashcards = () => {
  const {
    activeTab,
    setActiveTab,
    isCreating,
    flashcards,
    dueFlashcards,
    currentReviewCard,
    isLoading,
    isReviewing,
    stats,
    handleCreateFlashcard,
    handleFlashcardCreated,
    handleStartReview,
    handleCompleteReview,
    handleUpdateStats,
    fetchFlashcards
  } = useFlashcardsPage();

  return (
    <MainLayout>
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Flashcards</h1>
            <Button onClick={handleCreateFlashcard} disabled={isCreating}>
              <Plus className="mr-2 h-4 w-4" /> Create Flashcard
            </Button>
          </div>
          
          {/* Stats Dashboard */}
          <FlashcardStats stats={stats} />
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Flashcards</TabsTrigger>
              <TabsTrigger value="review" disabled={isReviewing}>
                Review Due ({dueFlashcards.length})
              </TabsTrigger>
              <TabsTrigger value="create" disabled={!isCreating}>Create</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <ReviewNotificationCard 
                dueCount={dueFlashcards.length} 
                onStartReview={handleStartReview} 
              />
              
              <FlashcardList 
                onAddNew={handleCreateFlashcard}
                isLoading={isLoading}
                onFlashcardsUpdated={fetchFlashcards}
              />
            </TabsContent>
            
            <TabsContent value="review">
              {isReviewing && currentReviewCard && (
                <SpacedRepetitionCard 
                  flashcard={currentReviewCard}
                  onComplete={handleCompleteReview}
                  onUpdateStats={handleUpdateStats}
                />
              )}
            </TabsContent>
            
            <TabsContent value="create">
              {isCreating && (
                <FlashcardForm 
                  onSuccess={handleFlashcardCreated}
                  onCancel={() => {
                    setActiveTab('all');
                  }}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Flashcards;
