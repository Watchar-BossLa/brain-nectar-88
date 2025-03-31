
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send, X, Image, MessageSquare } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

export interface AITutorAssistantProps {
  mediaSource?: string;
  mediaType?: "image" | "text";
  subject?: string;
  question?: string;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AITutorAssistant: React.FC<AITutorAssistantProps> = ({
  mediaSource,
  mediaType = "text",
  subject = "accounting",
  question = "",
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Add initial assistant message when component loads
  React.useEffect(() => {
    if (question) {
      const initialMessages: Message[] = [
        {
          role: "assistant",
          content: `Hello! I'm your AI study assistant for ${subject}. How can I help you understand this question better?`
        }
      ];
      setMessages(initialMessages);
    }
  }, [question, subject]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      role: "user",
      content: inputMessage
    };
    setMessages([...messages, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate simple response based on the question
      let response = `I understand your question about ${subject}. `;
      if (question) {
        response += `Regarding "${question}", here's what I can explain: this involves key concepts in ${subject} that relate to accounting principles. Would you like me to break this down step by step?`;
      } else {
        response += `I can help you understand concepts in ${subject}. What specific part are you struggling with?`;
      }
      
      const aiMessage: Message = {
        role: "assistant",
        content: response
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "I'm sorry, I encountered an error while generating a response. Please try again."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI Study Assistant
          </DialogTitle>
        </DialogHeader>
        
        {mediaSource && mediaType === "image" && (
          <div className="bg-muted/20 rounded-md p-2 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Image className="h-4 w-4" />
              <span className="text-sm font-medium">Image attached</span>
            </div>
            <div className="relative rounded-md overflow-hidden h-[200px]">
              <img 
                src={mediaSource} 
                alt="Captured content" 
                className="w-full h-full object-contain bg-black/5"
              />
            </div>
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-[300px] min-h-[200px]">
          {messages.map((msg, index) => (
            <div 
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`flex gap-3 max-w-[80%] ${
                  msg.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <Avatar className={`h-8 w-8 ${
                  msg.role === 'assistant' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}>
                  {msg.role === 'assistant' ? 'AI' : 'ME'}
                </Avatar>
                <div 
                  className={`rounded-lg px-4 py-2 ${
                    msg.role === 'assistant' 
                      ? 'bg-muted' 
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                  AI
                </Avatar>
                <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Textarea 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about this topic..."
            className="resize-none min-h-[60px]"
          />
          <Button 
            onClick={handleSendMessage} 
            size="icon" 
            disabled={isLoading || !inputMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AITutorAssistant;
