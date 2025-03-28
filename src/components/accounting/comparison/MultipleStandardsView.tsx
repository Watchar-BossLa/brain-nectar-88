
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Printer, Download, Maximize2 } from 'lucide-react';
import { AccountingStandard } from '../types/standards';
import { DifferenceTable } from './DifferenceTable';

interface MultipleStandardsViewProps {
  standards: AccountingStandard[];
  view: 'side-by-side' | 'tabbed';
  fullscreen: boolean;
  onViewChange: () => void;
  onFullscreenToggle: () => void;
  onPrint: () => void;
  onDownload: () => void;
}

export const MultipleStandardsView: React.FC<MultipleStandardsViewProps> = ({
  standards,
  view,
  fullscreen,
  onViewChange,
  onFullscreenToggle,
  onPrint,
  onDownload
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Comparing Standards</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onViewChange}
          >
            {view === 'side-by-side' ? 'Tabbed View' : 'Side-by-Side View'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onPrint}
            className="flex items-center gap-1"
          >
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Print</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onDownload}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onFullscreenToggle}
            className="flex items-center gap-1"
          >
            <Maximize2 className="h-4 w-4" />
            <span className="hidden sm:inline">{fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </Button>
        </div>
      </div>
      
      {view === 'tabbed' ? (
        <TabbedView standards={standards} />
      ) : (
        <SideBySideView standards={standards} />
      )}
      
      <div className="mt-6">
        <h3 className="font-medium mb-2">Key Differences</h3>
        <DifferenceTable standards={standards} />
      </div>
    </>
  );
};

interface StandardViewProps {
  standards: AccountingStandard[];
}

const TabbedView: React.FC<StandardViewProps> = ({ standards }) => (
  <Tabs defaultValue={standards[0].id}>
    <TabsList className="mb-4">
      {standards.map(standard => (
        <TabsTrigger key={standard.id} value={standard.id}>
          {standard.id}
        </TabsTrigger>
      ))}
    </TabsList>
    
    {standards.map(standard => (
      <TabsContent key={standard.id} value={standard.id}>
        <StandardContent standard={standard} />
      </TabsContent>
    ))}
  </Tabs>
);

const SideBySideView: React.FC<StandardViewProps> = ({ standards }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {standards.map(standard => (
      <div key={standard.id} className="border rounded-lg p-4">
        <StandardContent standard={standard} />
      </div>
    ))}
  </div>
);

interface StandardContentProps {
  standard: AccountingStandard;
}

const StandardContent: React.FC<StandardContentProps> = ({ standard }) => (
  <>
    <div className="mb-4 p-3 bg-muted rounded-md">
      <h3 className="font-medium">{standard.name}</h3>
      <p className="text-sm mt-1">{standard.description}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <span className="text-xs bg-primary/10 px-2 py-1 rounded">Framework: {standard.framework}</span>
        {standard.category && (
          <span className="text-xs bg-primary/10 px-2 py-1 rounded">Category: {standard.category}</span>
        )}
      </div>
    </div>
    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: standard.content }}></div>
  </>
);
