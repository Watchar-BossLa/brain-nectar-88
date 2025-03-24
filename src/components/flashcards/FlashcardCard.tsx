
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Flashcard } from '@/types/supabase';
import { format } from 'date-fns';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

interface FlashcardCardProps {
  flashcard: Flashcard;
  onDelete?: (id: string) => void;
}

const FlashcardCard: React.FC<FlashcardCardProps> = ({ 
  flashcard, 
  onDelete 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const renderContent = (content: string) => {
    // Check if content has LaTeX formulas
    if (!content.includes('$$')) return content;
    
    // Replace $$formula$$ with LaTeX rendered formula
    const parts = content.split(/(\\?\$\$[^$]*\$\$)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const formula = part.slice(2, -2);
        try {
          return <InlineMath key={index} math={formula} />;
        } catch (error) {
          console.error('LaTeX rendering error:', error);
          return <span key={index} className="text-red-500">{part}</span>;
        }
      }
      return <span key={index}>{part}</span>;
    });
  };

  const formatDueDate = () => {
    try {
      if (!flashcard.next_review_date) return 'Not scheduled';
      
      const reviewDate = new Date(flashcard.next_review_date);
      const today = new Date();
      
      // If the date is today
      if (reviewDate.toDateString() === today.toDateString()) {
        return 'Due today';
      }
      
      // If the date is in the past
      if (reviewDate < today) {
        return 'Overdue';
      }
      
      // Format the date
      return `Due ${format(reviewDate, 'MMM d, yyyy')}`;
    } catch (error) {
      console.error('Error formatting due date:', error);
      return 'Date error';
    }
  };

  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-500 h-64 cursor-pointer ${
        isFlipped ? 'bg-muted/30' : 'bg-card'
      }`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="absolute top-2 right-2">
        <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
          {formatDueDate()}
        </span>
      </div>
      
      <div 
        className={`absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-500 p-4 ${
          isFlipped ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <CardContent className="p-6 text-center">
          <div className="font-medium text-lg">
            {renderContent(flashcard.front_content)}
          </div>
          <p className="text-sm text-muted-foreground mt-2">Click to reveal answer</p>
        </CardContent>
      </div>
      
      <div 
        className={`absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-500 p-4 ${
          isFlipped ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <CardContent className="p-6 text-center">
          <div className="font-medium">
            {renderContent(flashcard.back_content)}
          </div>
          <p className="text-sm text-muted-foreground mt-2">Click to see question</p>
        </CardContent>
      </div>
      
      {onDelete && (
        <CardFooter className="absolute bottom-0 left-0 right-0 justify-end p-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(flashcard.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default FlashcardCard;
