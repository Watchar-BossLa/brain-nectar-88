
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Bot, X, RefreshCw, Copy, Link, Download, 
  Brain, ArrowRight, ChevronRight, Check
} from 'lucide-react';
import { AITutorAssistantProps } from '../../types/platform-types';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useLLMOrchestration } from '@/hooks/useLLMOrchestration';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

const AITutorAssistant: React.FC<AITutorAssistantProps> = ({
  mediaSource,
  mediaType,
  subject,
  question,
  isOpen,
  onClose
}) => {
  const [dialogOpen, setDialogOpen] = useState(isOpen);
  const [userInput, setUserInput] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  const { isInitialized, generateText, TaskCategory } = useLLMOrchestration();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isLoading) {
      setProgress(0);
      timer = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 - prev) * 0.1;
          return newProgress >= 95 ? 95 : newProgress;
        });
      }, 300);
    } else {
      setProgress(100);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLoading]);

  const analyzeImage = async () => {
    if (!mediaSource) {
      toast.error("No image to analyze");
      return;
    }
    
    setIsLoading(true);
    const contextPrompt = `
      I need help with this ${subject || ''} problem. 
      ${question ? `The question is: ${question}` : ''}
      Please analyze the image of the equation/problem and:
      1. First explain what the problem/equation is asking
      2. Provide a step-by-step solution
      3. Explain each step clearly
      4. Provide any relevant formulas or concepts needed to understand this
    `;
    
    try {
      // In a real implementation, you'd send the image to a service that can process it
      // For now, we'll simulate using the LLM orchestration
      
      if (isInitialized) {
        const result = await generateText(
          `${contextPrompt}\n\nMedia content: [Image of ${subject || 'academic'} equation/problem]`, 
          TaskCategory.TUTORING,
          0.8, // Higher complexity for educational content
          subject ? [subject] : []
        );
        
        setResponse(result.text);
      } else {
        // Fallback if LLM is not initialized
        setTimeout(() => {
          setResponse(`
            # Analysis
            
            This appears to be a ${subject || 'mathematical'} problem related to 
            ${subject === 'accounting' ? 'balance sheets and accounting equations' :
              subject === 'finance' ? 'financial calculations and valuation' :
              subject === 'mathematics' ? 'algebraic expressions and equations' :
              'academic concepts'}.
            
            ## Step-by-Step Solution
            
            Without being able to fully process the image, I can offer some general guidance:
            
            1. First, identify what type of problem you're dealing with
            2. Recall the relevant formulas needed for this type of problem
            3. Organize the given information
            4. Apply the appropriate methods to solve
            
            ## Additional Help
            
            Try typing a specific question about this problem, and I can provide more targeted assistance.
          `);
        }, 2000);
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast.error("Failed to analyze the image. Please try again.");
      setResponse("I'm sorry, I couldn't analyze this image. Please try again or type your question below for assistance.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    
    setIsLoading(true);
    const previousResponse = response;
    
    try {
      if (isInitialized) {
        const result = await generateText(
          `Previous context: ${previousResponse}\n\nUser question: ${userInput}`,
          TaskCategory.TUTORING,
          0.8,
          subject ? [subject] : []
        );
        
        setResponse(previousResponse + "\n\n## Follow-up Response\n\n" + result.text);
      } else {
        // Fallback
        setTimeout(() => {
          setResponse(previousResponse + "\n\n## Follow-up Response\n\n" + 
            `I'd be happy to help with your question: "${userInput}"\n\n` +
            "Since this is a demo without a live LLM connection, I can only provide general guidance. " +
            "In a complete implementation, this would use a fine-tuned LLM to provide specific help for your question."
          );
        }, 1500);
      }
      
      setUserInput('');
    } catch (error) {
      console.error("Error getting response:", error);
      toast.error("Failed to get a response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(response).then(() => {
      setIsCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const closeDialog = () => {
    setDialogOpen(false);
    if (onClose) onClose();
  };

  useEffect(() => {
    if (isOpen && mediaSource) {
      analyzeImage();
    }
  }, [isOpen, mediaSource]);

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => {
      if (!open) closeDialog();
    }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              AI Tutor Assistant
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={closeDialog} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            {subject ? `Get help with ${subject} problems` : 'Get help with your academic problems'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col min-h-[400px]">
          {mediaSource && mediaType === 'image' && (
            <div className="flex gap-2 mb-4 overflow-x-auto">
              <Card className="w-32 h-32 flex-shrink-0">
                <CardContent className="p-0 h-full">
                  <img 
                    src={mediaSource} 
                    alt="Captured problem" 
                    className="w-full h-full object-cover"
                  />
                </CardContent>
              </Card>
            </div>
          )}
          
          <div className="flex-1 overflow-y-auto mb-4 border rounded-md p-4 bg-muted/30 relative">
            {isLoading && !response && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10">
                <Brain className="h-12 w-12 text-primary animate-pulse mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Analyzing your problem...</p>
                <Progress value={progress} className="w-64" />
              </div>
            )}
            
            {response ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: response.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <Brain className="h-12 w-12 mb-2" />
                <p>Waiting to analyze your problem...</p>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={!response || isLoading}
                onClick={analyzeImage}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Reanalyze
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                disabled={!response}
                onClick={copyToClipboard}
              >
                {isCopied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {isCopied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Textarea
                placeholder="Ask a follow-up question..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-1"
                disabled={isLoading || !response}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!userInput.trim() || isLoading}
                className="self-end"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={closeDialog}>
            Close
          </Button>
          
          <Button variant="default" className="sm:w-auto w-full">
            <ChevronRight className="h-4 w-4 mr-1" />
            See Related Study Material
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AITutorAssistant;
