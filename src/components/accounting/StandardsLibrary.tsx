import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, X, Download, BookOpen, RefreshCw, ArrowUpDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ComparisonTool from './ComparisonTool';

interface AccountingStandard {
  id: string;
  name: string;
  description: string;
  framework: 'GAAP' | 'IFRS' | 'FASB' | 'IASB' | 'AASB' | 'Other';
  content: string;
  category?: string;
  lastUpdated?: string;
  effectiveDate?: string;
  examples?: string[];
  relatedStandards?: string[];
  searchKeywords?: string[];
}

interface StandardsLibraryProps {
  standards?: AccountingStandard[];
  className?: string;
  onSearchStart?: () => void;
  onSearchComplete?: (results: AccountingStandard[]) => void;
}

/**
 * Enhanced Accounting Standards Library component with advanced search capabilities
 */
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
  
  const enhancedStandards: AccountingStandard[] = [
    {
      id: 'GAAP-ASC-606',
      name: 'ASC 606 - Revenue Recognition',
      description: 'Establishes principles for reporting useful information about the nature, amount, timing, and uncertainty of revenue.',
      framework: 'GAAP',
      category: 'Revenue',
      lastUpdated: '2021-06-15',
      effectiveDate: '2018-12-15',
      content: '<p>The core principle of ASC 606 is that an entity should recognize revenue to depict the transfer of promised goods or services to customers in an amount that reflects the consideration to which the entity expects to be entitled in exchange for those goods or services.</p><p>The standard introduces a 5-step approach to revenue recognition:</p><ol><li>Identify the contract(s) with a customer</li><li>Identify the performance obligations in the contract</li><li>Determine the transaction price</li><li>Allocate the transaction price to the performance obligations</li><li>Recognize revenue when (or as) the entity satisfies a performance obligation</li></ol>',
      examples: [
        'Software company with multi-element arrangements',
        'Construction contracts with milestone billings',
        'Subscription services with setup fees'
      ],
      relatedStandards: ['IFRS-15'],
      searchKeywords: ['revenue', 'recognition', 'contract', 'performance obligation', 'transaction price']
    },
    {
      id: 'IFRS-15',
      name: 'IFRS 15 - Revenue from Contracts with Customers',
      description: 'International standard on revenue recognition and accounting for contracts with customers.',
      framework: 'IFRS',
      category: 'Revenue',
      lastUpdated: '2020-05-28',
      effectiveDate: '2018-01-01',
      content: '<p>IFRS 15 establishes a comprehensive framework for determining when to recognize revenue and how much revenue to recognize. The core principle is that an entity recognizes revenue to depict the transfer of promised goods or services to customers in an amount that reflects the consideration to which the entity expects to be entitled in exchange for those goods or services.</p><p>Like ASC 606, IFRS 15 follows a 5-step model for revenue recognition.</p>',
      examples: [
        'Long-term service contracts',
        'Sale of goods with right of return',
        'Licenses of intellectual property'
      ],
      relatedStandards: ['GAAP-ASC-606'],
      searchKeywords: ['revenue', 'contracts', 'customers', 'performance', 'obligation']
    },
    {
      id: 'GAAP-ASC-842',
      name: 'ASC 842 - Leases',
      description: 'Requires lessees to recognize assets and liabilities for most leases and provides enhanced disclosure requirements.',
      framework: 'GAAP',
      category: 'Leases',
      lastUpdated: '2022-02-10',
      effectiveDate: '2019-12-15',
      content: '<p>ASC 842 requires lessees to recognize assets and liabilities for most leases and provides enhanced disclosure requirements. The main objective is to address the off-balance-sheet financing concerns related to lessees\' operating leases.</p><p>The standard introduces a right-of-use (ROU) model that brings substantially all leases onto the balance sheet.</p>',
      examples: [
        'Office building leases',
        'Equipment leases',
        'Retail space leases with variable payments'
      ],
      relatedStandards: ['IFRS-16'],
      searchKeywords: ['lease', 'right-of-use', 'ROU', 'operating lease', 'finance lease']
    },
    {
      id: 'IFRS-16',
      name: 'IFRS 16 - Leases',
      description: 'Specifies how to recognize, measure, present and disclose leases.',
      framework: 'IFRS',
      category: 'Leases',
      lastUpdated: '2021-03-31',
      effectiveDate: '2019-01-01',
      content: '<p>IFRS 16 specifies how to recognize, measure, present and disclose leases. The standard provides a single lessee accounting model, requiring lessees to recognize assets and liabilities for all leases unless the lease term is 12 months or less or the underlying asset has a low value.</p>',
      examples: [
        'Property leases',
        'Equipment leases',
        'Vehicle leases'
      ],
      relatedStandards: ['GAAP-ASC-842'],
      searchKeywords: ['lease', 'right-of-use', 'lessee', 'lessor', 'lease liability']
    },
    {
      id: 'GAAP-ASC-350',
      name: 'ASC 350 - Intangibles—Goodwill and Other',
      description: 'Addresses financial accounting and reporting for goodwill and other intangible assets.',
      framework: 'GAAP',
      category: 'Assets',
      lastUpdated: '2020-12-18',
      effectiveDate: '2002-06-30',
      content: '<p>ASC 350 addresses financial accounting and reporting for goodwill and other intangible assets. The standard provides guidance on how entities should account for goodwill and other intangible assets acquired individually or with a group of other assets.</p>',
      examples: [
        'Goodwill impairment testing',
        'Recognition of intangible assets in business combinations',
        'Accounting for research and development costs'
      ],
      relatedStandards: ['IFRS-3', 'IFRS-36'],
      searchKeywords: ['goodwill', 'intangible', 'impairment', 'asset', 'amortization']
    },
    {
      id: 'IFRS-36',
      name: 'IAS 36 - Impairment of Assets',
      description: 'Ensures that assets are carried at no more than their recoverable amount and defines how recoverable amount is determined.',
      framework: 'IFRS',
      category: 'Assets',
      lastUpdated: '2021-01-15',
      effectiveDate: '2004-03-31',
      content: '<p>IAS 36 seeks to ensure that an entity\'s assets are not carried at more than their recoverable amount. An asset is carried at more than its recoverable amount if its carrying amount exceeds the amount to be recovered through use or sale of the asset.</p><p>If this is the case, the asset is described as impaired and the standard requires the entity to recognize an impairment loss.</p>',
      examples: [
        'Goodwill impairment testing',
        'Property, plant and equipment impairment',
        'Intangible asset impairment'
      ],
      relatedStandards: ['GAAP-ASC-350'],
      searchKeywords: ['impairment', 'assets', 'recoverable amount', 'goodwill', 'intangible']
    },
    {
      id: 'GAAP-ASC-230',
      name: 'ASC 230 - Statement of Cash Flows',
      description: 'Provides guidance on cash flow statement preparation and classification of cash receipts and payments.',
      framework: 'GAAP',
      category: 'Financial Statements',
      lastUpdated: '2019-11-10',
      effectiveDate: '2016-01-01',
      content: '<p>ASC 230 establishes standards for cash flow reporting. It requires a statement of cash flows as part of a full set of financial statements for all business entities.</p><p>The statement classifies cash receipts and payments according to whether they stem from operating, investing, or financing activities.</p>',
      examples: [
        'Classification of interest and dividends',
        'Reporting non-cash transactions',
        'Direct vs. indirect method'
      ],
      relatedStandards: ['IFRS-7'],
      searchKeywords: ['cash flow', 'statement', 'operating', 'investing', 'financing']
    },
    {
      id: 'IFRS-7',
      name: 'IAS 7 - Statement of Cash Flows',
      description: 'Requires presentation of information about historical changes in cash and cash equivalents by means of a statement of cash flows.',
      framework: 'IFRS',
      category: 'Financial Statements',
      lastUpdated: '2022-01-10',
      effectiveDate: '1994-01-01',
      content: '<p>IAS 7 requires an entity to present a statement of cash flows as an integral part of its primary financial statements.</p><p>Cash flows are classified and presented into operating activities, investing activities or financing activities.</p>',
      examples: [
        'Operating activities classification',
        'Treatment of interest and dividends',
        'Foreign currency cash flows'
      ],
      relatedStandards: ['GAAP-ASC-230'],
      searchKeywords: ['cash flow', 'statement', 'operating', 'investing', 'financing']
    }
  ];
  
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
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search standards by name, ID, or keywords..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button variant="default" onClick={performSearch} disabled={isSearching}>
            {isSearching ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              'Search'
            )}
          </Button>
        </div>
        
        {recentSearches.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center text-sm">
            <span className="text-muted-foreground">Recent:</span>
            {recentSearches.map((search, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="cursor-pointer hover:bg-accent"
                onClick={() => setSearchQuery(search)}
              >
                {search}
              </Badge>
            ))}
          </div>
        )}
        
        {showFilters && (
          <Card className="border p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Framework</Label>
                <Select 
                  value={activeFramework} 
                  onValueChange={(value) => setActiveFramework(value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Frameworks</SelectItem>
                    <SelectItem value="GAAP">GAAP</SelectItem>
                    <SelectItem value="IFRS">IFRS</SelectItem>
                    <SelectItem value="FASB">FASB</SelectItem>
                    <SelectItem value="IASB">IASB</SelectItem>
                    <SelectItem value="AASB">AASB</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Last Updated</Label>
                <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Time</SelectItem>
                    <SelectItem value="last-year">Last Year</SelectItem>
                    <SelectItem value="last-3-years">Last 3 Years</SelectItem>
                    <SelectItem value="last-5-years">Last 5 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="exactMatch" 
                    checked={exactMatchOnly}
                    onCheckedChange={(checked) => setExactMatchOnly(checked === true)}
                  />
                  <Label htmlFor="exactMatch">Exact match only</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="searchContent" 
                    checked={searchInContent}
                    onCheckedChange={(checked) => setSearchInContent(checked === true)}
                  />
                  <Label htmlFor="searchContent">Search in content</Label>
                </div>
              </div>
            </div>
          </Card>
        )}
        
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
          
          <TabsContent value="all" className="mt-4">
            <StandardsList 
              standards={filteredStandards} 
              bookmarks={bookmarks}
              selectedStandards={selectedStandards}
              onToggleBookmark={toggleBookmark}
              onToggleSelection={toggleStandardSelection}
            />
          </TabsContent>
          
          <TabsContent value="GAAP" className="mt-4">
            <StandardsList 
              standards={filteredStandards} 
              bookmarks={bookmarks}
              selectedStandards={selectedStandards}
              onToggleBookmark={toggleBookmark}
              onToggleSelection={toggleStandardSelection}
            />
          </TabsContent>
          
          <TabsContent value="IFRS" className="mt-4">
            <StandardsList 
              standards={filteredStandards} 
              bookmarks={bookmarks}
              selectedStandards={selectedStandards}
              onToggleBookmark={toggleBookmark}
              onToggleSelection={toggleStandardSelection}
            />
          </TabsContent>
          
          <TabsContent value="FASB" className="mt-4">
            <StandardsList 
              standards={filteredStandards} 
              bookmarks={bookmarks}
              selectedStandards={selectedStandards}
              onToggleBookmark={toggleBookmark}
              onToggleSelection={toggleStandardSelection}
            />
          </TabsContent>
          
          <TabsContent value="IASB" className="mt-4">
            <StandardsList 
              standards={filteredStandards} 
              bookmarks={bookmarks}
              selectedStandards={selectedStandards}
              onToggleBookmark={toggleBookmark}
              onToggleSelection={toggleStandardSelection}
            />
          </TabsContent>
          
          <TabsContent value="AASB" className="mt-4">
            <StandardsList 
              standards={filteredStandards} 
              bookmarks={bookmarks}
              selectedStandards={selectedStandards}
              onToggleBookmark={toggleBookmark}
              onToggleSelection={toggleStandardSelection}
            />
          </TabsContent>
          
          <TabsContent value="Other" className="mt-4">
            <StandardsList 
              standards={filteredStandards} 
              bookmarks={bookmarks}
              selectedStandards={selectedStandards}
              onToggleBookmark={toggleBookmark}
              onToggleSelection={toggleStandardSelection}
            />
          </TabsContent>
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

const StandardsList: React.FC<{ 
  standards: AccountingStandard[],
  bookmarks: string[],
  selectedStandards: string[],
  onToggleBookmark: (id: string) => void,
  onToggleSelection: (id: string) => void
}> = ({ 
  standards,
  bookmarks,
  selectedStandards,
  onToggleBookmark,
  onToggleSelection
}) => {
  const [expandedStandard, setExpandedStandard] = useState<string | null>(null);
  
  if (standards.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
        <BookOpen className="h-12 w-12 text-muted-foreground/50" />
        <p>No standards found matching your search criteria.</p>
        <p className="text-sm">Try adjusting your search or filters.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Showing {standards.length} standard{standards.length !== 1 ? 's' : ''}
      </p>
      
      {standards.map(standard => (
        <Card key={standard.id} className={`overflow-hidden ${selectedStandards.includes(standard.id) ? 'border-primary' : ''}`}>
          <div
            className="p-4 cursor-pointer hover:bg-muted"
            onClick={() => setExpandedStandard(expandedStandard === standard.id ? null : standard.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  {standard.name}
                  <Badge className="ml-2">
                    {standard.framework}
                  </Badge>
                  {standard.category && (
                    <Badge variant="outline" className="ml-1">
                      {standard.category}
                    </Badge>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{standard.description}</p>
                {standard.lastUpdated && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Last updated: {new Date(standard.lastUpdated).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant={selectedStandards.includes(standard.id) ? "default" : "outline"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSelection(standard.id);
                  }}
                >
                  {selectedStandards.includes(standard.id) ? "Selected" : "Select for Compare"}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(standard.id);
                  }}
                  className={bookmarks.includes(standard.id) ? "text-yellow-500" : "text-muted-foreground"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={bookmarks.includes(standard.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                  </svg>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedStandard(expandedStandard === standard.id ? null : standard.id);
                  }}
                >
                  {expandedStandard === standard.id ? 'Collapse' : 'Expand'}
                </Button>
              </div>
            </div>
          </div>
          
          {expandedStandard === standard.id && (
            <CardContent className="border-t pt-4">
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: standard.content }} />
                
                {standard.examples && standard.examples.length > 0 && (
                  <>
                    <h4>Examples</h4>
                    <ul>
                      {standard.examples.map((example, index) => (
                        <li key={index}>{example}</li>
                      ))}
                    </ul>
                  </>
                )}
                
                {standard.relatedStandards && standard.relatedStandards.length > 0 && (
                  <>
                    <h4>Related Standards</h4>
                    <div className="flex flex-wrap gap-2">
                      {standard.relatedStandards.map(id => (
                        <Button 
                          key={id} 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedStandard(id);
                          }}
                        >
                          {id}
                        </Button>
                      ))}
                    </div>
                  </>
                )}
                
                <div className="flex justify-end mt-4">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`#/standards/${standard.id}`, '_blank');
                    }}
                  >
                    View Full Standard
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};

export default StandardsLibrary;
