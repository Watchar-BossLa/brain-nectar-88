
import React from 'react';
import { motion } from 'framer-motion';
import { MathJax } from 'better-react-mathjax';

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
  // Check if content contains LaTeX (enclosed in $$)
  const hasLatex = content.includes('$$');
  
  // Check if content references a financial statement
  const financialMatch = content.match(/\[fin:(.*?)\]/);
  const isFinancial = !!financialMatch;
  
  return (
    <motion.div
      key={isAnswer ? 'answer' : 'question'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 p-6 border rounded-md bg-card flex flex-col items-center justify-center"
      onClick={onClick}
    >
      <div className="text-xs text-muted-foreground mb-2">
        {isAnswer ? 'Answer' : 'Question'}
      </div>
      
      <div className="w-full h-full flex items-center justify-center overflow-auto">
        {hasLatex ? (
          <MathJax>{content}</MathJax>
        ) : isFinancial ? (
          <div className="w-full overflow-auto text-sm">
            <div className="mb-2 text-muted-foreground text-xs">
              {financialMatch && financialMatch[1] === 'balance-sheet' && 'Balance Sheet'}
              {financialMatch && financialMatch[1] === 'income-statement' && 'Income Statement'}
              {financialMatch && financialMatch[1] === 'cash-flow' && 'Cash Flow Statement'}
              {financialMatch && financialMatch[1] === 'ratio' && 'Financial Ratio'}
            </div>
            {content.split('\n').map((line, i) => (
              <p key={i} className="mb-1">{line}</p>
            ))}
          </div>
        ) : (
          <div className="w-full overflow-auto">
            {content.split('\n').map((line, i) => (
              <p key={i} className="mb-1">{line}</p>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
