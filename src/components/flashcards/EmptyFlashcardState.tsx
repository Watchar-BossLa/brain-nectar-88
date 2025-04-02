
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, Lightbulb } from 'lucide-react';

interface EmptyFlashcardStateProps {
  onAddNew?: () => void;
  title?: string;
  description?: string;
}

const EmptyFlashcardState = ({ 
  onAddNew,
  title,
  description
}: EmptyFlashcardStateProps) => {
  const { t } = useTranslation();
  
  // Use translations if no custom title/description is provided
  const displayTitle = title || t('flashcards.noFlashcards');
  const displayDescription = description || t('flashcards.createFirst');
  
  return (
    <Card className="border-dashed">
      <CardContent className="pt-6 pb-8 text-center">
        <div className="flex justify-center mb-4">
          <Lightbulb className="h-12 w-12 text-muted-foreground" />
        </div>
        
        <h3 className="text-lg font-medium mb-2">{displayTitle}</h3>
        
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          {displayDescription}
        </p>
        
        {onAddNew && (
          <Button onClick={onAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('common.add')} {t('flashcards.createSimple')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyFlashcardState;
