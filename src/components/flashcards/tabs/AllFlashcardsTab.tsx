
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCcw } from 'lucide-react';
import { Flashcard } from '@/types/flashcards';
import FlashcardGrid from '@/components/flashcards/FlashcardGrid';
import EmptyFlashcardState from '@/components/flashcards/EmptyFlashcardState';
import { useAuth } from '@/context/AuthContext';
import { triggerDefaultFlashcardsLoad } from '@/services/defaultFlashcards';
import { useToast } from '@/components/ui/use-toast';

interface AllFlashcardsTabProps {
  flashcards: Flashcard[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  onFlashcardsUpdated: () => void;
}

const AllFlashcardsTab = ({ 
  flashcards, 
  isLoading,
  onDelete,
  onAddNew,
  onFlashcardsUpdated
}: AllFlashcardsTabProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleLoadDefaultFlashcards = async () => {
    if (!user) return;
    
    try {
      const success = await triggerDefaultFlashcardsLoad(user.id);
      
      if (success) {
        toast({
          title: "Success",
          description: "Default flashcards have been loaded successfully!",
        });
        onFlashcardsUpdated();
      } else {
        toast({
          title: "Error",
          description: "Failed to load default flashcards. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading default flashcards:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading flashcards.",
        variant: "destructive",
      });
    }
  };
  
  const renderContent = () => {
    if (isLoading) {
      return <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading flashcards...</p>
      </div>;
    }
    
    if (flashcards.length === 0) {
      return <EmptyFlashcardState onAddNew={onAddNew} />;
    }
    
    return <FlashcardGrid flashcards={flashcards} onDelete={onDelete} />;
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Button onClick={onAddNew} variant="default">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Flashcard
        </Button>
        
        <Button onClick={handleLoadDefaultFlashcards} variant="outline">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Load Default Flashcards
        </Button>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default AllFlashcardsTab;
