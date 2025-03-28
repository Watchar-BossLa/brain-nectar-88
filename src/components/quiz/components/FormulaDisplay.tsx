
import React from 'react';
import { LatexRenderer } from '@/components/math/LatexRendererWrapper';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FormulaDisplayProps {
  formula: string;
  explanation?: string;
  isHighlighted?: boolean;
  className?: string;
}

const FormulaDisplay: React.FC<FormulaDisplayProps> = ({
  formula,
  explanation,
  isHighlighted = false,
  className
}) => {
  return (
    <Card className={cn(
      "overflow-x-auto",
      isHighlighted && "border-primary/50 bg-primary/5",
      className
    )}>
      <CardContent className="p-4">
        <div className="flex justify-center py-2">
          <LatexRenderer 
            latex={formula} 
            display={true} 
            size="large"
            color={isHighlighted ? "primary" : undefined}
          />
        </div>
        
        {explanation && (
          <div className="mt-2 text-sm text-muted-foreground border-t pt-2">
            {explanation}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FormulaDisplay;
