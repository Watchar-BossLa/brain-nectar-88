
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
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base">Front content type:</Label>
        <RadioGroup
          value={contentTypeFront}
          onValueChange={setContentTypeFront}
          className="flex flex-wrap gap-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="text" id="front-text" />
            <Label htmlFor="front-text">Text</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="math" id="front-math" />
            <Label htmlFor="front-math">Math</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="code" id="front-code" />
            <Label htmlFor="front-code">Code</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="image" id="front-image" />
            <Label htmlFor="front-image">Image</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="text-base">Back content type:</Label>
        <RadioGroup
          value={contentTypeBack}
          onValueChange={setContentTypeBack}
          className="flex flex-wrap gap-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="text" id="back-text" />
            <Label htmlFor="back-text">Text</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="math" id="back-math" />
            <Label htmlFor="back-math">Math</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="code" id="back-code" />
            <Label htmlFor="back-code">Code</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="image" id="back-image" />
            <Label htmlFor="back-image">Image</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default ContentTypeSelector;
