
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Filter, ArrowUpDown, Download } from 'lucide-react';
import ComparisonTool from './ComparisonTool';
import StandardsList from './standards/StandardsList';
import SearchAndFilters from './standards/SearchAndFilters';
import { enhancedStandards } from './standards/StandardsData';
import { AccountingStandard, StandardsLibraryProps } from './types/standards';

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
      const filteredStandards = combinedStandards.filter(standard => {
        const matchesFramework = activeFramework === 'all' || standard.framework === activeFramework;
        const matchesCategory = categoryFilter === 'all' || standard.category === categoryFilter;
        const matchesDateRange = dateRangeFilter === 'all';
        
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
        
        return matchesFramework && matchesCategory && matchesDateRange && matchesQuery;
      });
      
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
  
  const filteredStandards = combinedStandards.filter(standard => {
    const matchesFramework = activeFramework === 'all' || standard.framework === activeFramework;
    const matchesCategory = categoryFilter === 'all' || standard.category === categoryFilter;
    
    const matchesQuery = searchQuery ? 
      standard.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      standard.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (standard.searchKeywords && standard.searchKeywords.some(kw => kw.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (searchInContent && standard.content.toLowerCase().includes(searchQuery.toLowerCase())) : 
      true;
    
    return matchesFramework && matchesCategory && matchesQuery;
  });
  
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

  return (
    <Card className={className}>
      <CardHeader>
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
              onClick={() => setShowFilters(!showFilters)}
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
                onClick={() => setShowComparisonTool(true)}
              >
                <ArrowUpDown className="h-4 w-4" />
                <span>Compare ({selectedStandards.length})</span>
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
              onClick={() => {
                toast({
                  title: "Standards Downloaded",
                  description: "All standards have been downloaded to your device",
                });
              }}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download All</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <SearchAndFilters
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
        
        <Tabs defaultValue="all" onValueChange={(value) => setActiveFramework(value as any)}>
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-7">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="GAAP">GAAP</TabsTrigger>
            <TabsTrigger value="IFRS">IFRS</TabsTrigger>
            <TabsTrigger value="FASB">FASB</TabsTrigger>
            <TabsTrigger value="IASB">IASB</TabsTrigger>
            <TabsTrigger value="AASB">AASB</TabsTrigger>
            <TabsTrigger value="Other">Other</TabsTrigger>
          </TabsList>
          
          {['all', 'GAAP', 'IFRS', 'FASB', 'IASB', 'AASB', 'Other'].map((framework) => (
            <TabsContent key={framework} value={framework} className="mt-4">
              <StandardsList 
                standards={filteredStandards} 
                bookmarks={bookmarks}
                selectedStandards={selectedStandards}
                onToggleBookmark={toggleBookmark}
                onToggleSelection={toggleStandardSelection}
              />
            </TabsContent>
          ))}
        </Tabs>
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
