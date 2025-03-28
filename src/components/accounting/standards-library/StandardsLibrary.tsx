
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ComparisonTool } from '../comparison';
import { useToast } from '@/components/ui/use-toast';
import { enhancedStandards } from '../standards/StandardsData';
import { AccountingStandard, StandardsLibraryProps } from '../types/standards';
import StandardsHeader from './StandardsHeader';
import StandardsTabs from './StandardsTabs';
import SearchAndFiltersSection from './SearchAndFiltersSection';

const StandardsLibrary: React.FC<StandardsLibraryProps> = ({
  standards = [],
  className = "",
  onSearchStart,
  onSearchComplete
}) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFramework, setActiveFramework] = useState<'all' | 'GAAP' | 'IFRS' | 'FASB' | 'IASB' | 'AASB' | 'Other'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('all');
  const [exactMatchOnly, setExactMatchOnly] = useState(false);
  const [searchInContent, setSearchInContent] = useState(true);
  const [showComparisonTool, setShowComparisonTool] = useState(false);
  const [selectedStandards, setSelectedStandards] = useState<string[]>([]);
  
  const combinedStandards = [...standards];
  enhancedStandards.forEach(enhancedStandard => {
    if (!combinedStandards.some(std => std.id === enhancedStandard.id)) {
      combinedStandards.push(enhancedStandard);
    }
  });
  
  const categories = ['all', ...new Set(combinedStandards
    .filter(std => std.category)
    .map(std => std.category as string))];
  
  const performSearch = () => {
    setIsSearching(true);
    onSearchStart?.();
    
    if (searchQuery && !recentSearches.includes(searchQuery)) {
      setRecentSearches(prev => [searchQuery, ...prev.slice(0, 4)]);
    }
    
    setTimeout(() => {
      const filteredStandards = getFilteredStandards();
      
      setIsSearching(false);
      onSearchComplete?.(filteredStandards);
      
      if (filteredStandards.length === 0 && searchQuery) {
        toast({
          title: "No standards found",
          description: "Try adjusting your search criteria",
        });
      }
    }, 600);
  };
  
  useEffect(() => {
    const handler = setTimeout(() => {
      performSearch();
    }, 300);
    
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, activeFramework, categoryFilter, dateRangeFilter, exactMatchOnly, searchInContent]);
  
  const getFilteredStandards = () => {
    return combinedStandards.filter(standard => {
      const matchesFramework = activeFramework === 'all' || standard.framework === activeFramework;
      const matchesCategory = categoryFilter === 'all' || standard.category === categoryFilter;
      
      let matchesQuery = true;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        
        if (exactMatchOnly) {
          matchesQuery = 
            standard.name.toLowerCase() === query || 
            standard.description.toLowerCase() === query || 
            standard.id.toLowerCase() === query || 
            (searchInContent && standard.content.toLowerCase() === query);
        } else {
          matchesQuery = 
            standard.name.toLowerCase().includes(query) || 
            standard.description.toLowerCase().includes(query) || 
            standard.id.toLowerCase().includes(query) || 
            (standard.searchKeywords && standard.searchKeywords.some(kw => kw.toLowerCase().includes(query))) ||
            (searchInContent && standard.content.toLowerCase().includes(query));
        }
      }
      
      return matchesFramework && matchesCategory && matchesQuery;
    });
  };
  
  const toggleBookmark = (id: string) => {
    if (bookmarks.includes(id)) {
      setBookmarks(prev => prev.filter(standardId => standardId !== id));
      toast({
        title: "Bookmark Removed",
        description: "Standard has been removed from your bookmarks",
      });
    } else {
      setBookmarks(prev => [...prev, id]);
      toast({
        title: "Bookmark Added",
        description: "Standard has been added to your bookmarks",
      });
    }
  };

  const toggleStandardSelection = (id: string) => {
    if (selectedStandards.includes(id)) {
      setSelectedStandards(prev => prev.filter(standardId => standardId !== id));
    } else {
      if (selectedStandards.length < 2) {
        setSelectedStandards(prev => [...prev, id]);
      } else {
        toast({
          title: "Maximum Selection Reached",
          description: "You can only compare up to 2 standards at a time",
        });
      }
    }
  };

  const getSelectedStandardsData = () => {
    return combinedStandards.filter(standard => selectedStandards.includes(standard.id));
  };

  const handleDownloadAll = () => {
    toast({
      title: "Standards Downloaded",
      description: "All standards have been downloaded to your device",
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <StandardsHeader 
          selectedStandards={selectedStandards} 
          onToggleFilters={() => setShowFilters(!showFilters)}
          onShowComparisonTool={() => setShowComparisonTool(true)}
          onDownloadAll={handleDownloadAll}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <SearchAndFiltersSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          activeFramework={activeFramework}
          setActiveFramework={setActiveFramework}
          dateRangeFilter={dateRangeFilter}
          setDateRangeFilter={setDateRangeFilter}
          exactMatchOnly={exactMatchOnly}
          setExactMatchOnly={setExactMatchOnly}
          searchInContent={searchInContent}
          setSearchInContent={setSearchInContent}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          performSearch={performSearch}
          isSearching={isSearching}
          recentSearches={recentSearches}
          categories={categories}
        />
        
        <StandardsTabs 
          activeFramework={activeFramework} 
          setActiveFramework={setActiveFramework} 
          filteredStandards={getFilteredStandards()}
          bookmarks={bookmarks}
          selectedStandards={selectedStandards}
          onToggleBookmark={toggleBookmark}
          onToggleSelection={toggleStandardSelection}
        />
      </CardContent>

      <Dialog open={showComparisonTool} onOpenChange={setShowComparisonTool}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Standards Comparison Tool</DialogTitle>
            <DialogDescription>
              Compare accounting standards across different frameworks
            </DialogDescription>
          </DialogHeader>
          <ComparisonTool 
            standards={getSelectedStandardsData()} 
            onClose={() => setShowComparisonTool(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default StandardsLibrary;
