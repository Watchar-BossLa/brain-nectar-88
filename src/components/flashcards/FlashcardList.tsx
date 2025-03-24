import React, { useState, useEffect } from 'react';
import { getUserFlashcards, deleteFlashcard } from '@/services/spacedRepetition';
import { Flashcard } from '@/types/supabase';
import FlashcardCard from './FlashcardCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/context/AuthContext';

interface FlashcardListProps {
  onAddNew: () => void;
}

const FlashcardList: React.FC<FlashcardListProps> = ({ onAddNew }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [flashcardToDelete, setFlashcardToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchFlashcards = async () => {
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
    if (user) {
      fetchFlashcards();
    }
  }, [user]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Flashcards</h2>
        <Button onClick={onAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      {flashcards.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">You don't have any flashcards yet.</p>
          <Button onClick={onAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Your First Flashcard
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All ({flashcards.length})</TabsTrigger>
            <TabsTrigger value="due">Due ({dueFlashcards.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {flashcards.map(flashcard => (
                <FlashcardCard
                  key={flashcard.id}
                  flashcard={flashcard}
                  onDelete={() => handleDeleteClick(flashcard.id)}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="due">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {dueFlashcards.length > 0 ? (
                dueFlashcards.map(flashcard => (
                  <FlashcardCard
                    key={flashcard.id}
                    flashcard={flashcard}
                    onDelete={() => handleDeleteClick(flashcard.id)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center p-4">
                  <p>No flashcards due for review right now.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this flashcard. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FlashcardList;
