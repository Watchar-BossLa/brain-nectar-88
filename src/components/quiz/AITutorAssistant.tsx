
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface AITutorAssistantProps {
  question?: string;
  subject?: "accounting" | "finance" | "mathematics";
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const AITutorAssistant: React.FC<AITutorAssistantProps> = ({
  question = "",
  subject = "accounting",
  isOpen,
  onClose,
  children
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI Tutor Assistant</DialogTitle>
          <DialogDescription>
            I can help explain concepts and answer questions about {subject}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4 max-h-64 overflow-y-auto">
          {children ? (
            children
          ) : (
            <div className="space-y-4">
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">Question:</p>
                <p>{question}</p>
              </div>
              
              <div>
                <p className="font-medium">Explanation:</p>
                <p>The AI tutor would provide an explanation here based on your question.</p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AITutorAssistant;
