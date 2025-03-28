
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { AccountingStandard } from '../types/standards';
import { useToast } from '@/components/ui/use-toast';
import { SingleStandardView } from './SingleStandardView';
import { MultipleStandardsView } from './MultipleStandardsView';
import { EmptyStateView } from './EmptyStateView';

interface ComparisonToolProps {
  standards: AccountingStandard[];
  onClose: () => void;
}

const ComparisonTool: React.FC<ComparisonToolProps> = ({ standards, onClose }) => {
  const { toast } = useToast();
  const [view, setView] = useState<'side-by-side' | 'tabbed'>('side-by-side');
  const [fullscreen, setFullscreen] = useState(false);

  const handlePrint = () => {
    toast({
      title: "Printing comparison",
      description: "Sending to printer..."
    });
    window.print();
  };

  const handleDownload = () => {
    toast({
      title: "Comparison Downloaded",
      description: "The comparison has been saved as a PDF."
    });
  };

  if (standards.length === 0) {
    return <EmptyStateView onClose={onClose} />;
  }

  if (standards.length === 1) {
    return (
      <SingleStandardView 
        standard={standards[0]} 
        onClose={onClose} 
        onPrint={handlePrint} 
        onDownload={handleDownload} 
      />
    );
  }

  return (
    <div className={`p-4 ${fullscreen ? 'fixed inset-0 bg-background z-50 overflow-auto' : ''}`}>
      <MultipleStandardsView 
        standards={standards}
        view={view}
        fullscreen={fullscreen}
        onViewChange={() => setView(view === 'side-by-side' ? 'tabbed' : 'side-by-side')}
        onFullscreenToggle={() => setFullscreen(!fullscreen)}
        onPrint={handlePrint}
        onDownload={handleDownload}
      />
      
      <div className="mt-6 flex justify-end">
        <Button onClick={onClose} variant="outline" className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Standards
        </Button>
      </div>
    </div>
  );
};

export default ComparisonTool;
