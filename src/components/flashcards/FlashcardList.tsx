
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { fetchUserFlashcards } from '@/services/spacedRepetition';
import { useToast } from '@/hooks/use-toast';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FlashcardListProps {
  topicId?: string;
}

interface FlashcardListHeaderProps {
  children: React.ReactNode;
  onAddNew?: () => void;
}

interface EmptyFlashcardStateProps {
  topicId?: string;
  onCreateNew?: () => void;
}

const FlashcardListHeader: React.FC<FlashcardListHeaderProps> = ({ children, onAddNew }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex-1">{children}</div>
      {onAddNew && (
        <button 
          onClick={onAddNew}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Add New Flashcard
        </button>
      )}
    </div>
  );
};

const EmptyFlashcardState: React.FC<EmptyFlashcardStateProps> = ({ topicId, onCreateNew }) => {
  return (
    <div className="text-center p-10 border-2 border-dashed rounded-lg">
      <h3 className="text-xl font-medium mb-2">No flashcards yet</h3>
      <p className="text-muted-foreground mb-4">
        {topicId 
          ? "You haven't created any flashcards for this topic yet." 
          : "You haven't created any flashcards yet."}
      </p>
      {onCreateNew && (
        <button
          onClick={onCreateNew}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Create your first flashcard
        </button>
      )}
    </div>
  );
};

interface FlashcardCardProps {
  flashcard: any;
  onDelete: (id: string) => Promise<void>;
}

const FlashcardCard: React.FC<FlashcardCardProps> = ({ flashcard, onDelete }) => {
  // Simplified flashcard card component
  return (
    <div className="border rounded-md p-4">
      <div className="font-bold">{flashcard.front_content || flashcard.front}</div>
      <div className="mt-2">{flashcard.back_content || flashcard.back}</div>
      <button
        onClick={() => onDelete(flashcard.id)}
        className="mt-4 text-sm text-red-500"
      >
        Delete
      </button>
    </div>
  );
};

const FlashcardList: React.FC<FlashcardListProps> = ({ topicId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [sortBy, setSortBy] = useState('created_at'); // Default sort by creation date

  useEffect(() => {
    if (!user) return;

    const fetchFlashcards = async () => {
      setLoading(true);
      try {
        const fetchedFlashcards = await fetchUserFlashcards(user.id);
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
      // Import is directly used here, not passed as prop
      const { removeFlashcard } = await import('@/services/spacedRepetition');
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
    (card.front_content || card.front || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (card.back_content || card.back || '').toLowerCase().includes(searchTerm.toLowerCase())
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
    return <EmptyFlashcardState onCreateNew={() => {}} />;
  }

  return (
    <div className="space-y-4">
      <FlashcardListHeader onAddNew={() => {}}>
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
              <SelectItem value="front_content">Front</SelectItem>
              <SelectItem value="back_content">Back</SelectItem>
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
        {sortedFlashcards.map((flashcard) => (
          <FlashcardCard
            key={flashcard.id}
            flashcard={flashcard}
            onDelete={handleDeleteFlashcard}
          />
        ))}
      </div>
    </div>
  );
};

export default FlashcardList;
