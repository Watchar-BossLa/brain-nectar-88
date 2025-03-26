
import React from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

const config = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [["$", "$"]],
    displayMath: [["$$", "$$"]]
  },
  startup: {
    typeset: false
  }
};

interface LatexRendererProps {
  latex: string;
  display?: boolean;
  className?: string;
}

/**
 * Component for rendering LaTeX formulas in accounting equations
 */
const LatexRenderer: React.FC<LatexRendererProps> = ({ 
  latex, 
  display = false,
  className = ""
}) => {
  return (
    <MathJaxContext config={config}>
      <MathJax className={className}>
        {display ? `$$${latex}$$` : `$${latex}$`}
      </MathJax>
    </MathJaxContext>
  );
};

export default LatexRenderer;
