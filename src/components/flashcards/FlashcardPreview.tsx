
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { renderLatexContent } from './utils/latex-renderer';
import { Card, CardContent } from '@/components/ui/card';

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
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Preview how your flashcard will appear</h3>
      
      <Tabs defaultValue="front">
        <TabsList>
          <TabsTrigger value="front">Front</TabsTrigger>
          <TabsTrigger value="back">Back</TabsTrigger>
          <TabsTrigger value="card">Card View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="front" className="min-h-[120px] pt-4">
          {renderLatexContent(frontContent, useLatex) || 
            <span className="text-muted-foreground">Question preview will appear here</span>}
        </TabsContent>
        
        <TabsContent value="back" className="min-h-[120px] pt-4">
          {renderLatexContent(backContent, useLatex) || 
            <span className="text-muted-foreground">Answer preview will appear here</span>}
        </TabsContent>
        
        <TabsContent value="card" className="min-h-[220px] pt-4">
          <Card className="border h-[200px] relative overflow-hidden transition-all duration-500 cursor-pointer hover:shadow-md">
            <CardContent className="p-6 flex items-center justify-center h-full">
              <div className="text-center">
                {renderLatexContent(frontContent, useLatex) || 
                  <span className="text-muted-foreground">Question preview will appear here</span>}
                <div className="text-xs text-muted-foreground mt-2">
                  Click to flip (in real card)
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FlashcardPreview;
