import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { fetchUserFlashcards, removeFlashcard } from '@/services/spacedRepetition';
import FlashcardCard from './FlashcardCard';
import FlashcardListHeader from './FlashcardListHeader';
import EmptyFlashcardState from './EmptyFlashcardState';
import { Flashcard } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FlashcardListProps {
  topicId?: string;
}

const FlashcardList: React.FC<FlashcardListProps> = ({ topicId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [sortBy, setSortBy] = useState('created_at'); // Default sort by creation date

  useEffect(() => {
    if (!user) return;

    const fetchFlashcards = async () => {
      setLoading(true);
      try {
        const fetchedFlashcards = await fetchUserFlashcards(user.id, topicId);
        setFlashcards(fetchedFlashcards);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
        toast({
          title: 'Error',
          description: 'Failed to load flashcards.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [user, topicId, toast]);

  const handleDeleteFlashcard = async (id: string) => {
    try {
      await removeFlashcard(id);
      setFlashcards(flashcards.filter(card => card.id !== id));
      toast({
        title: 'Success',
        description: 'Flashcard deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete flashcard.',
        variant: 'destructive',
      });
    }
  };

  const filteredFlashcards = flashcards.filter(card =>
    card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.back.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedFlashcards = [...filteredFlashcards].sort((a, b) => {
    const aValue = typeof a[sortBy] === 'string' ? a[sortBy].toLowerCase() : a[sortBy];
    const bValue = typeof b[sortBy] === 'string' ? b[sortBy].toLowerCase() : b[sortBy];

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  if (loading) {
    return <p>Loading flashcards...</p>;
  }

  if (!flashcards || flashcards.length === 0) {
    return <EmptyFlashcardState topicId={topicId} />;
  }

  return (
    <div className="space-y-4">
      <FlashcardListHeader>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search flashcards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        <div className="flex items-center space-x-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Date Created</SelectItem>
              <SelectItem value="front">Front</SelectItem>
              <SelectItem value="back">Back</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FlashcardListHeader>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedFlashcards.map((card) => (
          <FlashcardCard
            key={card.id}
            card={card}
            onDelete={handleDeleteFlashcard}
          />
        ))}
      </div>
    </div>
  );
};

export default FlashcardList;
