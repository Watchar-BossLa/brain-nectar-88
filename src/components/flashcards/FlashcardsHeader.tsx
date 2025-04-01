
import React from 'react';

interface FlashcardsHeaderProps {
  isCreating?: boolean;
  onCreateSimpleFlashcard?: () => void;
  onCreateAdvancedFlashcard?: () => void; 
}

const FlashcardsHeader: React.FC<FlashcardsHeaderProps> = ({ 
  isCreating = false,
  onCreateSimpleFlashcard,
  onCreateAdvancedFlashcard
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">Flashcards</h1>
        <p className="text-muted-foreground">Create and manage your study flashcards</p>
      </div>
    </div>
  );
};

export default FlashcardsHeader;
