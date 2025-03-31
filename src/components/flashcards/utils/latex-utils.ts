
import React from 'react';
import LatexRenderer from './latex-renderer';

/**
 * Utility function to render LaTeX content
 * @param content The LaTeX content to render
 * @param isBlock Whether to render as a block (true) or inline (false)
 * @returns Rendered React element
 */
export const renderLatexContent = (content: string, isBlock = false): React.ReactElement => {
  return <LatexRenderer content={content} isBlock={isBlock} />;
};
