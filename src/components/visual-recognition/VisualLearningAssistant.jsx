
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BrainCircuit, Sparkles, Book } from 'lucide-react';

/**
 * Visual Learning Assistant component
 * This component provides AI-powered insights for the recognized content
 * 
 * @param {Object} props - Component props
 * @param {Object} props.recognizedContent - The recognized content (equations or notes)
 * @param {string} props.contentType - Type of content ('equation' or 'notes')
 * @returns {React.ReactElement} Visual Learning Assistant component
 */
const VisualLearningAssistant = ({ recognizedContent, contentType }) => {
  // Generate insight suggestions based on content
  const getInsightSuggestions = () => {
    if (contentType === 'equation') {
      const latex = recognizedContent?.latex || '';
      
      // Check for specific equation patterns and provide relevant insights
      if (latex.includes('=') && latex.includes('+')) {
        return [
          "This equation uses addition with a variable",
          "Try substituting different values to understand the relationship",
          "Graph the equation to visualize the function"
        ];
      } else if (latex.includes('\\frac{d}{dx}')) {
        return [
          "This is a derivative expression from calculus",
          "Key concept: rate of change of a function",
          "Related topics: limits, integrals, differentiability"
        ];
      } else if (latex.includes('\\int')) {
        return [
          "This is an integral expression from calculus",
          "Key concept: accumulation or area under a curve",
          "Try using substitution or integration by parts methods"
        ];
      } else {
        return [
          "Break down the equation into simpler components",
          "Identify the variables and constants",
          "Look for patterns or similarities to known equations"
        ];
      }
    } else {
      const text = recognizedContent?.text || '';
      const concepts = recognizedContent?.concepts || [];
      
      if (concepts.includes('accounting') || text.toLowerCase().includes('accounting')) {
        return [
          "Review key accounting principles like double-entry",
          "Practice with simple transactions to solidify concepts",
          "Create balance sheets to visualize relationships"
        ];
      } else if (concepts.includes('finance') || text.toLowerCase().includes('finance')) {
        return [
          "Work through example problems with different interest rates",
          "Use financial calculators to verify your manual calculations",
          "Connect these concepts to real-world financial decisions"
        ];
      } else if (concepts.includes('economics') || text.toLowerCase().includes('economics')) {
        return [
          "Draw supply and demand curves to visualize equilibrium",
          "Consider how different factors shift the curves",
          "Apply these concepts to current market examples"
        ];
      } else {
        return [
          "Create summary notes with key concepts highlighted",
          "Make connections to previously learned material",
          "Test your understanding by explaining concepts in your own words"
        ];
      }
    }
  };

  const insights = getInsightSuggestions();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Learning Assistant</CardTitle>
            <CardDescription>AI-powered insights for your content</CardDescription>
          </div>
          <div className="bg-primary/10 p-2 rounded-full">
            <BrainCircuit className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Study Suggestions</h4>
          <ul className="space-y-2">
            {insights.map((insight, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                {index % 2 === 0 ? (
                  <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                ) : (
                  <Book className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                )}
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualLearningAssistant;
