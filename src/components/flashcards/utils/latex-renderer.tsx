
import React from 'react';
import { InlineMath, BlockMath } from '@/lib/react-katex-stub';

interface LatexRendererProps {
  content: string;
  isBlock?: boolean;
}

/**
 * Component to render LaTeX content using the KaTeX library
 */
const LatexRenderer: React.FC<LatexRendererProps> = ({ content, isBlock = false }) => {
  // Process content to extract LaTeX expressions
  const processContent = (text: string): React.ReactNode => {
    // Check if this is already a pure LaTeX expression
    if (text.startsWith('$$') && text.endsWith('$$')) {
      return <BlockMath math={text.substring(2, text.length - 2)} />;
    }

    // Split by LaTeX delimiters
    const parts = text.split(/(\$\$.*?\$\$|\\\(.*?\\\))/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        return <BlockMath key={index} math={part.substring(2, part.length - 2)} />;
      } else if (part.startsWith('\\(') && part.endsWith('\\)')) {
        return <InlineMath key={index} math={part.substring(2, part.length - 2)} />;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <>
      {isBlock ? (
        <div className="latex-block">{processContent(content)}</div>
      ) : (
        <span className="latex-inline">{processContent(content)}</span>
      )}
    </>
  );
};

export default LatexRenderer;
