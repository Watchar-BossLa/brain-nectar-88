
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
  revisions?: StandardRevision[];
  implementationGuidance?: string;
  supersedes?: string[];
  supersededBy?: string;
}

export interface StandardRevision {
  date: string;
  description: string;
}

export interface StandardsLibraryProps {
  standards?: AccountingStandard[];
  className?: string;
  onSearchStart?: () => void;
  onSearchComplete?: (results: AccountingStandard[]) => void;
}

export interface StandardsSearchFilters {
  framework: 'all' | 'GAAP' | 'IFRS' | 'FASB' | 'IASB' | 'AASB' | 'Other';
  category: string;
  dateRange: string;
  searchInContent: boolean;
  exactMatchOnly: boolean;
}
