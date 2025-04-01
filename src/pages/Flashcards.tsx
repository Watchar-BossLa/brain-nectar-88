import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFlashcardsPage } from '@/hooks/useFlashcardsPage';
import AddFlashcardForm from '@/components/flashcards/AddFlashcardForm';
import FlashcardGrid from '@/components/flashcards/FlashcardGrid';
import { deleteFlashcard } from '@/services/flashcardService';
import { useToast } from '@/components/ui/use-toast';
import AllFlashcardsTab from '@/components/flashcards/tabs/AllFlashcardsTab';
import DueFlashcardsTab from '@/components/flashcards/tabs/DueFlashcardsTab';
import ReviewFlashcardsTab from '@/components/flashcards/tabs/ReviewFlashcardsTab';
import FlashcardStatsOverview from '@/components/flashcards/stats/FlashcardStatsOverview';

const Flashcards = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const { 
    flashcards, 
    loading, 
    reloadFlashcards,
    dueFlashcards,
    stats
  } = useFlashcardsPage();

  const handleFlashcardDeleted = async (id: string) => {
    try {
      await deleteFlashcard(id);
      toast({
        title: "Flashcard deleted",
        description: "The flashcard has been successfully deleted.",
      });
      // Use reloadFlashcards instead of refreshFlashcards
      if (reloadFlashcards) {
        reloadFlashcards();
      }
    } catch (error) {
      console.error("Error deleting flashcard:", error);
      toast({
        title: "Error",
        description: "Failed to delete the flashcard.",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold">Your Flashcards</h1>
          <p className="text-muted-foreground">
            Manage and review your flashcards to improve retention.
          </p>
        </div>

        <FlashcardStatsOverview 
          total={stats?.total || 0}
          mastered={stats?.mastered || 0}
          learning={stats?.learning || 0}
          due={stats?.due || 0}
          isLoading={loading}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList>
            <TabsTrigger value="all">All Flashcards</TabsTrigger>
            <TabsTrigger value="due">Due Flashcards</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <AllFlashcardsTab 
              flashcards={flashcards || []} 
              loading={loading} 
              onDelete={handleFlashcardDeleted}
              onAddNew={() => setIsDialogOpen(true)}
              onFlashcardsUpdated={reloadFlashcards}
            />
          </TabsContent>
          <TabsContent value="due" className="mt-4">
            <DueFlashcardsTab 
              flashcards={dueFlashcards || []}
              loading={loading}
              onDelete={handleFlashcardDeleted}
              onAddNew={() => setIsDialogOpen(true)}
              onFlashcardsUpdated={reloadFlashcards}
            />
          </TabsContent>
          <TabsContent value="review" className="mt-4">
            <ReviewFlashcardsTab onComplete={reloadFlashcards} />
          </TabsContent>
        </Tabs>

        <AddFlashcardForm
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onFlashcardCreated={reloadFlashcards}
        />
      </div>
    </MainLayout>
  );
};

export default Flashcards;
