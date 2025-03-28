
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface FlashcardListHeaderProps {
  onAddNew: () => void;
}

const FlashcardListHeader: React.FC<FlashcardListHeaderProps> = ({ onAddNew }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">Your Flashcards</h3>
      <Button size="sm" onClick={onAddNew}>
        <Plus className="h-4 w-4 mr-1" />
        Add New
      </Button>
    </div>
  );
};

export default FlashcardListHeader;
