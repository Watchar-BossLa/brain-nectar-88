
import React from 'react';
import { TextContentInputProps } from '@/types/components/flashcard';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const TextContentInput: React.FC<TextContentInputProps> = ({
  frontContent,
  setFrontContent,
  backContent,
  setBackContent
}) => {
  return (
    <>
      <div className="grid w-full gap-1.5">
        <Label htmlFor="front-content">Question</Label>
        <Textarea 
          id="front-content"
          placeholder="Enter the question or prompt"
          value={frontContent}
          onChange={(e) => setFrontContent(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      <div className="grid w-full gap-1.5 mt-4">
        <Label htmlFor="back-content">Answer</Label>
        <Textarea 
          id="back-content"
          placeholder="Enter the answer or explanation"
          value={backContent}
          onChange={(e) => setBackContent(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
    </>
  );
};

export default TextContentInput;
