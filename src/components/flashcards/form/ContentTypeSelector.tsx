
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ContentTypeSelectorProps {
  contentType: 'text' | 'formula' | 'financial';
  setContentType: (type: 'text' | 'formula' | 'financial') => void;
  setUseLatex: (value: boolean) => void;
}

const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({
  contentType,
  setContentType,
  setUseLatex
}) => {
  const handleTypeChange = (value: string) => {
    const type = value as 'text' | 'formula' | 'financial';
    setContentType(type);
    
    // Automatically enable LaTeX for formula type
    if (type === 'formula') {
      setUseLatex(true);
    }
  };
  
  return (
    <div className="space-y-2">
      <Label>Content Type</Label>
      <RadioGroup 
        value={contentType} 
        onValueChange={handleTypeChange}
        className="flex flex-wrap gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="text" id="type-text" />
          <Label htmlFor="type-text" className="cursor-pointer">Basic Text</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="formula" id="type-formula" />
          <Label htmlFor="type-formula" className="cursor-pointer">Formula (LaTeX)</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="financial" id="type-financial" />
          <Label htmlFor="type-financial" className="cursor-pointer">Financial Statement</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ContentTypeSelector;
