
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { AgentType, TaskPriority, TaskStatus, TaskType } from '@/services/agents/types/agentTypes';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface AITutorAssistantProps {
  questionContent?: string;
  userAnswer?: string;
  correctAnswer?: string;
  subject?: string;
  topic?: string;
  difficulty?: number;
}

const AITutorAssistant: React.FC<AITutorAssistantProps> = ({
  questionContent = '',
  userAnswer = '',
  correctAnswer = '',
  subject = 'Accounting',
  topic = 'Financial Statements',
  difficulty = 2
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI tutor. How can I help you understand this topic better?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: newMessage,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);
    
    try {
      // Create a simulated AI tutoring task
      const tutorTask = {
        id: `task-${Date.now()}`,
        type: TaskType.TUTORING,
        data: {
          userMessage: newMessage,
          questionContent,
          userAnswer,
          correctAnswer,
          subject,
          topic,
        },
        priority: TaskPriority.MEDIUM,
        agentType: AgentType.TUTORING,
        createdAt: new Date().toISOString(),
        status: TaskStatus.PENDING
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate AI response based on the context
      let aiResponse = 'I understand you\'re asking about ';
      
      if (newMessage.toLowerCase().includes('wrong')) {
        aiResponse += `why your answer was incorrect. The key difference between your answer "${userAnswer}" and the correct answer "${correctAnswer}" is that...`;
      } else if (newMessage.toLowerCase().includes('hint')) {
        aiResponse += `this ${topic} question. Here's a hint without giving away the answer: Focus on the relationship between assets and liabilities in this context.`;
      } else {
        aiResponse += `${topic}. This is an important concept in ${subject}. Let me explain it in a way that might help your understanding...`;
      }
      
      // Add AI response
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error in AI tutoring:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">AI Tutor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-[350px] overflow-y-auto p-4 border rounded-md mb-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`p-3 rounded-lg ${
                message.isUser 
                  ? 'bg-primary text-primary-foreground ml-auto' 
                  : 'bg-muted'
              } max-w-[80%] ${message.isUser ? 'ml-auto' : 'mr-auto'}`}
            >
              <p>{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))}
          {isLoading && (
            <div className="p-3 rounded-lg bg-muted max-w-[80%] mr-auto flex items-center">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <p>Thinking...</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex space-x-2">
          <Textarea
            placeholder="Ask a question about this topic..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !newMessage.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AITutorAssistant;
