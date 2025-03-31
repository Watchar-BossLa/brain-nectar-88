
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { InlineMath, BlockMath } from '@/lib/katex-imports';

interface LatexRendererProps {
  content: string;
  isBlock?: boolean;
}

const LatexRenderer: React.FC<LatexRendererProps> = ({
  content,
  isBlock = false
}) => {
  try {
    return (
      <>
        {isBlock ? (
          <BlockMath math={content} />
        ) : (
          <InlineMath math={content} />
        )}
      </>
    );
  } catch (error) {
    return (
      <Card>
        <CardContent className="p-2 text-destructive">
          Error rendering LaTeX: {content}
        </CardContent>
      </Card>
    );
  }
};

export default LatexRenderer;
