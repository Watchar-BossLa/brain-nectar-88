
import React from 'react';
import { PremiumContentCard, PremiumContentItem } from './PremiumContent';

interface PremiumTabProps {
  premiumContent: PremiumContentItem[];
  onPurchaseContent: (id: string) => void;
}

export const PremiumTab: React.FC<PremiumTabProps> = ({ premiumContent, onPurchaseContent }) => {
  return (
    <div>
      <p className="text-muted-foreground mb-6">
        Unlock premium learning resources using Solana blockchain payments. Your purchases are securely recorded on-chain.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {premiumContent.map(item => (
          <PremiumContentCard 
            key={item.id}
            item={item}
            onPurchase={onPurchaseContent}
          />
        ))}
      </div>
    </div>
  );
};
