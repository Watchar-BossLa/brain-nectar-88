
export interface AccountingStandard {
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

export interface StandardsLibraryProps {
  standards?: AccountingStandard[];
  className?: string;
  onSearchStart?: () => void;
  onSearchComplete?: (results: AccountingStandard[]) => void;
}

export interface StandardsListProps { 
  standards: AccountingStandard[];
  bookmarks: string[];
  selectedStandards: string[];
  onToggleBookmark: (id: string) => void;
  onToggleSelection: (id: string) => void;
}
