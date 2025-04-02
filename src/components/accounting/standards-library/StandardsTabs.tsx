
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StandardsList from '../standards/StandardsList';
import { AccountingStandard } from '../types/standards';

interface StandardsTabsProps {
  activeFramework: 'all' | 'GAAP' | 'IFRS' | 'FASB' | 'IASB' | 'AASB' | 'Other';
  setActiveFramework: (framework: 'all' | 'GAAP' | 'IFRS' | 'FASB' | 'IASB' | 'AASB' | 'Other') => void;
  filteredStandards: AccountingStandard[];
  bookmarks: string[];
  selectedStandards: string[];
  onToggleBookmark: (id: string) => void;
  onToggleSelection: (id: string) => void;
}

const StandardsTabs: React.FC<StandardsTabsProps> = ({
  activeFramework,
  setActiveFramework,
  filteredStandards,
  bookmarks,
  selectedStandards,
  onToggleBookmark,
  onToggleSelection
}) => {
  const frameworks = ['all', 'GAAP', 'IFRS', 'FASB', 'IASB', 'AASB', 'Other'];

  return (
    <Tabs 
      defaultValue="all" 
      value={activeFramework} 
      onValueChange={(value) => setActiveFramework(value as any)}
    >
      <TabsList className="grid w-full grid-cols-3 md:grid-cols-7">
        {frameworks.map(framework => (
          <TabsTrigger key={framework} value={framework}>
            {framework === 'all' ? 'All' : framework}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {frameworks.map((framework) => (
        <TabsContent key={framework} value={framework} className="mt-4">
          <StandardsList 
            standards={filteredStandards} 
            bookmarks={bookmarks}
            selectedStandards={selectedStandards}
            onToggleBookmark={onToggleBookmark}
            onToggleSelection={onToggleSelection}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default StandardsTabs;
