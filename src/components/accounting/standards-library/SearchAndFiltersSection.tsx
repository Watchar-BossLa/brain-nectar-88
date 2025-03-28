
import React from 'react';
import SearchAndFilters from '../standards/SearchAndFilters';

interface SearchAndFiltersSectionProps {
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

const SearchAndFiltersSection: React.FC<SearchAndFiltersSectionProps> = (props) => {
  return (
    <SearchAndFilters
      searchQuery={props.searchQuery}
      setSearchQuery={props.setSearchQuery}
      categoryFilter={props.categoryFilter}
      setCategoryFilter={props.setCategoryFilter}
      activeFramework={props.activeFramework}
      setActiveFramework={props.setActiveFramework}
      dateRangeFilter={props.dateRangeFilter}
      setDateRangeFilter={props.setDateRangeFilter}
      exactMatchOnly={props.exactMatchOnly}
      setExactMatchOnly={props.setExactMatchOnly}
      searchInContent={props.searchInContent}
      setSearchInContent={props.setSearchInContent}
      showFilters={props.showFilters}
      setShowFilters={props.setShowFilters}
      performSearch={props.performSearch}
      isSearching={props.isSearching}
      recentSearches={props.recentSearches}
      categories={props.categories}
    />
  );
};

export default SearchAndFiltersSection;
