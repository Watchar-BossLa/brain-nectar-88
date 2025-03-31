
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Users, Send, Clock } from 'lucide-react';

interface ChallengeCardProps {
  onStartChallenge?: () => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ onStartChallenge }) => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendInvite = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    setIsSending(true);
    
    // In a real implementation, this would send the challenge via API
    setTimeout(() => {
      toast({
        title: "Challenge sent!",
        description: `Invitation sent to ${email}`,
      });
      setEmail('');
      setIsSending(false);
    }, 1000);
  };

  const handleQuickChallenge = () => {
    if (onStartChallenge) {
      onStartChallenge();
    }
    
    toast({
      title: "Challenge started!",
      description: "Complete the quiz to see how you rank against others",
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Challenge Friends
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-3">
            Invite a friend to take the same quiz and compare your results
          </p>
          
          <div className="flex gap-2">
            <Input
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="flex-1"
            />
            <Button 
              onClick={handleSendInvite} 
              disabled={isSending}
              className="flex items-center gap-1"
            >
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </div>

        <div className="border-t pt-3">
          <p className="text-sm text-muted-foreground mb-3">
            Or start a timed challenge and compete on the leaderboard
          </p>
          
          <Button 
            onClick={handleQuickChallenge}
            variant="outline" 
            className="w-full flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            Quick Challenge
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChallengeCard;
