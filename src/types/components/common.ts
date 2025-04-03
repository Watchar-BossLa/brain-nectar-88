
/**
 * Common/shared component prop types
 * These are component props that don't fit neatly into other categories
 * or could be used across multiple categories
 */

export interface DashboardTabsProps {
  className?: string;
}

export interface PanelTabsProps {
  className?: string;
}

// Additional common component props
export interface TabsContainerProps {
  className?: string;
  children: React.ReactNode;
}

