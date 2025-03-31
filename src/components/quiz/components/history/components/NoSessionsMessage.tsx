
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { History, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NoSessionsMessageProps {
  isLoggedIn?: boolean;
}

const NoSessionsMessage: React.FC<NoSessionsMessageProps> = ({ isLoggedIn = false }) => {
  return (
    <Card>
      <CardContent className="py-10 px-6 text-center">
        <div className="flex justify-center mb-4">
          <History className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Quiz Sessions Yet</h3>
        <p className="text-muted-foreground mb-6">
          {isLoggedIn 
            ? "Complete a quiz to see your history and track your progress over time." 
            : "Your quiz history will be saved here. Sign in to sync across devices."}
        </p>
        {!isLoggedIn && (
          <div className="flex justify-center">
            <Button variant="outline" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Sign in to sync history
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NoSessionsMessage;
