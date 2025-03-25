
import React from 'react';
import { Calculator } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { FinancialStatementTable } from '../financial/FinancialStatementTable';

/**
 * Enhanced content renderer that supports:
 * - LaTeX formulas (inline $$formula$$ and block $$$formula$$$)
 * - Financial statement visualization tokens [fin:balance-sheet], [fin:income-statement], etc.
 */
export const renderContent = (content: string): React.ReactNode => {
  if (!content) return <span className="text-muted-foreground">No content available</span>;
  
  // Replace financial visualization tokens
  if (content.includes('[fin:')) {
    const finMatch = content.match(/\[fin:(balance-sheet|income-statement|cash-flow|ratio)\]/);
    if (finMatch) {
      const statementType = finMatch[1];
      return (
        <div className="flex flex-col items-center">
          <div className="text-center mb-4">{content.replace(finMatch[0], '')}</div>
          <div className="w-full max-w-md p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center justify-center gap-2 text-primary mb-2">
              <Calculator size={18} />
              <span className="font-medium">{formatStatementType(statementType)}</span>
            </div>
            <div className="text-sm">
              <FinancialStatementTable type={statementType} />
            </div>
            <div className="text-xs text-center mt-2 text-muted-foreground">
              Interactive version available in Financial Tools
            </div>
          </div>
        </div>
      );
    }
  }

  // Handle mixed content with LaTeX
  // Check if content has LaTeX formulas
  if (!content.includes('$$') && !content.includes('$$$')) return content;
  
  // First, handle block math with $$$formula$$$ 
  const parts: React.ReactNode[] = [];
  const blockSplit = content.split(/(\\?\$\$\$[^$]*\$\$\$)/g);
  
  blockSplit.forEach((part, index) => {
    if (part.startsWith('$$$') && part.endsWith('$$$')) {
      const formula = part.slice(3, -3);
      try {
        parts.push(
          <div key={`block-${index}`} className="py-2 flex justify-center">
            <BlockMath math={formula} />
          </div>
        );
      } catch (error) {
        console.error('LaTeX rendering error:', error);
        parts.push(<span key={`block-${index}`} className="text-red-500">{part}</span>);
      }
    } else if (part) {
      // Process inline math in this part
      const inlineParts = part.split(/(\\?\$\$[^$]*\$\$)/g);
      inlineParts.forEach((inlinePart, inlineIndex) => {
        if (inlinePart.startsWith('$$') && inlinePart.endsWith('$$')) {
          const formula = inlinePart.slice(2, -2);
          try {
            parts.push(<InlineMath key={`${index}-inline-${inlineIndex}`} math={formula} />);
          } catch (error) {
            console.error('LaTeX rendering error:', error);
            parts.push(<span key={`${index}-inline-${inlineIndex}`} className="text-red-500">{inlinePart}</span>);
          }
        } else if (inlinePart) {
          parts.push(<span key={`${index}-inline-${inlineIndex}`}>{inlinePart}</span>);
        }
      });
    }
  });
  
  return <>{parts}</>;
};

export const formatStatementType = (type: string): string => {
  switch (type) {
    case 'balance-sheet': return 'Balance Sheet';
    case 'income-statement': return 'Income Statement';
    case 'cash-flow': return 'Cash Flow Statement';
    case 'ratio': return 'Financial Ratios';
    default: return type;
  }
};
