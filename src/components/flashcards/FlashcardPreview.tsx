
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { renderLatexContent } from './utils/latex-renderer';

interface FlashcardPreviewProps {
  frontContent: string;
  backContent: string;
  useLatex: boolean;
}

const FlashcardPreview: React.FC<FlashcardPreviewProps> = ({ 
  frontContent, 
  backContent,
  useLatex 
}) => {
  return (
    <div className="border rounded-md p-4 mb-4">
      <Tabs defaultValue="front">
        <TabsList>
          <TabsTrigger value="front">Front</TabsTrigger>
          <TabsTrigger value="back">Back</TabsTrigger>
        </TabsList>
        <TabsContent value="front" className="min-h-[100px] pt-4">
          {renderLatexContent(frontContent, useLatex) || 
            <span className="text-muted-foreground">Question preview will appear here</span>}
        </TabsContent>
        <TabsContent value="back" className="min-h-[100px] pt-4">
          {renderLatexContent(backContent, useLatex) || 
            <span className="text-muted-foreground">Answer preview will appear here</span>}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FlashcardPreview;
