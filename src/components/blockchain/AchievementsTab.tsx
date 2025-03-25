
import React from 'react';
import { AchievementNFT } from './AchievementNFT';

export const AchievementsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Your certified achievements are stored on the Solana blockchain as unique NFTs, 
        providing permanent proof of your qualifications.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AchievementNFT 
          title="Financial Accounting Certification"
          description="Successfully completed all modules of the Financial Accounting course with distinction."
          imageUrl="/placeholder.svg"
          qualification="ACCA Qualification"
          completedDate="May 15, 2023"
        />
        
        <AchievementNFT 
          title="Management Accounting Specialist"
          description="Mastered advanced management accounting techniques and practical applications."
          imageUrl="/placeholder.svg"
          qualification="CIMA Certification"
          completedDate="August 3, 2023"
        />
        
        <AchievementNFT 
          title="Business and Technology Expert"
          description="Demonstrated expert knowledge in business technology infrastructure and digital transformation."
          imageUrl="/placeholder.svg"
          qualification="ACCA Qualification"
          completedDate="November 22, 2023"
        />
      </div>
    </div>
  );
};
