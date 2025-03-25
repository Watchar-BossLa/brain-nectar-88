
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { WalletConnect } from '@/components/blockchain/WalletConnect';
import { AchievementNFT } from '@/components/blockchain/AchievementNFT';
import { TokenRewards } from '@/components/blockchain/TokenRewards';
import { PremiumContentCard, PremiumContentItem } from '@/components/blockchain/PremiumContent';

const Blockchain = () => {
  const [rewards, setRewards] = useState({
    available: 150,
    total: 750,
    streak: 7
  });
  
  const [premiumContent, setPremiumContent] = useState<PremiumContentItem[]>([
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
  
  const handleClaimRewards = (amount: number) => {
    setRewards(prev => ({
      ...prev,
      available: 0,
      total: prev.total
    }));
  };
  
  const handlePurchaseContent = (id: string) => {
    setPremiumContent(prev => 
      prev.map(item => 
        item.id === id ? { ...item, isOwned: true } : item
      )
    );
  };
  
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <motion.h1 
            className="text-3xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Blockchain Features
          </motion.h1>
          <WalletConnect />
        </div>
        
        <Tabs defaultValue="achievements">
          <TabsList className="mb-6">
            <TabsTrigger value="achievements">NFT Achievements</TabsTrigger>
            <TabsTrigger value="rewards">Token Rewards</TabsTrigger>
            <TabsTrigger value="premium">Premium Content</TabsTrigger>
          </TabsList>
          
          <TabsContent value="achievements" className="space-y-6">
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
          </TabsContent>
          
          <TabsContent value="rewards">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <TokenRewards 
                  availableRewards={rewards.available}
                  totalEarned={rewards.total}
                  streakDays={rewards.streak}
                  onClaim={handleClaimRewards}
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
          </TabsContent>
          
          <TabsContent value="premium">
            <p className="text-muted-foreground mb-6">
              Unlock premium learning resources using Solana blockchain payments. Your purchases are securely recorded on-chain.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {premiumContent.map(item => (
                <PremiumContentCard 
                  key={item.id}
                  item={item}
                  onPurchase={handlePurchaseContent}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Blockchain;
