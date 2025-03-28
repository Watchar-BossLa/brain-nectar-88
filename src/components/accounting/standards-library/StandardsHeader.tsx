
import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, ArrowUpDown, Download } from 'lucide-react';

interface StandardsHeaderProps {
  selectedStandards: string[];
  onToggleFilters: () => void;
  onShowComparisonTool: () => void;
  onDownloadAll: () => void;
}

const StandardsHeader: React.FC<StandardsHeaderProps> = ({
  selectedStandards,
  onToggleFilters,
  onShowComparisonTool,
  onDownloadAll
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <CardTitle>Accounting Standards Library</CardTitle>
        <CardDescription>
          Comprehensive database of GAAP, IFRS, and other accounting standards
        </CardDescription>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onToggleFilters}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </Button>
        {selectedStandards.length > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
            onClick={onShowComparisonTool}
          >
            <ArrowUpDown className="h-4 w-4" />
            <span>Compare ({selectedStandards.length})</span>
          </Button>
        )}
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
          onClick={onDownloadAll}
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Download All</span>
        </Button>
      </div>
    </div>
  );
};

export default StandardsHeader;
