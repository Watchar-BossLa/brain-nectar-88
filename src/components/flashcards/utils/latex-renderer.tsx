
import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Calculator } from 'lucide-react';

interface FinancialStatementProps {
  type: 'balance-sheet' | 'income-statement' | 'cash-flow' | 'ratio';
}

/**
 * Financial statement visualization component
 */
export const FinancialStatementVisualizer: React.FC<FinancialStatementProps> = ({ type }) => {
  const renderStatement = () => {
    switch (type) {
      case 'balance-sheet':
        return (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left py-1">Assets</th>
                <th className="text-right py-1">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="py-1">Cash</td><td className="text-right">$10,000</td></tr>
              <tr><td className="py-1">Accounts Receivable</td><td className="text-right">$5,000</td></tr>
              <tr><td className="py-1">Inventory</td><td className="text-right">$15,000</td></tr>
              <tr className="border-t font-medium">
                <td className="py-1">Total Assets</td>
                <td className="text-right">$30,000</td>
              </tr>
            </tbody>
            <thead>
              <tr className="border-b border-t">
                <th className="text-left py-1">Liabilities & Equity</th>
                <th className="text-right py-1">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="py-1">Accounts Payable</td><td className="text-right">$8,000</td></tr>
              <tr><td className="py-1">Notes Payable</td><td className="text-right">$7,000</td></tr>
              <tr><td className="py-1">Owner's Equity</td><td className="text-right">$15,000</td></tr>
              <tr className="border-t font-medium">
                <td className="py-1">Total Liabilities & Equity</td>
                <td className="text-right">$30,000</td>
              </tr>
            </tbody>
          </table>
        );
      case 'income-statement':
        return (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left py-1">Item</th>
                <th className="text-right py-1">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="py-1">Revenue</td><td className="text-right">$50,000</td></tr>
              <tr><td className="py-1">Cost of Goods Sold</td><td className="text-right">($30,000)</td></tr>
              <tr className="border-t">
                <td className="py-1">Gross Profit</td>
                <td className="text-right">$20,000</td>
              </tr>
              <tr><td className="py-1">Operating Expenses</td><td className="text-right">($12,000)</td></tr>
              <tr className="border-t font-medium">
                <td className="py-1">Net Income</td>
                <td className="text-right">$8,000</td>
              </tr>
            </tbody>
          </table>
        );
      case 'cash-flow':
        return (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left py-1">Category</th>
                <th className="text-right py-1">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="font-medium"><td className="py-1">Operating Activities</td><td></td></tr>
              <tr><td className="pl-2 py-1">Net Income</td><td className="text-right">$8,000</td></tr>
              <tr><td className="pl-2 py-1">Depreciation</td><td className="text-right">$2,000</td></tr>
              <tr className="border-t">
                <td className="py-1">Net Cash from Operations</td>
                <td className="text-right">$10,000</td>
              </tr>
              <tr className="font-medium"><td className="py-1">Investing Activities</td><td className="text-right">($5,000)</td></tr>
              <tr className="font-medium"><td className="py-1">Financing Activities</td><td className="text-right">($2,000)</td></tr>
              <tr className="border-t font-medium">
                <td className="py-1">Net Change in Cash</td>
                <td className="text-right">$3,000</td>
              </tr>
            </tbody>
          </table>
        );
      case 'ratio':
        return (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left py-1">Ratio</th>
                <th className="text-right py-1">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="py-1">Current Ratio</td><td className="text-right">1.5</td></tr>
              <tr><td className="py-1">Debt-to-Equity</td><td className="text-right">0.8</td></tr>
              <tr><td className="py-1">Return on Assets (ROA)</td><td className="text-right">12%</td></tr>
              <tr><td className="py-1">Return on Equity (ROE)</td><td className="text-right">18%</td></tr>
              <tr><td className="py-1">Profit Margin</td><td className="text-right">16%</td></tr>
            </tbody>
          </table>
        );
      default:
        return <div>No visualization available</div>;
    }
  };

  return (
    <div className="w-full p-4 border rounded-lg bg-muted/30 my-4">
      <div className="flex items-center justify-center gap-2 text-primary mb-2">
        <Calculator size={18} />
        <span className="font-medium">
          {type === 'balance-sheet' ? 'Balance Sheet' :
           type === 'income-statement' ? 'Income Statement' :
           type === 'cash-flow' ? 'Cash Flow Statement' : 
           'Financial Ratios'}
        </span>
      </div>
      <div className="text-sm">
        {renderStatement()}
      </div>
      <div className="text-xs text-center mt-2 text-muted-foreground">
        Interactive version available in Financial Tools
      </div>
    </div>
  );
};

/**
 * Enhanced content renderer that supports:
 * - LaTeX formulas (inline $$formula$$ and block $$$formula$$$)
 * - Financial statement visualization tokens [fin:balance-sheet], [fin:income-statement], etc.
 */
export const renderLatexContent = (content: string, useLatex: boolean) => {
  if (!content) return <span className="text-muted-foreground">No content available</span>;
  if (!useLatex && !content.includes('[fin:')) return content;
  
  // Replace financial visualization tokens
  if (content.includes('[fin:')) {
    const finMatch = content.match(/\[fin:(balance-sheet|income-statement|cash-flow|ratio)\]/);
    if (finMatch) {
      const statementType = finMatch[1] as 'balance-sheet' | 'income-statement' | 'cash-flow' | 'ratio';
      return (
        <div className="flex flex-col items-center">
          <div className="text-center mb-4">{content.replace(finMatch[0], '')}</div>
          <FinancialStatementVisualizer type={statementType} />
        </div>
      );
    }
  }

  // If no LaTeX, return content
  if (!useLatex || (!content.includes('$$') && !content.includes('$$$'))) return content;
  
  // Handle mixed content with LaTeX
  const parts: React.ReactNode[] = [];
  
  // First, handle block math with $$$formula$$$ 
  const blockSplit = content.split(/(\\?\$\$\$[^$]*\$\$\$)/g);
  
  blockSplit.forEach((part, index) => {
    if (part.startsWith('$$$') && part.endsWith('$$$')) {
      const formula = part.slice(3, -3);
      try {
        parts.push(
          <div key={`block-${index}`} className="py-2 flex justify-center">
            <BlockMath math={formula} />
          </div>
        );
      } catch (error) {
        console.error('LaTeX rendering error:', error);
        parts.push(<span key={`block-${index}`} className="text-red-500">{part}</span>);
      }
    } else if (part) {
      // Process inline math in this part
      const inlineParts = part.split(/(\\?\$\$[^$]*\$\$)/g);
      inlineParts.forEach((inlinePart, inlineIndex) => {
        if (inlinePart.startsWith('$$') && inlinePart.endsWith('$$')) {
          const formula = inlinePart.slice(2, -2);
          try {
            parts.push(<InlineMath key={`${index}-inline-${inlineIndex}`} math={formula} />);
          } catch (error) {
            console.error('LaTeX rendering error:', error);
            parts.push(<span key={`${index}-inline-${inlineIndex}`} className="text-red-500">{inlinePart}</span>);
          }
        } else if (inlinePart) {
          parts.push(<span key={`${index}-inline-${inlineIndex}`}>{inlinePart}</span>);
        }
      });
    }
  });
  
  return <>{parts}</>;
};
