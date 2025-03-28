
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface TextContentInputProps {
  frontContent: string;
  setFrontContent: (value: string) => void;
  backContent: string;
  setBackContent: (value: string) => void;
}

const TextContentInput: React.FC<TextContentInputProps> = ({
  frontContent,
  setFrontContent,
  backContent,
  setBackContent
}) => {
  return (
    <>
      <div className="space-y-2">
        <label htmlFor="front-content" className="text-sm font-medium">
          Front Side (Question)
        </label>
        <Textarea
          id="front-content"
          value={frontContent}
          onChange={(e) => setFrontContent(e.target.value)}
          placeholder="What is the accounting equation?"
          className="min-h-20"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="back-content" className="text-sm font-medium">
          Back Side (Answer)
        </label>
        <Textarea
          id="back-content"
          value={backContent}
          onChange={(e) => setBackContent(e.target.value)}
          placeholder="Assets = Liabilities + Equity"
          className="min-h-20"
        />
      </div>
    </>
  );
};

export default TextContentInput;
