
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Share2, Clipboard, Trophy, Twitter, Facebook } from 'lucide-react';
import { QuizResults } from '@/types/quiz';

interface ShareResultsProps {
  results: QuizResults;
  sessionId?: string;
}

const ShareResults: React.FC<ShareResultsProps> = ({ results, sessionId }) => {
  const [isCopied, setIsCopied] = useState(false);

  // Create a shareable message based on quiz results
  const createShareableMessage = () => {
    const correctPercentage = Math.round((results.correctAnswers / results.questionsAttempted) * 100);
    let difficultyText = '';
    
    if (results.performanceByDifficulty) {
      const difficulties = Object.keys(results.performanceByDifficulty);
      if (difficulties.length > 0) {
        difficultyText = ` on ${difficulties.join('/')} difficulty`;
      }
    }
    
    return `I scored ${correctPercentage}% (${results.correctAnswers}/${results.questionsAttempted})${difficultyText} on my accounting quiz with Study Bee! #StudyBee #AccountingQuiz`;
  };

  // Copy results to clipboard
  const copyToClipboard = () => {
    const message = createShareableMessage();
    navigator.clipboard.writeText(message).then(
      () => {
        setIsCopied(true);
        toast({
          title: "Copied to clipboard!",
          description: "You can now paste your results to share them.",
        });
        setTimeout(() => setIsCopied(false), 3000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast({
          title: "Failed to copy",
          description: "Please try again or share manually.",
          variant: "destructive",
        });
      }
    );
  };

  // Share on social media
  const shareOnSocialMedia = (platform: 'twitter' | 'facebook') => {
    const message = encodeURIComponent(createShareableMessage());
    const baseUrl = platform === 'twitter' 
      ? `https://twitter.com/intent/tweet?text=${message}` 
      : `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${message}`;
    
    window.open(baseUrl, '_blank');
    
    toast({
      title: `Sharing on ${platform === 'twitter' ? 'Twitter' : 'Facebook'}`,
      description: "Opening share dialog in a new window.",
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-medium flex items-center gap-2">
        <Share2 className="h-4 w-4" />
        Share Your Results
      </h3>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={copyToClipboard}
          className="flex items-center gap-1"
        >
          <Clipboard className="h-4 w-4" />
          {isCopied ? "Copied!" : "Copy Results"}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => shareOnSocialMedia('twitter')}
          className="flex items-center gap-1 bg-[#1DA1F2] text-white hover:bg-[#1a91da]"
        >
          <Twitter className="h-4 w-4" />
          Tweet
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => shareOnSocialMedia('facebook')}
          className="flex items-center gap-1 bg-[#4267B2] text-white hover:bg-[#375593]"
        >
          <Facebook className="h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
};

export default ShareResults;
