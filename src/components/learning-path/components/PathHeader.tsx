
import React from 'react';
import { GraduationCap, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PathHeaderProps {
  onRefresh: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const PathHeader: React.FC<PathHeaderProps> = ({ onRefresh, onGenerate, isGenerating }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">Your Learning Path</h2>
        <p className="text-muted-foreground">Track your progress and access recommended topics</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </Button>
        <Button size="sm" onClick={onGenerate} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <GraduationCap className="w-4 h-4 mr-1" />
              Generate New Path
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PathHeader;
