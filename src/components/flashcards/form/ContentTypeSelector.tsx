
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ContentTypeSelectorProps {
  contentTypeFront: string;
  setContentTypeFront: (type: string) => void;
  contentTypeBack: string;
  setContentTypeBack: (type: string) => void;
}

const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({
  contentTypeFront,
  setContentTypeFront,
  contentTypeBack,
  setContentTypeBack
}) => {
  const handleFrontTypeChange = (value: string) => {
    setContentTypeFront(value);
  };
  
  const handleBackTypeChange = (value: string) => {
    setContentTypeBack(value);
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Front Content Type</Label>
        <RadioGroup 
          value={contentTypeFront} 
          onValueChange={handleFrontTypeChange}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="text" id="front-type-text" />
            <Label htmlFor="front-type-text" className="cursor-pointer">Basic Text</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="formula" id="front-type-formula" />
            <Label htmlFor="front-type-formula" className="cursor-pointer">Formula (LaTeX)</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="financial" id="front-type-financial" />
            <Label htmlFor="front-type-financial" className="cursor-pointer">Financial Statement</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label>Back Content Type</Label>
        <RadioGroup 
          value={contentTypeBack} 
          onValueChange={handleBackTypeChange}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="text" id="back-type-text" />
            <Label htmlFor="back-type-text" className="cursor-pointer">Basic Text</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="formula" id="back-type-formula" />
            <Label htmlFor="back-type-formula" className="cursor-pointer">Formula (LaTeX)</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="financial" id="back-type-financial" />
            <Label htmlFor="back-type-financial" className="cursor-pointer">Financial Statement</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default ContentTypeSelector;
