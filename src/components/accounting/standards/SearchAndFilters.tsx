
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, RefreshCw } from 'lucide-react';

interface SearchAndFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  activeFramework: 'all' | 'GAAP' | 'IFRS' | 'FASB' | 'IASB' | 'AASB' | 'Other';
  setActiveFramework: (framework: 'all' | 'GAAP' | 'IFRS' | 'FASB' | 'IASB' | 'AASB' | 'Other') => void;
  dateRangeFilter: string;
  setDateRangeFilter: (range: string) => void;
  exactMatchOnly: boolean;
  setExactMatchOnly: (exact: boolean) => void;
  searchInContent: boolean;
  setSearchInContent: (search: boolean) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  performSearch: () => void;
  isSearching: boolean;
  recentSearches: string[];
  categories: string[];
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  activeFramework,
  setActiveFramework,
  dateRangeFilter,
  setDateRangeFilter,
  exactMatchOnly,
  setExactMatchOnly,
  searchInContent,
  setSearchInContent,
  showFilters,
  setShowFilters,
  performSearch,
  isSearching,
  recentSearches,
  categories
}) => {
  return (
    <>
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
    </>
  );
};

export default SearchAndFilters;
