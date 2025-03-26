
import React from 'react';
import { motion } from 'framer-motion';
import { renderContent } from '../utils/content-renderer';

interface FlashcardContentProps {
  content: string;
  isAnswer?: boolean;
  onClick?: () => void;
}

export const FlashcardContent: React.FC<FlashcardContentProps> = ({
  content,
  isAnswer,
  onClick
}) => {
  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center p-6 border rounded-lg bg-card overflow-auto"
      onClick={onClick}
    >
      {isAnswer !== undefined && (
        <div className="text-lg font-medium text-center mb-4">
          {isAnswer ? 'Answer' : 'Question'}
        </div>
      )}
      <div className="text-xl text-center">
        {renderContent(content)}
      </div>
      {isAnswer !== undefined && onClick && (
        <div className="text-sm text-muted-foreground mt-4">
          {isAnswer ? 'Click to see question' : 'Click to reveal answer'}
        </div>
      )}
    </div>
  );
};

export const AnimatedFlashcardContent: React.FC<FlashcardContentProps & { 
  isFlipped: boolean 
}> = ({
  content,
  isAnswer,
  onClick,
  isFlipped
}) => {
  return (
    <motion.div 
      key={isAnswer ? 'back' : 'front'}
      initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 w-full h-full flex items-center justify-center"
    >
      <FlashcardContent 
        content={content}
        isAnswer={isAnswer}
        onClick={onClick}
      />
    </motion.div>
  );
};
