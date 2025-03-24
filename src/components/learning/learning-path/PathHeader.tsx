
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface PathHeaderProps {
  onGenerate: () => void;
  isGenerating: boolean;
  qualificationId?: string;
}

const PathHeader = ({ onGenerate, isGenerating, qualificationId }: PathHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">Your Learning Path</h2>
      <Button 
        onClick={onGenerate}
        disabled={isGenerating || !qualificationId}
        size="sm"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate New Path
          </>
        )}
      </Button>
    </div>
  );
};

export default PathHeader;
