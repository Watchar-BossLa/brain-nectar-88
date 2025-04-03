
import React from 'react';
import { ContentTypeSelectorProps } from '@/types/components/flashcard';
import { Button } from '@/components/ui/button';
import { BookText, FormInput, Calculator } from 'lucide-react';

const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({
  contentType,
  setContentType,
  setUseLatex
}) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Button
        type="button"
        variant={contentType === 'text' ? 'default' : 'outline'}
        className="flex flex-col items-center justify-center p-4 h-auto"
        onClick={() => setContentType('text')}
      >
        <BookText className="h-8 w-8 mb-2" />
        <span>Text</span>
      </Button>
      
      <Button
        type="button"
        variant={contentType === 'formula' ? 'default' : 'outline'}
        className="flex flex-col items-center justify-center p-4 h-auto"
        onClick={() => {
          setContentType('formula');
          setUseLatex(true);
        }}
      >
        <FormInput className="h-8 w-8 mb-2" />
        <span>Formula</span>
      </Button>
      
      <Button
        type="button"
        variant={contentType === 'financial' ? 'default' : 'outline'}
        className="flex flex-col items-center justify-center p-4 h-auto"
        onClick={() => setContentType('financial')}
      >
        <Calculator className="h-8 w-8 mb-2" />
        <span>Financial</span>
      </Button>
    </div>
  );
};

export default ContentTypeSelector;
