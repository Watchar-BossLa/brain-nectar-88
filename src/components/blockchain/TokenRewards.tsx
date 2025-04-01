
import React, { useState } from 'react';
import { useSolana } from '@/context/blockchain/useSolana';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, TrendingUp, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface TokenRewardsProps {
  availableRewards: number;
  totalEarned: number;
  streakDays: number;
  onClaim?: (amount: number) => void;
}

export const TokenRewards: React.FC<TokenRewardsProps> = ({
  availableRewards,
  totalEarned,
  streakDays,
  onClaim
}) => {
  const { connected, sendTokenReward } = useSolana();
  const [isClaiming, setIsClaiming] = useState(false);
  
  const handleClaim = async () => {
    if (availableRewards <= 0) return;
    
    setIsClaiming(true);
    
    try {
      const success = await sendTokenReward(availableRewards);
      
      if (success && onClaim) {
        onClaim(availableRewards);
      }
    } finally {
      setIsClaiming(false);
    }
  };
  
  const nextMilestone = Math.ceil(totalEarned / 100) * 100;
  const progress = ((totalEarned % 100) / 100) * 100;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-yellow-500" />
          Study Token Rewards
        </CardTitle>
        <CardDescription>Earn tokens for completing learning activities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Available</p>
            <p className="text-2xl font-bold">{availableRewards} <span className="text-sm font-normal">STUDY</span></p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Total Earned</p>
            <p className="text-2xl font-bold">{totalEarned} <span className="text-sm font-normal">STUDY</span></p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Next Milestone</span>
            </div>
            <span className="text-sm font-medium">{nextMilestone} STUDY</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">
            {totalEarned} / {nextMilestone} STUDY tokens
          </p>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Current Streak</span>
          </div>
          <span className="font-medium">{streakDays} days</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleClaim} 
          disabled={!connected || isClaiming || availableRewards <= 0} 
          className="w-full"
        >
          {!connected ? 'Connect Wallet to Claim' : 
            isClaiming ? 'Claiming...' : 
            availableRewards <= 0 ? 'No Rewards Available' : 
            `Claim ${availableRewards} STUDY Tokens`}
        </Button>
      </CardFooter>
    </Card>
  );
};
