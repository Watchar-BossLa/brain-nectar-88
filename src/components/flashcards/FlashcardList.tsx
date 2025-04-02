
import React, { useState, useEffect } from 'react';
import { getUserFlashcards, deleteFlashcard } from '@/services/spacedRepetition';
import { Flashcard } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/context/AuthContext';
import FlashcardListHeader from './FlashcardListHeader';
import EmptyFlashcardState from './EmptyFlashcardState';
import FlashcardGrid from './FlashcardGrid';
import DeleteFlashcardDialog from './DeleteFlashcardDialog';

interface FlashcardListProps {
  onAddNew: () => void;
  flashcards?: Flashcard[];
  isLoading?: boolean;
  onFlashcardsUpdated?: () => void;
}

const FlashcardList: React.FC<FlashcardListProps> = ({ 
  onAddNew, 
  flashcards: propFlashcards,
  isLoading: propIsLoading,
  onFlashcardsUpdated
}) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [flashcardToDelete, setFlashcardToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchFlashcards = async () => {
    if (propFlashcards) {
      setFlashcards(propFlashcards);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await getUserFlashcards(user.id);
      if (error) {
        throw new Error(error.message);
      }
      setFlashcards(data || []);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your flashcards',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propFlashcards) {
      setFlashcards(propFlashcards);
      setLoading(false);
    } else if (user) {
      fetchFlashcards();
    }
  }, [user, propFlashcards]);

  const handleDeleteClick = (id: string) => {
    setFlashcardToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!flashcardToDelete) return;
    
    try {
      const { error } = await deleteFlashcard(flashcardToDelete);
      if (error) {
        throw new Error(error.message);
      }
      
      setFlashcards(flashcards.filter(card => card.id !== flashcardToDelete));
      
      toast({
        title: 'Success',
        description: 'Flashcard deleted successfully'
      });

      if (onFlashcardsUpdated) {
        onFlashcardsUpdated();
      }
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete flashcard',
        variant: 'destructive'
      });
    } finally {
      setDeleteDialogOpen(false);
      setFlashcardToDelete(null);
    }
  };

  const dueFlashcards = flashcards.filter(card => {
    const reviewDate = new Date(card.next_review_date || '');
    const now = new Date();
    return reviewDate <= now;
  });

  if (propIsLoading || (loading && !propFlashcards)) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <FlashcardListHeader onAddNew={onAddNew} />

      {flashcards.length === 0 ? (
        <EmptyFlashcardState onAddNew={onAddNew} />
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All ({flashcards.length})</TabsTrigger>
            <TabsTrigger value="due">Due ({dueFlashcards.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <FlashcardGrid 
              flashcards={flashcards} 
              onDelete={handleDeleteClick} 
            />
          </TabsContent>
          
          <TabsContent value="due">
            <FlashcardGrid 
              flashcards={dueFlashcards} 
              onDelete={handleDeleteClick} 
            />
          </TabsContent>
        </Tabs>
      )}

      <DeleteFlashcardDialog 
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default FlashcardList;
