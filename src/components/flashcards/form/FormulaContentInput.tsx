import React from 'react';
import { FormulaContentInputProps } from '@/types/components';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const FormulaContentInput: React.FC<FormulaContentInputProps> = ({
  frontContent,
  setFrontContent,
  backContent,
  setBackContent
}) => {
  return (
    <>
      <div className="grid w-full gap-1.5">
        <Label htmlFor="front-content">Formula Question</Label>
        <Textarea 
          id="front-content"
          placeholder="Enter LaTeX formula or question (e.g., What is the formula for compound interest?)"
          value={frontContent}
          onChange={(e) => setFrontContent(e.target.value)}
          className="min-h-[100px] font-mono"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Use LaTeX syntax for formulas: e.g., {`$$A = P(1 + r/n)^{nt}$$`}
        </p>
      </div>
      <div className="grid w-full gap-1.5 mt-4">
        <Label htmlFor="back-content">Formula Answer</Label>
        <Textarea 
          id="back-content"
          placeholder="Enter the LaTeX formula or explanation"
          value={backContent}
          onChange={(e) => setBackContent(e.target.value)}
          className="min-h-[100px] font-mono"
        />
        <p className="text-xs text-muted-foreground mt-1">
          For block display use double dollar signs: e.g., {`$$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$`}
        </p>
      </div>
    </>
  );
};

export default FormulaContentInput;
