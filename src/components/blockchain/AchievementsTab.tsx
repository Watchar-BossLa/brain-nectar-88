
import React, { useState, useEffect } from 'react';
import { AchievementNFT, AchievementNFTSkeleton } from './AchievementNFT';
import { useSolana } from '@/context/SolanaContext';

export const AchievementsTab: React.FC = () => {
  const { connected } = useSolana();
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading of NFT data
  useEffect(() => {
    if (connected) {
      setIsLoading(true);
      // Fetch NFT data would go here in a real implementation
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [connected]);
  
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Your certified achievements are stored on the Solana blockchain as unique NFTs, 
        providing permanent proof of your qualifications.
      </p>
      
      {isLoading && connected ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AchievementNFTSkeleton />
          <AchievementNFTSkeleton />
          <AchievementNFTSkeleton />
        </div>
      ) : (
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
      )}
    </div>
  );
};
