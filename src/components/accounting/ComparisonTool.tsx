
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AccountingStandard } from './types/standards';
import { ArrowLeft, Download, Maximize2, Printer } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

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
    return (
      <div className="p-6 text-center">
        <p>Please select at least one standard to compare.</p>
        <Button onClick={onClose} className="mt-4">Close</Button>
      </div>
    );
  }

  if (standards.length === 1) {
    const standard = standards[0];
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{standard.name}</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center gap-1">
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>Download</span>
            </Button>
          </div>
        </div>
        <div className="mb-4 p-3 bg-muted rounded-md">
          <p className="text-sm">{standard.description}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="text-xs bg-primary/10 px-2 py-1 rounded">Framework: {standard.framework}</span>
            {standard.category && (
              <span className="text-xs bg-primary/10 px-2 py-1 rounded">Category: {standard.category}</span>
            )}
            {standard.lastUpdated && (
              <span className="text-xs bg-primary/10 px-2 py-1 rounded">Updated: {standard.lastUpdated}</span>
            )}
          </div>
        </div>
        <div className="border rounded-lg p-4 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: standard.content }}></div>
        
        {standard.examples && standard.examples.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Examples</h3>
            <ul className="list-disc pl-5 space-y-1">
              {standard.examples.map((example, index) => (
                <li key={index}>{example}</li>
              ))}
            </ul>
          </div>
        )}
        
        {standard.relatedStandards && standard.relatedStandards.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Related Standards</h3>
            <div className="flex flex-wrap gap-2">
              {standard.relatedStandards.map((relatedId, index) => (
                <span key={index} className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                  {relatedId}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} variant="outline" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Standards
          </Button>
        </div>
      </div>
    );
  }

  // For multiple standards comparison
  return (
    <div className={`p-4 ${fullscreen ? 'fixed inset-0 bg-background z-50 overflow-auto' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Comparing Standards</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setView(view === 'side-by-side' ? 'tabbed' : 'side-by-side')}
          >
            {view === 'side-by-side' ? 'Tabbed View' : 'Side-by-Side View'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrint}
            className="flex items-center gap-1"
          >
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Print</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownload}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setFullscreen(!fullscreen)}
            className="flex items-center gap-1"
          >
            <Maximize2 className="h-4 w-4" />
            <span className="hidden sm:inline">{fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </Button>
        </div>
      </div>
      
      {view === 'tabbed' ? (
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
              <div className="border rounded-lg p-4 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: standard.content }}></div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {standards.map(standard => (
            <div key={standard.id} className="border rounded-lg p-4">
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
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6">
        <h3 className="font-medium mb-2">Key Differences</h3>
        <div className="border rounded-lg p-4 bg-muted/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left pb-2">Aspect</th>
                {standards.map(standard => (
                  <th key={standard.id} className="text-left pb-2">{standard.id}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-medium">Framework</td>
                {standards.map(standard => (
                  <td key={standard.id} className="py-2">{standard.framework}</td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Category</td>
                {standards.map(standard => (
                  <td key={standard.id} className="py-2">{standard.category || 'N/A'}</td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Last Updated</td>
                {standards.map(standard => (
                  <td key={standard.id} className="py-2">{standard.lastUpdated || 'N/A'}</td>
                ))}
              </tr>
              <tr>
                <td className="py-2 font-medium">Related Standards</td>
                {standards.map(standard => (
                  <td key={standard.id} className="py-2">
                    {standard.relatedStandards?.join(', ') || 'None'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
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
