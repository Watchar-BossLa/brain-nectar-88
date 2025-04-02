
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { BookText, Calculator } from 'lucide-react';

interface FlashcardsHeaderProps {
  isCreating: boolean;
  onCreateSimpleFlashcard: () => void;
  onCreateAdvancedFlashcard: () => void;
}

const FlashcardsHeader = ({ 
  isCreating, 
  onCreateSimpleFlashcard, 
  onCreateAdvancedFlashcard 
}: FlashcardsHeaderProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('flashcards.title')}</h2>
        <p className="text-muted-foreground">
          {t('flashcards.subtitle')}
        </p>
      </div>
      {!isCreating && (
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onCreateSimpleFlashcard}>
            <BookText className="mr-2 h-4 w-4" />
            {t('flashcards.createSimple')}
          </Button>
          <Button onClick={onCreateAdvancedFlashcard}>
            <Calculator className="mr-2 h-4 w-4" />
            {t('flashcards.createAdvanced')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FlashcardsHeader;
