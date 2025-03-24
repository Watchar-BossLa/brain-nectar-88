
import React from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

/**
 * Renders content with LaTeX formulas
 * @param content The text content that may contain LaTeX formulas ($$formula$$)
 * @param useLatex Whether to render LaTeX formulas
 * @returns Rendered content with LaTeX formulas if enabled
 */
export const renderLatexContent = (content: string, useLatex: boolean) => {
  if (!useLatex) return content;
  
  // Replace $$formula$$ with LaTeX rendered formula
  const parts = content.split(/(\\?\$\$[^$]*\$\$)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('$$') && part.endsWith('$$')) {
      const formula = part.slice(2, -2);
      try {
        return <InlineMath key={index} math={formula} />;
      } catch (error) {
        console.error('LaTeX rendering error:', error);
        return <span key={index} className="text-red-500">{part}</span>;
      }
    }
    return <span key={index}>{part}</span>;
  });
};
