
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MathJax } from 'better-react-mathjax';

interface FlashcardPreviewProps {
  frontContent: string;
  backContent: string;
  useLatex?: boolean;
}

const FlashcardPreview: React.FC<FlashcardPreviewProps> = ({
  frontContent,
  backContent,
  useLatex = false
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };
  
  const renderContent = (content: string) => {
    if (useLatex) {
      return <MathJax>{content}</MathJax>;
    }
    
    return content.split('\n').map((line, i) => (
      <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
    ));
  };
  
  return (
    <div className="py-4 space-y-6">
      <div className="text-sm text-center text-muted-foreground mb-2">
        Click the card to flip between front and back sides
      </div>
      
      <Card 
        className="h-64 relative perspective-1000 mx-auto max-w-md cursor-pointer"
        onClick={handleClick}
      >
        <div 
          className={`absolute inset-0 w-full h-full transition-transform duration-500 preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front of card */}
          <CardContent className="absolute inset-0 backface-hidden p-4 flex flex-col items-center justify-center">
            <div className="w-full overflow-auto">
              {frontContent ? renderContent(frontContent) : (
                <p className="text-muted-foreground">Front content will appear here</p>
              )}
            </div>
          </CardContent>
          
          {/* Back of card */}
          <CardContent className="absolute inset-0 backface-hidden rotate-y-180 p-4 flex flex-col items-center justify-center">
            <div className="w-full overflow-auto">
              {backContent ? renderContent(backContent) : (
                <p className="text-muted-foreground">Back content will appear here</p>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
      
      <div className="text-center text-xs text-muted-foreground">
        {isFlipped ? 'Back side' : 'Front side'}
      </div>
    </div>
  );
};

export default FlashcardPreview;
