
import React, { useState } from 'react';
import { useAuth } from '@/context/auth';
import MainLayout from '@/layouts/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { removeFlashcard } from '@/services/spacedRepetition';
import FlashcardsHeader from '@/components/flashcards/FlashcardsHeader';
import FlashcardForm from '@/components/flashcards/FlashcardForm';
import FlashcardList from '@/components/flashcards/FlashcardList';
import AdvancedFlashcardForm from '@/components/flashcards/AdvancedFlashcardForm';
import ReviewFlashcardsTab from '@/components/flashcards/tabs/ReviewFlashcardsTab';

/**
 * Flashcards Page
 * 
 * Allows users to create, review, and manage flashcards.
 */
const FlashcardsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('create');
  const [isCreating, setIsCreating] = useState(false);

  const handleDeleteFlashcard = async (flashcardId: string) => {
    if (!user) {
      toast({
        title: 'Not authenticated.',
        description: 'You must be logged in to delete flashcards.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await removeFlashcard(flashcardId);
      toast({
        title: 'Flashcard deleted.',
        description: 'The flashcard has been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      toast({
        title: 'Failed to delete flashcard.',
        description: 'There was an error deleting the flashcard. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto p-4">
        <FlashcardsHeader 
          isCreating={isCreating} 
          onCreateSimpleFlashcard={() => setActiveTab('create')}
          onCreateAdvancedFlashcard={() => setActiveTab('advanced-create')} 
        />

        <Tabs defaultValue="create" className="w-full mt-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="create">Create Flashcard</TabsTrigger>
            <TabsTrigger value="advanced-create">Advanced Create</TabsTrigger>
            <TabsTrigger value="list">My Flashcards</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            <FlashcardForm />
          </TabsContent>

          <TabsContent value="advanced-create">
            <AdvancedFlashcardForm />
          </TabsContent>

          <TabsContent value="list">
            <FlashcardList />
          </TabsContent>

          <TabsContent value="review">
            <ReviewFlashcardsTab />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default FlashcardsPage;
