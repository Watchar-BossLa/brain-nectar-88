
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flashcard } from '@/types/supabase';
import { updateFlashcardAfterReview } from '@/services/spacedRepetition';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Loader2, Calculator, ArrowRight, Brain } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { calculateRetention } from '@/services/spacedRepetition/algorithm';

interface SpacedRepetitionCardProps {
  flashcard: Flashcard;
  onComplete: () => void;
  onUpdateStats?: () => void;
}

const SpacedRepetitionCard: React.FC<SpacedRepetitionCardProps> = ({ 
  flashcard, 
  onComplete,
  onUpdateStats
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [difficultyRating, setDifficultyRating] = useState<number | null>(null);
  const [retentionEstimate, setRetentionEstimate] = useState<number>(1);
  const { toast } = useToast();

  useEffect(() => {
    // Reset state when flashcard changes
    setIsFlipped(false);
    setDifficultyRating(null);
    
    // Calculate estimated current retention
    if (flashcard.next_review_date && flashcard.repetition_count > 0) {
      const reviewDate = new Date(flashcard.next_review_date);
      const now = new Date();
      const daysSinceReview = Math.max(0, (now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Estimate memory strength based on repetition count and difficulty
      const memoryStrength = flashcard.repetition_count * 0.2 * (flashcard.difficulty || 2.5);
      
      // Calculate current retention
      const retention = calculateRetention(daysSinceReview, memoryStrength);
      setRetentionEstimate(retention);
    }
  }, [flashcard.id]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRating = async (difficulty: number) => {
    setDifficultyRating(difficulty);
    setIsSubmitting(true);

    try {
      const { error } = await updateFlashcardAfterReview(flashcard.id, difficulty);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Update stats if callback is provided
      if (onUpdateStats) {
        onUpdateStats();
      }
      
      // Short delay to show the selected rating
      setTimeout(() => {
        onComplete();
        setIsSubmitting(false);
      }, 600);
      
    } catch (error) {
      console.error('Error updating flashcard review:', error);
      toast({
        title: 'Error',
        description: 'Failed to update flashcard. Please try again.',
        variant: 'destructive'
      });
      setIsSubmitting(false);
    }
  };

  /**
   * Enhanced content renderer that supports:
   * - LaTeX formulas (inline $$formula$$ and block $$$formula$$$)
   * - Financial statement visualization tokens [fin:balance-sheet], [fin:income-statement], etc.
   */
  const renderContent = (content: string) => {
    if (!content) return <span className="text-muted-foreground">No content available</span>;
    
    // Replace financial visualization tokens
    if (content.includes('[fin:')) {
      const finMatch = content.match(/\[fin:(balance-sheet|income-statement|cash-flow|ratio)\]/);
      if (finMatch) {
        const statementType = finMatch[1];
        return (
          <div className="flex flex-col items-center">
            <div className="text-center mb-4">{content.replace(finMatch[0], '')}</div>
            <div className="w-full max-w-md p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center justify-center gap-2 text-primary mb-2">
                <Calculator size={18} />
                <span className="font-medium">{formatStatementType(statementType)}</span>
              </div>
              <div className="text-sm">
                {renderFinancialStatement(statementType)}
              </div>
              <div className="text-xs text-center mt-2 text-muted-foreground">
                Interactive version available in Financial Tools
              </div>
            </div>
          </div>
        );
      }
    }

    // Handle mixed content with LaTeX
    // Check if content has LaTeX formulas
    if (!content.includes('$$') && !content.includes('$$$')) return content;
    
    // First, handle block math with $$$formula$$$ 
    const parts: React.ReactNode[] = [];
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

  const formatStatementType = (type: string): string => {
    switch (type) {
      case 'balance-sheet': return 'Balance Sheet';
      case 'income-statement': return 'Income Statement';
      case 'cash-flow': return 'Cash Flow Statement';
      case 'ratio': return 'Financial Ratios';
      default: return type;
    }
  };

  const renderFinancialStatement = (type: string): React.ReactNode => {
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

  const getRatingText = (rating: number): string => {
    switch (rating) {
      case 1: return "Complete Blackout";
      case 2: return "Very Difficult";
      case 3: return "Difficult";
      case 4: return "Easy";
      case 5: return "Perfect Recall";
      default: return "";
    }
  };

  const getRatingColor = (rating: number): string => {
    switch (rating) {
      case 1: return "bg-red-500 hover:bg-red-600";
      case 2: return "bg-orange-500 hover:bg-orange-600";
      case 3: return "bg-yellow-500 hover:bg-yellow-600";
      case 4: return "bg-green-500 hover:bg-green-600";
      case 5: return "bg-emerald-500 hover:bg-emerald-600";
      default: return "bg-primary hover:bg-primary/90";
    }
  };

  const getRetentionColor = (retention: number): string => {
    if (retention > 0.8) return "text-emerald-500";
    if (retention > 0.6) return "text-green-500";
    if (retention > 0.4) return "text-yellow-500";
    if (retention > 0.2) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Flashcard Review</CardTitle>
        <CardDescription>
          How well did you remember this card? Be honest for best results.
        </CardDescription>
        
        {/* Memory Retention Indicator */}
        {flashcard.repetition_count > 0 && (
          <div className="mt-2">
            <div className="flex items-center gap-2 mb-1">
              <Brain size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Estimated Retention:</span>
              <span className={`text-sm font-medium ${getRetentionColor(retentionEstimate)}`}>
                {Math.round(retentionEstimate * 100)}%
              </span>
            </div>
            <Progress value={retentionEstimate * 100} className="h-1.5" />
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex justify-center pb-8">
        <div 
          className="relative w-full h-[300px] cursor-pointer"
          onClick={handleFlip}
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.div 
              key={isFlipped ? 'back' : 'front'}
              initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full h-full flex items-center justify-center"
            >
              <div className="w-full h-full flex flex-col items-center justify-center p-6 border rounded-lg bg-card overflow-auto">
                <div className="text-lg font-medium text-center mb-4">
                  {isFlipped ? 'Answer' : 'Question'}
                </div>
                <div className="text-xl text-center">
                  {renderContent(isFlipped ? flashcard.back_content : flashcard.front_content)}
                </div>
                <div className="text-sm text-muted-foreground mt-4">
                  {isFlipped ? 'Click to see question' : 'Click to reveal answer'}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </CardContent>
      
      <CardFooter className="flex-col space-y-4">
        {isFlipped && (
          <>
            <div className="text-center mb-2">How well did you remember this?</div>
            <div className="flex flex-wrap justify-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  onClick={() => handleRating(rating)}
                  disabled={isSubmitting}
                  className={`${getRatingColor(rating)} ${difficultyRating === rating ? 'ring-2 ring-offset-2' : ''}`}
                >
                  <span className="mr-1">{rating}</span>
                  <span className="hidden sm:inline">{getRatingText(rating)}</span>
                </Button>
              ))}
            </div>
          </>
        )}
        {!isFlipped && (
          <Button 
            onClick={handleFlip}
            className="w-full"
          >
            Show Answer
          </Button>
        )}
        
        {isSubmitting && (
          <div className="flex justify-center mt-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default SpacedRepetitionCard;
