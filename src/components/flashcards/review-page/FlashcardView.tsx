
import React from 'react';
import { FlashcardViewProps } from '@/types/components/flashcard';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flashcard } from '@/types/flashcard';
import { motion, AnimatePresence } from 'framer-motion';

const FlashcardView: React.FC<FlashcardViewProps> = ({
  flashcard,
  isFlipped,
  onFlip,
  onRating
}) => {
  return (
    <div className="relative h-96 w-full perspective-1000">
      <AnimatePresence mode="wait">
        <motion.div
          key={flashcard.id + (isFlipped ? '-back' : '-front')}
          initial={{ opacity: 0, rotateY: isFlipped ? -180 : 0 }}
          animate={{ opacity: 1, rotateY: isFlipped ? -180 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="h-full w-full"
        >
          <Card 
            className={`h-full w-full cursor-pointer ${isFlipped ? 'bg-muted/50' : ''}`}
            onClick={onFlip}
          >
            <div className="flex h-full flex-col">
              <CardHeader>
                <CardTitle className="text-xl">
                  {isFlipped ? 'Answer' : 'Question'}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto">
                <div 
                  className="text-xl"
                  style={{ transform: isFlipped ? 'rotateY(180deg)' : 'none' }}
                >
                  {isFlipped 
                    ? <div dangerouslySetInnerHTML={{ __html: flashcard.back_content }} />
                    : <div dangerouslySetInnerHTML={{ __html: flashcard.front_content }} />
                  }
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">
                  {isFlipped
                    ? "Rate how well you remembered this card"
                    : "Click to reveal the answer"}
                </p>
              </CardFooter>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FlashcardView;
