
import React, { useState } from 'react';
import { useSolana } from '@/context/SolanaContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, CheckCircle, CreditCard } from 'lucide-react';

export interface PremiumContentItem {
  id: string;
  title: string;
  description: string;
  price: number;
  isOwned: boolean;
  imageUrl?: string;
}

interface PremiumContentCardProps {
  item: PremiumContentItem;
  onPurchase?: (id: string) => void;
}

export const PremiumContentCard: React.FC<PremiumContentCardProps> = ({
  item,
  onPurchase
}) => {
  const { connected, processPayment } = useSolana();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handlePurchase = async () => {
    if (item.isOwned) return;
    
    setIsProcessing(true);
    
    try {
      const success = await processPayment(item.price, item.title);
      
      if (success && onPurchase) {
        onPurchase(item.id);
      }
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-muted flex items-center justify-center">
            <Lock className="h-12 w-12 text-muted-foreground opacity-30" />
          </div>
        )}
        
        {item.isOwned && (
          <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Owned
          </div>
        )}
        
        {!item.isOwned && (
          <div className="absolute top-3 right-3 bg-primary text-white rounded-full px-3 py-1 text-xs font-medium">
            {item.price} SOL
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle>{item.title}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      
      <CardFooter className="pt-0">
        {!item.isOwned ? (
          <Button 
            onClick={handlePurchase} 
            disabled={!connected || isProcessing} 
            className="w-full"
          >
            {isProcessing ? (
              'Processing...'
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Purchase for {item.price} SOL
              </>
            )}
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="w-full"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Access Content
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
