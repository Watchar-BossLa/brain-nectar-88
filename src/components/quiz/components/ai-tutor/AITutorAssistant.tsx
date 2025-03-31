
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CircleCheck, Loader2, Send } from 'lucide-react';
import { useAuth } from '@/context/auth';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { masterControlProgram } from '@/services/agents/mcp/MasterControlProgram';
import { TaskCategory, TaskPriority } from '@/services/agents/types';

type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
};

interface ChatProps {
  quizSubject?: string;
  question?: string;
  correctAnswer?: string;
}

export const AITutorAssistant: React.FC<ChatProps> = ({ quizSubject, question, correctAnswer }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [tuningEnabled, setTuningEnabled] = useState(true);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState<string | null>(null);

  // Initialize the chat
  useEffect(() => {
    if (!initialized && user) {
      const systemMessage = {
        id: 'system-1',
        role: 'system',
        content: `Welcome to your AI accounting tutor assistant. I can help you with questions about ${quizSubject || 'accounting topics'}.`,
        timestamp: new Date(),
      };
      
      setMessages([systemMessage]);
      setInitialized(true);
      
      // If there's a question provided, set it up as context
      if (question) {
        const questionContext = `I need help with this question: ${question}${
          correctAnswer ? `\n\nThe correct answer is: ${correctAnswer}` : ''
        }`;
        
        setInput(questionContext);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }
  }, [user, initialized, question, correctAnswer, quizSubject]);

  // Scroll to bottom of messages
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Poll for task status updates
  useEffect(() => {
    if (!taskId) return;
    
    const checkStatus = async () => {
      try {
        const status = await masterControlProgram.getTaskStatus(taskId);
        setTaskStatus(status || null);
        
        if (status === 'COMPLETED') {
          const result = await masterControlProgram.getTaskResult(taskId);
          
          if (result) {
            const assistantMessage: Message = {
              id: `assistant-${Date.now()}`,
              role: 'assistant',
              content: result.data?.response || 'I\'ve thought about your question, but I\'m not sure how to help with that specific topic.',
              timestamp: new Date(),
            };
            
            setMessages(prev => [...prev, assistantMessage]);
            setLoading(false);
          }
        } else if (status === 'FAILED') {
          const assistantMessage: Message = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: 'I\'m sorry, I encountered an error while processing your question. Please try again or ask something different.',
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, assistantMessage]);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking task status:', error);
      }
    };
    
    const intervalId = setInterval(checkStatus, 2000);
    return () => clearInterval(intervalId);
  }, [taskId]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading || !user) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      // Create a task for the tutoring agent
      const newTaskId = await masterControlProgram.submitTask(
        TaskCategory.TUTORING,
        'User question for AI tutor',
        {
          userId: user.id,
          question: input.trim(),
          context: {
            quizSubject,
            recentQuestion: question,
            correctAnswer
          },
          useTuning: tuningEnabled
        },
        TaskPriority.HIGH
      );
      
      if (newTaskId) {
        setTaskId(newTaskId);
      } else {
        throw new Error('Failed to create tutoring task');
      }
    } catch (error) {
      console.error('Error sending message to AI tutor:', error);
      
      // Fallback response if task creation fails
      const fallbackMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: 'I\'m sorry, I\'m having trouble connecting to the accounting knowledge base right now. Please try again later.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/assets/tutor-avatar.png" alt="AI Tutor" />
              <AvatarFallback>AT</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">Accounting Tutor</CardTitle>
              <CardDescription>Ask questions about accounting concepts</CardDescription>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Label htmlFor="tuning" className="text-xs">Accounting Specialization</Label>
            <Switch
              id="tuning"
              checked={tuningEnabled}
              onCheckedChange={setTuningEnabled}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto pb-0">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : message.role === 'system'
                    ? 'bg-muted text-muted-foreground text-sm'
                    : 'bg-muted'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>
      </CardContent>
      
      <CardFooter className="pt-4">
        <div className="relative w-full">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about accounting..."
            className="pr-12 min-h-[60px] resize-none"
            disabled={loading}
          />
          <Button
            size="icon"
            className="absolute right-2 bottom-2"
            onClick={handleSendMessage}
            disabled={!input.trim() || loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
