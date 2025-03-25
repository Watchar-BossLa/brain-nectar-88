
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { createFlashcard } from '@/services/spacedRepetition';
import { useToast } from '@/hooks/use-toast';
import FlashcardPreview from './FlashcardPreview';

// Import sub-components
import TextContentInput from './form/TextContentInput';
import FormulaContentInput from './form/FormulaContentInput';
import FinancialContentInput from './form/FinancialContentInput';
import ContentTypeSelector from './form/ContentTypeSelector';
import HelpContent from './form/HelpContent';
import FormButtons from './form/FormButtons';

interface AdvancedFlashcardFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AdvancedFlashcardForm: React.FC<AdvancedFlashcardFormProps> = ({ onSuccess, onCancel }) => {
  const [frontContent, setFrontContent] = useState('');
  const [backContent, setBackContent] = useState('');
  const [useLatex, setUseLatex] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contentType, setContentType] = useState<'text' | 'formula' | 'financial'>('text');
  const [financialType, setFinancialType] = useState<'balance-sheet' | 'income-statement' | 'cash-flow' | 'ratio'>('balance-sheet');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Process content based on type
      let processedFrontContent = frontContent;
      let processedBackContent = backContent;

      // Add LaTeX delimiters if formula type is selected
      if (contentType === 'formula' && !frontContent.includes('$$')) {
        processedFrontContent = `$$${frontContent}$$`;
      }
      
      if (contentType === 'formula' && !backContent.includes('$$')) {
        processedBackContent = `$$${backContent}$$`;
      }
      
      // Add financial statement token if financial type is selected
      if (contentType === 'financial') {
        processedBackContent = `${backContent}\n\n[fin:${financialType}]`;
      }

      const { data, error } = await createFlashcard(processedFrontContent, processedBackContent);

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: 'Success',
        description: 'Flashcard created successfully.'
      });

      onSuccess();
    } catch (error) {
      console.error('Error creating flashcard:', error);
      toast({
        title: 'Error',
        description: 'Failed to create flashcard. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContentInputs = () => {
    switch (contentType) {
      case 'text':
        return (
          <TextContentInput 
            frontContent={frontContent}
            setFrontContent={setFrontContent}
            backContent={backContent}
            setBackContent={setBackContent}
          />
        );
      
      case 'formula':
        return (
          <FormulaContentInput
            frontContent={frontContent}
            setFrontContent={setFrontContent}
            backContent={backContent}
            setBackContent={setBackContent}
          />
        );
      
      case 'financial':
        return (
          <FinancialContentInput
            frontContent={frontContent}
            setFrontContent={setFrontContent}
            backContent={backContent}
            setBackContent={setBackContent}
            financialType={financialType}
            setFinancialType={setFinancialType}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Advanced Flashcard</CardTitle>
        <CardDescription>
          Add a new flashcard with advanced formatting options
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="create">Create</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="help">Help</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create" className="space-y-4">
              <div className="flex flex-col space-y-4">
                <ContentTypeSelector 
                  contentType={contentType}
                  setContentType={setContentType}
                  setUseLatex={setUseLatex}
                />
                
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="use-latex"
                    checked={useLatex}
                    onCheckedChange={setUseLatex}
                    disabled={contentType === 'formula'}
                  />
                  <Label htmlFor="use-latex">Enable LaTeX rendering</Label>
                </div>
                
                {renderContentInputs()}
              </div>
            </TabsContent>
            
            <TabsContent value="preview">
              <FlashcardPreview
                frontContent={frontContent}
                backContent={
                  contentType === 'financial'
                    ? `${backContent}\n\n[fin:${financialType}]`
                    : backContent
                }
                useLatex={useLatex || contentType === 'formula'}
              />
            </TabsContent>
            
            <TabsContent value="help">
              <HelpContent />
            </TabsContent>
          </Tabs>
          
          <FormButtons 
            isSubmitting={isSubmitting}
            onCancel={onCancel}
            frontContent={frontContent}
            backContent={backContent}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default AdvancedFlashcardForm;
