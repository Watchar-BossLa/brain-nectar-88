
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import StandardsHeader from './StandardsHeader';
import StandardsTabs from './StandardsTabs';
import { AccountingStandard } from '../types/standards';
import SearchAndFilters from './SearchAndFilters';
import ComparisonTool from '../comparison/ComparisonTool';
import { useToast } from '@/components/ui/use-toast';

interface StandardsLibraryProps {
  standards?: AccountingStandard[];
}

const StandardsLibrary: React.FC<StandardsLibraryProps> = ({ 
  standards = [] 
}) => {
  const { toast } = useToast();
  const [activeFramework, setActiveFramework] = useState<'all' | 'GAAP' | 'IFRS' | 'FASB' | 'IASB' | 'AASB' | 'Other'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [selectedStandards, setSelectedStandards] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showComparisonTool, setShowComparisonTool] = useState(false);
  
  const filteredStandards = standards.filter(standard => {
    // Filter by framework
    if (activeFramework !== 'all' && standard.framework !== activeFramework) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !standard.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !standard.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const handleToggleBookmark = (id: string) => {
    setBookmarks(prev => 
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
    
    toast({
      title: bookmarks.includes(id) ? "Bookmark removed" : "Standard bookmarked",
      description: "Your preferences have been updated.",
    });
  };
  
  const handleToggleSelection = (id: string) => {
    setSelectedStandards(prev => 
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };
  
  const handleToggleFilters = () => {
    setShowFilters(prev => !prev);
  };
  
  const handleShowComparisonTool = () => {
    if (selectedStandards.length > 0) {
      setShowComparisonTool(true);
    }
  };
  
  const handleCloseComparisonTool = () => {
    setShowComparisonTool(false);
  };
  
  const handleDownloadAll = () => {
    toast({
      title: "Download started",
      description: "All accounting standards are being downloaded.",
    });
  };
  
  const selectedStandardsData = standards.filter(standard => 
    selectedStandards.includes(standard.id)
  );
  
  return (
    <div className="space-y-4">
      {showComparisonTool ? (
        <ComparisonTool 
          standards={selectedStandardsData}
          onClose={handleCloseComparisonTool}
        />
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <StandardsHeader 
                selectedStandards={selectedStandards}
                onToggleFilters={handleToggleFilters}
                onShowComparisonTool={handleShowComparisonTool}
                onDownloadAll={handleDownloadAll}
              />
              
              {showFilters && (
                <SearchAndFilters 
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              )}
              
              <StandardsTabs 
                activeFramework={activeFramework}
                setActiveFramework={setActiveFramework}
                filteredStandards={filteredStandards}
                bookmarks={bookmarks}
                selectedStandards={selectedStandards}
                onToggleBookmark={handleToggleBookmark}
                onToggleSelection={handleToggleSelection}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StandardsLibrary;
