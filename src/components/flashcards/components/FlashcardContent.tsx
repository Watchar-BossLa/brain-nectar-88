
import React from 'react';
import { MathJax } from 'better-react-mathjax';

interface FlashcardContentProps {
  content: string;
}

const FlashcardContent: React.FC<FlashcardContentProps> = ({ content }) => {
  // Check if content contains LaTeX (enclosed in $$)
  const hasLatex = content.includes('$$');
  
  // Check if content references a financial statement
  const financialMatch = content.match(/\[fin:(.*?)\]/);
  const isFinancial = !!financialMatch;
  
  if (hasLatex) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <MathJax>{content}</MathJax>
      </div>
    );
  }
  
  if (isFinancial) {
    const statementType = financialMatch ? financialMatch[1] : 'balance-sheet';
    const cleanContent = content.replace(/\[fin:.*?\]/, '').trim();
    
    return (
      <div className="w-full overflow-auto text-sm">
        <div className="mb-2 text-muted-foreground text-xs">
          {statementType === 'balance-sheet' && 'Balance Sheet'}
          {statementType === 'income-statement' && 'Income Statement'}
          {statementType === 'cash-flow' && 'Cash Flow Statement'}
          {statementType === 'ratio' && 'Financial Ratio'}
        </div>
        {cleanContent.split('\n').map((line, i) => (
          <p key={i} className="mb-1">{line}</p>
        ))}
      </div>
    );
  }
  
  return (
    <div className="w-full overflow-auto">
      {content.split('\n').map((line, i) => (
        <p key={i} className="mb-1">{line}</p>
      ))}
    </div>
  );
};

export default FlashcardContent;
