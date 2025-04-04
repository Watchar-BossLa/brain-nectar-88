
import React from 'react';

/**
 * Common/shared component prop types
 * These are component props that don't fit neatly into other categories
 * or could be used across multiple categories
 */

export interface DashboardTabsProps {
  className?: string;
  selectedTab: string;
  setSelectedTab: React.Dispatch<React.SetStateAction<string>>;
  availableModels: string[];
  modelMetrics: Record<string, any>;
  testProps?: any;
}

export interface PanelTabsProps {
  className?: string;
  selectedTab: string;
  setSelectedTab: React.Dispatch<React.SetStateAction<string>>;
  availableModels: string[];
  modelMetrics: Record<string, any>;
  testProps?: any;
}

// Additional common component props
export interface TabsContainerProps {
  className?: string;
  children: React.ReactNode;
}

export interface CardProps {
  className?: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  onClick?: () => void;
  isHoverable?: boolean;
  isInteractive?: boolean;
}

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'primary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export interface IconButtonProps {
  icon: React.ReactNode;
  label?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  disabled?: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
}

export interface ErrorState {
  error: Error | null;
  errorMessage?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onClear?: () => void;
  onSearch?: () => void;
}

export interface FilterProps {
  filters: Record<string, any>;
  onFilterChange: (filterName: string, value: any) => void;
  filterOptions: Record<string, any[]>;
  className?: string;
}

export interface SortProps {
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortDirection: 'asc' | 'desc') => void;
  sortOptions: Array<{ value: string; label: string }>;
  className?: string;
}
