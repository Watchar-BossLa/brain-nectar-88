
import React from 'react';
import { MessageCircle } from 'lucide-react';

const DiscussionTab = () => {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <MessageCircle className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-medium mb-2">Course Discussion</h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        Engage with instructors and fellow students to discuss course topics and ask questions.
      </p>
    </div>
  );
};

export default DiscussionTab;
