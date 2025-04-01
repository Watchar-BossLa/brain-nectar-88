
import React from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { 
  QualificationsHeader,
  QualificationCard,
  PersonalizedRecommendation,
  getStatusBadge,
  qualifications
} from '@/components/qualifications';
import { SimpleWalletButton } from '@/components/blockchain/WalletConnect';
import { useSolana } from '@/context/blockchain/useSolana';
import { Button } from '@/components/ui/button';
import { Award, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

const Qualifications = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const { connected, mintAchievementNFT } = useSolana();
  const { toast } = useToast();
  const [mintingId, setMintingId] = useState<string | null>(null);

  const handleMintAchievement = async (qualification: any) => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your Solana wallet first",
        variant: "destructive"
      });
      return;
    }

    if (qualification.status !== 'completed') {
      toast({
        title: "Qualification not completed",
        description: "You can only mint NFTs for completed qualifications",
        variant: "destructive"
      });
      return;
    }

    setMintingId(qualification.id);

    try {
      const result = await mintAchievementNFT({
        title: qualification.name,
        description: `Successfully completed ${qualification.name} certification`,
        imageUrl: '/placeholder.svg',
        qualification: qualification.fullName,
        completedDate: new Date().toLocaleDateString()
      });

      if (result) {
        toast({
          title: "Achievement NFT Minted!",
          description: `Your ${qualification.name} achievement has been minted as an NFT on Solana.`
        });
      }
    } finally {
      setMintingId(null);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <QualificationsHeader />
          <SimpleWalletButton />
        </div>

        <motion.div 
          className="space-y-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {qualifications.map((qualification) => (
            <div key={qualification.id}>
              <QualificationCard 
                qualification={qualification}
                getStatusBadge={getStatusBadge}
              />
              {qualification.status === 'completed' && (
                <div className="mt-4 flex justify-end">
                  <Button 
                    onClick={() => handleMintAchievement(qualification)}
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={!connected || mintingId === qualification.id}
                  >
                    {mintingId === qualification.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Minting...
                      </>
                    ) : (
                      <>
                        <Award className="h-4 w-4" />
                        Mint as NFT Achievement
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </motion.div>
        
        <PersonalizedRecommendation />
      </div>
    </MainLayout>
  );
};

export default Qualifications;
