
import { Dispatch, SetStateAction } from 'react';
import { TaskCategory } from '../enums';

/**
 * Agent/LLM orchestration prop types
 */

export interface DashboardTabsProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  selectedTab: string;
  setSelectedTab: Dispatch<SetStateAction<string>>;
  availableModels: string[];
  modelMetrics: Record<string, any>;
  testProps: {
    testPrompt: string;
    setTestPrompt: Dispatch<SetStateAction<string>>;
    isGenerating: boolean;
    testResult: string;
    handleTestGeneration: () => Promise<void>;
    handleTestWithModel: () => Promise<void>;
    selectedModel: string;
    setSelectedModel: Dispatch<SetStateAction<string>>;
    selectedTaskCategory: TaskCategory;
    setSelectedTaskCategory: Dispatch<SetStateAction<TaskCategory>>;
    TaskCategory: typeof TaskCategory;
  };
}

export interface PanelTabsProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  selectedTab: string;
  setSelectedTab: Dispatch<SetStateAction<string>>;
  availableModels: string[];
  modelMetrics: Record<string, any>;
  testProps: {
    testPrompt: string;
    setTestPrompt: Dispatch<SetStateAction<string>>;
    isGenerating: boolean;
    generatedText: string;
    handleTestGeneration: () => Promise<void>;
    TaskCategory: typeof TaskCategory;
  };
}
