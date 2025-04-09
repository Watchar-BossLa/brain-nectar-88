import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BlockchainHeader } from '@/components/blockchain/BlockchainHeader';
import { AchievementsTab } from '@/components/blockchain/AchievementsTab';
import { RewardsTab } from '@/components/blockchain/RewardsTab';
import { PremiumTab } from '@/components/blockchain/PremiumTab';
import { PremiumContentItem } from '@/components/blockchain/PremiumContent';

const Blockchain = () => {
  const [rewards, setRewards] = useState({
    available: 150,
    total: 750,
    streak: 7
  });
  
  const [premiumContent, setPremiumContent] = useState([
    {
      id: '1',
      title: 'Advanced Financial Analysis Masterclass',
      description: 'Expert-level techniques for financial statement analysis',
      price: 0.1,
      isOwned: false,
      imageUrl: '/placeholder.svg'
    },
    {
      id: '2',
      title: 'CPA Exam Strategy Guide',
      description: 'Complete study plan and insider tips for passing the CPA',
      price: 0.05,
      isOwned: true,
      imageUrl: '/placeholder.svg'
    },
    {
      id: '3',
      title: 'Corporate Taxation Deep Dive',
      description: 'Comprehensive course on complex corporate tax strategies',
      price: 0.15,
      isOwned: false,
      imageUrl: '/placeholder.svg'
    }
  ]);
  
  const handleClaimRewards = (amount) => {
    setRewards(prev => ({
      ...prev,
      available: 0,
      total: prev.total
    }));
  };
  
  const handlePurchaseContent = (id) => {
    setPremiumContent(prev => 
      prev.map(item => 
        item.id === id ? { ...item, isOwned: true } : item
      )
    );
  };
  
  return (
    <MainLayout>
      <div className="container py-8">
        <BlockchainHeader />
        
        <Tabs defaultValue="achievements">
          <TabsList className="mb-6">
            <TabsTrigger value="achievements">NFT Achievements</TabsTrigger>
            <TabsTrigger value="rewards">Token Rewards</TabsTrigger>
            <TabsTrigger value="premium">Premium Content</TabsTrigger>
          </TabsList>
          
          <TabsContent value="achievements">
            <AchievementsTab />
          </TabsContent>
          
          <TabsContent value="rewards">
            <RewardsTab 
              rewards={rewards} 
              onClaimRewards={handleClaimRewards} 
            />
          </TabsContent>
          
          <TabsContent value="premium">
            <PremiumTab 
              premiumContent={premiumContent} 
              onPurchaseContent={handlePurchaseContent} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Blockchain;
