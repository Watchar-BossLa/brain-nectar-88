
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const HelpContent: React.FC = () => {
  return (
    <Card className="border-t-0 rounded-t-none">
      <CardHeader className="pb-1">
        <CardTitle className="text-lg">Flashcard Creation Tips</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <h4 className="font-medium">Text Content</h4>
          <p>Simple text for definitions, concepts, or explanations.</p>
        </div>

        <div>
          <h4 className="font-medium">Math Formulas</h4>
          <p>Use TeX syntax with <code>$$formula$$</code> for inline formulas or <code>$$formula$$</code> for display formulas.</p>
          <p className="text-muted-foreground">Example: <code>$$E = mc^2$$</code></p>
        </div>

        <div>
          <h4 className="font-medium">Code Snippets</h4>
          <p>Use code blocks with triple backticks and specify the language:</p>
          <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
            ```javascript
            function example() {
              return "Hello World";
            }
            ```
          </pre>
        </div>

        <div>
          <h4 className="font-medium">Best Practices</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Keep front side concise and focused on one concept</li>
            <li>For the back, include a clear explanation</li>
            <li>Consider adding examples to reinforce understanding</li>
            <li>For complex topics, break into multiple flashcards</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default HelpContent;
