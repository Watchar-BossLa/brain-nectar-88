
import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FlashcardCard from '@/components/flashcards/FlashcardCard';
import FlashcardForm from '@/components/flashcards/FlashcardForm';
import FlashcardGrid from '@/components/flashcards/FlashcardGrid';
import FlashcardReviewSystem from '@/components/flashcards/FlashcardReviewSystem';
import FlashcardStats from '@/components/flashcards/FlashcardStats';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserFlashcards, getDueFlashcards, getFlashcardStats } from '@/services/spacedRepetition';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle } from 'lucide-react';
import { useFlashcardsPage } from '@/hooks/useFlashcardsPage';

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
            <Button onClick={handleCreateFlashcard}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Flashcard
            </Button>
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
            ) : flashcards.length > 0 ? (
              <FlashcardGrid flashcards={flashcards} onCardUpdated={handleUpdateStats} />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center space-y-4 py-12">
                  <h3 className="text-lg font-medium">No flashcards yet</h3>
                  <p className="text-center text-sm text-muted-foreground max-w-md">
                    Start creating flashcards to help you learn and retain information more effectively with spaced repetition.
                  </p>
                  <Button onClick={handleCreateFlashcard}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Your First Flashcard
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="due" className="mt-6">
            {dueFlashcards.length > 0 ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Cards Due for Review</h3>
                  <Button onClick={handleStartReview}>Start Review</Button>
                </div>
                <FlashcardGrid flashcards={dueFlashcards} onCardUpdated={handleUpdateStats} />
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center space-y-4 py-12">
                  <h3 className="text-lg font-medium">No cards due for review</h3>
                  <p className="text-center text-sm text-muted-foreground max-w-md">
                    Great job! You've reviewed all your due flashcards. Check back later or create new cards.
                  </p>
                  <Button onClick={handleCreateFlashcard}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Flashcard
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="create" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Flashcard</CardTitle>
                <CardDescription>
                  Create a new flashcard to help you remember important information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FlashcardForm onFlashcardCreated={handleFlashcardCreated} />
              </CardContent>
            </Card>
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
