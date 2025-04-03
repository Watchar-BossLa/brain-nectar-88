
import React from 'react';

const HelpContent: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">LaTeX Formula Examples</h3>
        <p className="text-sm text-muted-foreground">
          Use double dollar signs for inline formulas: <code>{`$$E = mc^2$$`}</code>
        </p>
        <p className="text-sm text-muted-foreground">
          Use triple dollar signs for block display: <code>{`$$$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$$`}</code>
        </p>
        
        <h3 className="text-lg font-medium mt-4">Common Accounting Formulas</h3>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
          <li><code>{`Current Ratio = $$\\frac{Current Assets}{Current Liabilities}$$`}</code></li>
          <li><code>{`Debt-to-Equity Ratio = $$\\frac{Total Debt}{Total Equity}$$`}</code></li>
          <li><code>{`Return on Assets = $$\\frac{Net Income}{Total Assets}$$`}</code></li>
          <li><code>{`Gross Profit Margin = $$\\frac{Gross Profit}{Revenue} \\times 100\\%$$`}</code></li>
        </ul>
        
        <h3 className="text-lg font-medium mt-4">Financial Statement Types</h3>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
          <li><strong>Balance Sheet</strong>: Shows assets, liabilities, and equity at a specific point in time</li>
          <li><strong>Income Statement</strong>: Shows revenues, expenses, and profit over a period</li>
          <li><strong>Cash Flow Statement</strong>: Shows cash inflows and outflows over a period</li>
          <li><strong>Financial Ratios</strong>: Shows key performance indicators for financial analysis</li>
        </ul>
      </div>
    </div>
  );
};

export default HelpContent;
