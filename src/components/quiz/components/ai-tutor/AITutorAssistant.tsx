
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { TaskCategory } from '@/services/llm/types';
import { agentIntegration } from '@/services/llm/agentIntegration';

// Define message type to match expected interface
type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
};

interface AITutorAssistantProps {
  mediaSource?: string;
  mediaType: 'image' | 'text';
  subject?: string;
  question?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AITutorAssistant: React.FC<AITutorAssistantProps> = ({
  mediaSource,
  mediaType,
  subject = 'accounting',
  question = '',
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Initialize with context from the question
  useEffect(() => {
    if (isOpen && question) {
      const initialMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: question,
        timestamp: new Date()
      };
      setMessages([initialMessage]);
      
      // Auto-process the initial question
      processUserRequest(question);
    }
  }, [isOpen, question]);

  const processUserRequest = async (content: string) => {
    setIsProcessing(true);
    
    try {
      const taskResponse = await agentIntegration.processAgentTask({
        id: `task-${Date.now()}`,
        userId: 'current-user',
        taskType: 'TUTORING',
        description: `AI tutor assistance for ${subject}`,
        priority: 'MEDIUM',
        targetAgentTypes: ['TUTORING'],
        context: [subject, 'education', 'assistance'],
        data: {
          query: content,
          mediaType: mediaType,
          mediaSource: mediaSource,
          subject: subject
        },
        createdAt: new Date().toISOString(),
        status: 'processing'
      });
      
      // Check if the task completed successfully
      if (taskResponse && taskResponse.result === 'success') {
        // Add assistant response
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: taskResponse.data?.recommendations?.join('\n\n') || 'I analyzed your question but couldn\'t generate a helpful response. Could you provide more details?',
            timestamp: new Date()
          }
        ]);
      } else if (taskResponse === 'FAILED') {
        toast({
          title: 'Error',
          description: 'Failed to process your request. Please try again.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error processing AI tutor task:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while connecting to the AI tutor service.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    processUserRequest(input);
    setInput('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>AI Tutor Assistant</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 border rounded-md my-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground">
              Ask the AI tutor for help with understanding this topic or question.
            </div>
          )}
          
          {messages.map(message => (
            <div 
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-lg flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>AI Tutor is thinking...</span>
              </div>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <Textarea 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Ask a follow-up question..."
            className="resize-none"
            rows={2}
          />
          <Button type="submit" size="icon" disabled={isProcessing || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
        
        <DialogFooter className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            {subject && <span>Subject: {subject}</span>}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AITutorAssistant;
