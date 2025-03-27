
import React from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

const config = {
  loader: { load: ["[tex]/html", "[tex]/physics", "[tex]/color", "[tex]/ams"] },
  tex: {
    packages: { "[+]": ["html", "physics", "color", "ams"] },
    inlineMath: [["$", "$"]],
    displayMath: [["$$", "$$"]],
    macros: {
      // Common accounting and finance macros
      "\\debit": "\\text{Debit}",
      "\\credit": "\\text{Credit}",
      "\\assets": "\\text{Assets}",
      "\\liabilities": "\\text{Liabilities}",
      "\\equity": "\\text{Equity}",
      "\\revenue": "\\text{Revenue}",
      "\\expenses": "\\text{Expenses}"
    }
  },
  startup: {
    typeset: false
  },
  options: {
    enableMenu: false, // Disable the right-click menu for cleaner UI
    renderActions: {
      addMenu: [], // No additional menu actions
      checkLoading: []
    }
  }
};

interface LatexRendererProps {
  latex: string;
  display?: boolean;
  className?: string;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  interactive?: boolean;
}

/**
 * Enhanced component for rendering LaTeX formulas in accounting equations
 */
export const LatexRenderer: React.FC<LatexRendererProps> = ({ 
  latex, 
  display = false,
  className = "",
  color,
  size = 'medium',
  interactive = false
}) => {
  // Process the latex content for color if specified
  const processedLatex = color ? `\\color{${color}}{${latex}}` : latex;
  
  // Apply size styling
  const sizeClass = {
    small: 'text-sm',
    medium: '',
    large: 'text-xl md:text-2xl'
  }[size];
  
  // Combine classes
  const combinedClassName = `${className} ${sizeClass}`.trim();
  
  return (
    <MathJaxContext config={config}>
      <div className={`latex-renderer ${interactive ? 'interactive-latex' : ''} ${combinedClassName}`}>
        <MathJax>
          {display ? `$$${processedLatex}$$` : `$${processedLatex}$`}
        </MathJax>
      </div>
    </MathJaxContext>
  );
};

// Utility function to render LaTeX content
export const renderLatexContent = (latexContent: string, isDisplayMode: boolean = false): JSX.Element => {
  return <LatexRenderer latex={latexContent} display={isDisplayMode} />;
};

export default LatexRenderer;
