
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchAndFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchTerm,
  setSearchTerm
}) => {
  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search standards..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Button variant="outline">Filter</Button>
    </div>
  );
};

export default SearchAndFilters;
