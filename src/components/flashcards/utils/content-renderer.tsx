
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import LatexRendererWrapper from '@/components/math/LatexRendererWrapper';
import { InlineMath, BlockMath } from '@/lib/katex-imports';
import { Badge } from '@/components/ui/badge';

interface ContentRendererProps {
  content: string;
  contentType: 'text' | 'math' | 'code' | 'financial';
  className?: string;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({
  content,
  contentType,
  className = ''
}) => {
  // For text content that might contain basic markdown-like formatting
  if (contentType === 'text') {
    return (
      <div className={`prose dark:prose-invert max-w-none ${className}`}>
        {content.split('\n').map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    );
  }

  // For mathematical formulas and equations
  if (contentType === 'math') {
    return (
      <LatexRendererWrapper>
        <BlockMath math={content} />
      </LatexRendererWrapper>
    );
  }

  // For code snippets
  if (contentType === 'code') {
    return (
      <pre className={`p-4 bg-muted rounded-md overflow-auto ${className}`}>
        <code>{content}</code>
      </pre>
    );
  }

  // For financial statements or tabular data
  if (contentType === 'financial') {
    try {
      const data = JSON.parse(content);
      return (
        <Card className={className}>
          <CardContent className="p-4">
            <div className="text-center mb-2">
              <Badge variant="outline">{data.type || 'Financial Data'}</Badge>
            </div>
            <table className="w-full border-collapse">
              <tbody>
                {Object.entries(data.items || {}).map(([key, value]: [string, any]) => (
                  <tr key={key} className="border-b">
                    <td className="py-2 px-1 text-left">{key}</td>
                    <td className="py-2 px-1 text-right">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      );
    } catch (e) {
      return (
        <div className={`text-destructive ${className}`}>
          Invalid financial data format
        </div>
      );
    }
  }

  // Fallback for unknown content types
  return <div className={className}>{content}</div>;
};

export default ContentRenderer;
