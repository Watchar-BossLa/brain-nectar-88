
import React from 'react';

const HelpContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h3 className="text-lg font-medium">Basic Text Flashcards</h3>
        <p className="text-sm text-muted-foreground">
          Basic text flashcards are perfect for simple question and answer pairs.
          You can use line breaks to structure your content.
        </p>
        <pre className="p-3 text-xs bg-muted rounded-md overflow-x-auto">
          <code>
            {"Front: What is the accounting equation?\n\nBack: Assets = Liabilities + Equity"}
          </code>
        </pre>
      </section>
      
      <section className="space-y-2">
        <h3 className="text-lg font-medium">Formula Flashcards with LaTeX</h3>
        <p className="text-sm text-muted-foreground">
          Use LaTeX to create beautifully formatted mathematical formulas. Here are some examples:
        </p>
        <div className="space-y-2 text-xs">
          <div className="p-2 bg-muted rounded-md">
            <p className="font-medium mb-1">Simple fraction:</p>
            <code>ROA = \frac{"{Net Income}"}{"{Total Assets}"}</code>
          </div>
          
          <div className="p-2 bg-muted rounded-md">
            <p className="font-medium mb-1">Summation:</p>
            <code>\sum_{"{i=1}"}^{"{n}"} X_i</code>
          </div>
          
          <div className="p-2 bg-muted rounded-md">
            <p className="font-medium mb-1">Present value formula:</p>
            <code>PV = \frac{"{FV}"}{"{(1+r)^n}"}</code>
          </div>
        </div>
      </section>
      
      <section className="space-y-2">
        <h3 className="text-lg font-medium">Financial Statement Flashcards</h3>
        <p className="text-sm text-muted-foreground">
          Create flashcards with structured financial information. Use line breaks to format your statements clearly.
        </p>
        <pre className="p-3 text-xs bg-muted rounded-md overflow-x-auto">
          <code>
{`Assets:
- Cash: $10,000
- Accounts Receivable: $5,000

Liabilities:
- Accounts Payable: $3,000

Equity:
- Common Stock: $12,000`}
          </code>
        </pre>
      </section>
      
      <div className="mt-4 pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          Remember: Good flashcards use the principle of active recall by asking specific questions
          that test your understanding rather than simple memorization.
        </p>
      </div>
    </div>
  );
};

export default HelpContent;
