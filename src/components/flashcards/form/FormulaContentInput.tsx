
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { MathJax } from 'better-react-mathjax';

interface FormulaContentInputProps {
  frontContent: string;
  setFrontContent: (value: string) => void;
  backContent: string;
  setBackContent: (value: string) => void;
}

const FormulaContentInput: React.FC<FormulaContentInputProps> = ({
  frontContent,
  setFrontContent,
  backContent,
  setBackContent
}) => {
  return (
    <>
      <div className="space-y-2">
        <label htmlFor="front-content" className="text-sm font-medium">
          Front Side (Question)
        </label>
        <Textarea
          id="front-content"
          value={frontContent}
          onChange={(e) => setFrontContent(e.target.value)}
          placeholder="What is the formula for calculating Return on Assets (ROA)?"
          className="min-h-20"
        />
        {frontContent && (
          <div className="p-3 border rounded-md mt-2 bg-muted/50">
            <h4 className="text-xs text-muted-foreground mb-1">LaTeX Preview:</h4>
            <MathJax>{`$$${frontContent}$$`}</MathJax>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="back-content" className="text-sm font-medium">
          Back Side (Formula)
        </label>
        <Textarea
          id="back-content"
          value={backContent}
          onChange={(e) => setBackContent(e.target.value)}
          placeholder="ROA = \frac{Net Income}{Total Assets}"
          className="min-h-20"
        />
        {backContent && (
          <div className="p-3 border rounded-md mt-2 bg-muted/50">
            <h4 className="text-xs text-muted-foreground mb-1">LaTeX Preview:</h4>
            <MathJax>{`$$${backContent}$$`}</MathJax>
          </div>
        )}
      </div>
    </>
  );
};

export default FormulaContentInput;
