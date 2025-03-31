
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import LatexRenderer from './latex-renderer';

interface ContentRendererProps {
  content: string;
  useLaTeX?: boolean;
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({
  content,
  useLaTeX = false
}) => {
  // Check if content contains LaTeX delimiters
  const hasLatexDelimiters = content.includes('$$') || content.includes('\\(') || content.includes('\\)');
  
  // If LaTeX is enabled and content has LaTeX delimiters
  if (useLaTeX || hasLatexDelimiters) {
    return (
      <div>
        {content.split('\n').map((line, idx) => {
          // For inline LaTeX
          if (line.includes('$$') || line.includes('\\(') || line.includes('\\)')) {
            return <LatexRenderer key={idx} content={line} isBlock={false} />;
          }
          // For regular text
          return <p key={idx} className="mb-2">{line}</p>;
        })}
      </div>
    );
  }
  
  // For non-LaTeX content
  return (
    <div>
      {content.split('\n').map((line, index) => (
        <p key={index} className="mb-2">{line}</p>
      ))}
    </div>
  );
};

export default ContentRenderer;
