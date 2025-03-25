
import React from 'react';
import { TokenRewards } from './TokenRewards';

interface RewardsTabProps {
  rewards: {
    available: number;
    total: number;
    streak: number;
  };
  onClaimRewards: (amount: number) => void;
}

export const RewardsTab: React.FC<RewardsTabProps> = ({ rewards, onClaimRewards }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <TokenRewards 
          availableRewards={rewards.available}
          totalEarned={rewards.total}
          streakDays={rewards.streak}
          onClaim={onClaimRewards}
        />
      </div>
      
      <div className="md:col-span-2">
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-medium mb-4">How to Earn STUDY Tokens</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between p-3 bg-muted rounded-lg">
              <span>Complete a study session</span>
              <span className="font-medium">+5 STUDY</span>
            </div>
            
            <div className="flex justify-between p-3 bg-muted rounded-lg">
              <span>Pass an assessment</span>
              <span className="font-medium">+20 STUDY</span>
            </div>
            
            <div className="flex justify-between p-3 bg-muted rounded-lg">
              <span>Complete a module</span>
              <span className="font-medium">+50 STUDY</span>
            </div>
            
            <div className="flex justify-between p-3 bg-muted rounded-lg">
              <span>Maintain a 7-day streak</span>
              <span className="font-medium">+25 STUDY</span>
            </div>
            
            <div className="flex justify-between p-3 bg-muted rounded-lg">
              <span>Achieve certification</span>
              <span className="font-medium">+200 STUDY</span>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium mb-2">Use STUDY tokens for:</h4>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Access premium learning resources</li>
              <li>Unlock exclusive practice exams</li>
              <li>Get priority support from tutors</li>
              <li>Redeem for discounts on certification fees</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
