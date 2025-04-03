import React from 'react';
import { FlashcardListHeaderProps } from '@/types/components';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const FlashcardListHeader: React.FC<FlashcardListHeaderProps> = ({ onAddNew }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">My Flashcards</h2>
      <Button onClick={onAddNew}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add New
      </Button>
    </div>
  );
};

export default FlashcardListHeader;
