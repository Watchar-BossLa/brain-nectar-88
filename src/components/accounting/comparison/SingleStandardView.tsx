
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download, ArrowLeft } from 'lucide-react';
import { AccountingStandard } from '../types/standards';

interface SingleStandardViewProps {
  standard: AccountingStandard;
  onClose: () => void;
  onPrint: () => void;
  onDownload: () => void;
}

export const SingleStandardView: React.FC<SingleStandardViewProps> = ({ 
  standard, 
  onClose, 
  onPrint, 
  onDownload 
}) => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{standard.name}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onPrint} className="flex items-center gap-1">
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </Button>
          <Button variant="outline" size="sm" onClick={onDownload} className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
        </div>
      </div>
      
      <StandardMetadata standard={standard} />
      
      <div className="border rounded-lg p-4 prose prose-sm max-w-none" 
        dangerouslySetInnerHTML={{ __html: standard.content }}>
      </div>
      
      {standard.examples && standard.examples.length > 0 && (
        <StandardExamples examples={standard.examples} />
      )}
      
      {standard.relatedStandards && standard.relatedStandards.length > 0 && (
        <RelatedStandards relatedStandards={standard.relatedStandards} />
      )}
      
      <div className="mt-6 flex justify-end">
        <Button onClick={onClose} variant="outline" className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Standards
        </Button>
      </div>
    </div>
  );
};

interface StandardMetadataProps {
  standard: AccountingStandard;
}

const StandardMetadata: React.FC<StandardMetadataProps> = ({ standard }) => (
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
);

interface StandardExamplesProps {
  examples: string[];
}

const StandardExamples: React.FC<StandardExamplesProps> = ({ examples }) => (
  <div className="mt-4">
    <h3 className="font-medium mb-2">Examples</h3>
    <ul className="list-disc pl-5 space-y-1">
      {examples.map((example, index) => (
        <li key={index}>{example}</li>
      ))}
    </ul>
  </div>
);

interface RelatedStandardsProps {
  relatedStandards: string[];
}

const RelatedStandards: React.FC<RelatedStandardsProps> = ({ relatedStandards }) => (
  <div className="mt-4">
    <h3 className="font-medium mb-2">Related Standards</h3>
    <div className="flex flex-wrap gap-2">
      {relatedStandards.map((relatedId, index) => (
        <span key={index} className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
          {relatedId}
        </span>
      ))}
    </div>
  </div>
);
