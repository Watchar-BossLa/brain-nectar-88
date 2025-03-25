
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createFlashcard } from '@/services/spacedRepetition';
import { useToast } from '@/hooks/use-toast';
import FlashcardPreview from './FlashcardPreview';
import { Switch } from '@/components/ui/switch';
import { Calculator, BookText, FormInput, Table2 } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdvancedFlashcardFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AdvancedFlashcardForm: React.FC<AdvancedFlashcardFormProps> = ({ onSuccess, onCancel }) => {
  const [frontContent, setFrontContent] = useState('');
  const [backContent, setBackContent] = useState('');
  const [useLatex, setUseLatex] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contentType, setContentType] = useState<'text' | 'financial' | 'formula'>('text');
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

  const getContentTypeIcon = () => {
    switch (contentType) {
      case 'text': return <BookText className="h-4 w-4" />;
      case 'formula': return <FormInput className="h-4 w-4" />;
      case 'financial': return <Calculator className="h-4 w-4" />;
      default: return <BookText className="h-4 w-4" />;
    }
  };

  const renderContentInputs = () => {
    switch (contentType) {
      case 'text':
        return (
          <>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="front-content">Question</Label>
              <Textarea 
                id="front-content"
                placeholder="Enter the question or prompt"
                value={frontContent}
                onChange={(e) => setFrontContent(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="grid w-full gap-1.5 mt-4">
              <Label htmlFor="back-content">Answer</Label>
              <Textarea 
                id="back-content"
                placeholder="Enter the answer or explanation"
                value={backContent}
                onChange={(e) => setBackContent(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </>
        );
      
      case 'formula':
        return (
          <>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="front-content">Formula Question</Label>
              <Textarea 
                id="front-content"
                placeholder="Enter LaTeX formula or question (e.g., What is the formula for compound interest?)"
                value={frontContent}
                onChange={(e) => setFrontContent(e.target.value)}
                className="min-h-[100px] font-mono"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use LaTeX syntax for formulas: $$A = P(1 + r/n)^{nt}$$
              </p>
            </div>
            <div className="grid w-full gap-1.5 mt-4">
              <Label htmlFor="back-content">Formula Answer</Label>
              <Textarea 
                id="back-content"
                placeholder="Enter the LaTeX formula or explanation"
                value={backContent}
                onChange={(e) => setBackContent(e.target.value)}
                className="min-h-[100px] font-mono"
              />
              <p className="text-xs text-muted-foreground mt-1">
                For block display use dollar signs: $$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$
              </p>
            </div>
          </>
        );
      
      case 'financial':
        return (
          <>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="front-content">Financial Concept Question</Label>
              <Textarea 
                id="front-content"
                placeholder="Enter a question about the financial statement"
                value={frontContent}
                onChange={(e) => setFrontContent(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="grid w-full gap-3 mt-4">
              <Label htmlFor="financial-type">Financial Statement Type</Label>
              <Select 
                value={financialType} 
                onValueChange={(value) => setFinancialType(value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select statement type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balance-sheet">Balance Sheet</SelectItem>
                  <SelectItem value="income-statement">Income Statement</SelectItem>
                  <SelectItem value="cash-flow">Cash Flow Statement</SelectItem>
                  <SelectItem value="ratio">Financial Ratios</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full gap-1.5 mt-4">
              <Label htmlFor="back-content">Explanation</Label>
              <Textarea 
                id="back-content"
                placeholder="Enter explanation about the financial concept"
                value={backContent}
                onChange={(e) => setBackContent(e.target.value)}
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                A {financialType.replace('-', ' ')} visualization will be automatically added
              </p>
            </div>
          </>
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
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    type="button"
                    variant={contentType === 'text' ? 'default' : 'outline'}
                    className="flex flex-col items-center justify-center p-4 h-auto"
                    onClick={() => setContentType('text')}
                  >
                    <BookText className="h-8 w-8 mb-2" />
                    <span>Text</span>
                  </Button>
                  
                  <Button
                    type="button"
                    variant={contentType === 'formula' ? 'default' : 'outline'}
                    className="flex flex-col items-center justify-center p-4 h-auto"
                    onClick={() => {
                      setContentType('formula');
                      setUseLatex(true);
                    }}
                  >
                    <FormInput className="h-8 w-8 mb-2" />
                    <span>Formula</span>
                  </Button>
                  
                  <Button
                    type="button"
                    variant={contentType === 'financial' ? 'default' : 'outline'}
                    className="flex flex-col items-center justify-center p-4 h-auto"
                    onClick={() => setContentType('financial')}
                  >
                    <Calculator className="h-8 w-8 mb-2" />
                    <span>Financial</span>
                  </Button>
                </div>
                
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
            
            <TabsContent value="help" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">LaTeX Formula Examples</h3>
                <p className="text-sm text-muted-foreground">
                  Use double dollar signs for inline formulas: <code>$$E = mc^2$$</code>
                </p>
                <p className="text-sm text-muted-foreground">
                  Use triple dollar signs for block display: <code>$$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$$</code>
                </p>
                
                <h3 className="text-lg font-medium mt-4">Common Accounting Formulas</h3>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li><code>Current Ratio = $$\frac{\text{Current Assets}}{\text{Current Liabilities}}$$</code></li>
                  <li><code>Debt-to-Equity Ratio = $$\frac{\text{Total Debt}}{\text{Total Equity}}$$</code></li>
                  <li><code>Return on Assets = $$\frac{\text{Net Income}}{\text{Total Assets}}$$</code></li>
                  <li><code>Gross Profit Margin = $$\frac{\text{Gross Profit}}{\text{Revenue}} \times 100\%$$</code></li>
                </ul>
                
                <h3 className="text-lg font-medium mt-4">Financial Statement Types</h3>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li><strong>Balance Sheet</strong>: Shows assets, liabilities, and equity at a specific point in time</li>
                  <li><strong>Income Statement</strong>: Shows revenues, expenses, and profit over a period</li>
                  <li><strong>Cash Flow Statement</strong>: Shows cash inflows and outflows over a period</li>
                  <li><strong>Financial Ratios</strong>: Shows key performance indicators for financial analysis</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !frontContent || !backContent}
            >
              {isSubmitting ? 'Creating...' : 'Create Flashcard'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdvancedFlashcardForm;
