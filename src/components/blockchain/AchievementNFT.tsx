
import React, { useState } from 'react';
import { useSolana } from '@/context/SolanaContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, ExternalLink, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface AchievementNFTProps {
  title: string;
  description: string;
  imageUrl: string;
  qualification: string;
  completedDate: string;
  onMint?: () => void;
}

export const AchievementNFT: React.FC<AchievementNFTProps> = ({ 
  title, 
  description, 
  imageUrl, 
  qualification, 
  completedDate,
  onMint
}) => {
  const { connected, mintAchievementNFT } = useSolana();
  const [isMinting, setIsMinting] = useState(false);
  const [txId, setTxId] = useState<string | null>(null);
  
  const handleMint = async () => {
    setIsMinting(true);
    
    try {
      const result = await mintAchievementNFT({
        title,
        description,
        imageUrl,
        qualification,
        completedDate
      });
      
      if (result) {
        setTxId(result);
        if (onMint) onMint();
      }
    } finally {
      setIsMinting(false);
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{qualification} - {completedDate}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="aspect-video relative overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title} 
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Award className="h-16 w-16 text-muted-foreground opacity-30" />
            </div>
          )}
        </div>
        <div className="p-6 pt-4">
          <p className="text-sm text-muted-foreground">{description}</p>
          
          {txId && (
            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="text-xs font-medium mb-1">NFT Transaction</p>
              <a 
                href={`https://explorer.solana.com/address/${txId}?cluster=devnet`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary flex items-center gap-1 hover:underline"
              >
                {txId.slice(0, 20)}...{txId.slice(-4)} <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        {!txId ? (
          <Button 
            onClick={handleMint} 
            disabled={!connected || isMinting} 
            className="w-full"
          >
            {isMinting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Minting...
              </>
            ) : (
              'Mint as NFT'
            )}
          </Button>
        ) : (
          <Button variant="outline" className="w-full" disabled>
            Minted Successfully
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export const AchievementNFTSkeleton: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent className="p-0">
        <Skeleton className="aspect-video w-full" />
        <div className="p-6 pt-4">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
};
