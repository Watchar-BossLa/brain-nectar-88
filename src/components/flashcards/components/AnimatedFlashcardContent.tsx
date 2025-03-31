
import React from 'react';
// Import the stub instead of the real library
import { motion } from '@/lib/framer-motion-stub';

interface AnimatedFlashcardContentProps {
  content: string;
  isAnswer: boolean;
  onClick: () => void;
  isFlipped: boolean;
}

export const AnimatedFlashcardContent: React.FC<AnimatedFlashcardContentProps> = ({
  content,
  isAnswer,
  onClick,
  isFlipped
}) => {
  return (
    <div 
      className={`
        absolute inset-0 p-6 flex flex-col justify-center items-center 
        bg-card border rounded-md shadow-sm cursor-pointer
        ${isAnswer ? 'border-primary/30 bg-primary/5' : 'border-muted'}
      `}
      onClick={onClick}
    >
      <div className="max-w-full overflow-auto">
        <div
          className="whitespace-pre-wrap text-center"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
      
      <div className="mt-4 text-sm text-muted-foreground">
        {isAnswer ? 'Click to see question' : 'Click to reveal answer'}
      </div>
    </div>
  );
};
