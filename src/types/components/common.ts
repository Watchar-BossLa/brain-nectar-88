
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
  testProps: any;
}

export interface PanelTabsProps {
  className?: string;
  selectedTab: string;
  setSelectedTab: React.Dispatch<React.SetStateAction<string>>;
  availableModels: string[];
  modelMetrics: Record<string, any>;
  testProps: any;
}

// Additional common component props
export interface TabsContainerProps {
  className?: string;
  children: React.ReactNode;
}
