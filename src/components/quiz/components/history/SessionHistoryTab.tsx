
import React, { useState } from 'react';
import { useSessionHistory } from '../../hooks/adaptive-quiz/useSessionHistory';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Trash2, LogIn, Cloud, Server } from 'lucide-react';
import { 
  NoSessionsMessage, 
  SessionTabContent,
  DeleteConfirmDialog,
  ExportMenu
} from './components';
import { useAuth } from '@/context/auth/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const SessionHistoryTab: React.FC<{
  onViewSession: (sessionId: string) => void;
}> = ({ onViewSession }) => {
  const { getSessionSummaries, deleteSession, clearHistory } = useSessionHistory();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const sessions = getSessionSummaries();
  
  const handleDeleteSession = (id: string) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (confirmDeleteId) {
      await deleteSession(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };
  
  const handleClearHistory = () => {
    setShowClearDialog(true);
  };
  
  const confirmClearHistory = async () => {
    await clearHistory();
    setShowClearDialog(false);
  };

  const handleSignInPrompt = () => {
    toast({
      title: "Sign in to sync your quiz history",
      description: "Create an account to access your quiz history across all your devices",
    });
  };
  
  if (sessions.length === 0) {
    return <NoSessionsMessage isLoggedIn={!!user} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-xl font-semibold flex items-center mb-1">
            <BarChart3 className="h-5 w-5 mr-2" /> Quiz History
          </div>
          <p className="text-muted-foreground text-sm">
            Track your progress and review past quiz sessions
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          {!user && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignInPrompt}
              className="flex items-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              Sign in to sync
            </Button>
          )}
          {user && (
            <div className="flex items-center text-sm text-muted-foreground mr-2">
              <Cloud className="h-4 w-4 mr-1 text-primary" />
              <span>Synced to cloud</span>
            </div>
          )}
          
          <div className="flex gap-2">
            <ExportMenu sessions={sessions} />
            <Button 
              variant="outline" 
              size="sm" 
              className="text-destructive" 
              onClick={handleClearHistory}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear History
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Sessions</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="best">Best Scores</TabsTrigger>
        </TabsList>
        
        <SessionTabContent 
          value="all"
          sessions={sessions} 
          onViewSession={onViewSession} 
          onDeleteSession={handleDeleteSession} 
        />
        
        <SessionTabContent 
          value="recent"
          sessions={sessions.slice(0, 5)} 
          onViewSession={onViewSession} 
          onDeleteSession={handleDeleteSession} 
        />
        
        <SessionTabContent 
          value="best"
          sessions={[...sessions].sort((a, b) => b.scorePercentage - a.scorePercentage).slice(0, 5)} 
          onViewSession={onViewSession} 
          onDeleteSession={handleDeleteSession} 
        />
      </Tabs>

      <DeleteConfirmDialog
        open={!!confirmDeleteId}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Session"
        description="Are you sure you want to delete this quiz session? This action cannot be undone."
      />
      
      <DeleteConfirmDialog
        open={showClearDialog}
        onOpenChange={setShowClearDialog}
        onConfirm={confirmClearHistory}
        title="Clear All History"
        description={`Are you sure you want to clear your entire quiz history? This will delete all ${sessions.length} sessions and cannot be undone.`}
      />
    </div>
  );
};

export default SessionHistoryTab;
