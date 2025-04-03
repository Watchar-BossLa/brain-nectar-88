import { Flashcard } from './supabase';
import { QuizQuestion } from '../components/quiz/types';
import { AccountComponent, UpdateComponentFunction, TransactionType } from '../components/accounting/equation-visualizer/types';
import { TaskCategory } from '@/types/enums';

export interface QualificationType {
  id: string;
  name: string;
  description: string;
  color: string;
  progress: number;
  modules: number;
  completed: number;
  metadata: {
    website: string;
    accreditation: string;
    duration: string;
  };
}

export interface QualificationHeaderProps {
  qualification: QualificationType;
}

export interface QualificationProgressProps {
  qualification: QualificationType;
}

export interface QualificationMetadataProps {
  qualification: QualificationType;
}

export interface TopicItemProps {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
}

export interface QualificationStructureAccordionProps {
  qualificationId: string;
  modules: any[];
  getStatusBadge: (status: string) => React.ReactNode;
  accordionName: string;
  websiteName: string;
}

export interface ScoreSummaryProps {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
}

export interface AllFlashcardsTabProps {
  isLoading: boolean;
  flashcards: Flashcard[];
  onDeleteFlashcard: (id: string) => Promise<void>;
  onCardUpdated: () => void;
  onCreateSimpleFlashcard: () => void;
  onCreateAdvancedFlashcard: () => void;
}

export interface DueFlashcardsTabProps {
  flashcards: Flashcard[];
  onStartReview: () => void;
  onDeleteFlashcard: (id: string) => Promise<void>;
  onCardUpdated: () => void;
  onCreateSimpleFlashcard: () => void;
  onCreateAdvancedFlashcard: () => void;
}

export interface ReviewHeaderProps {
  reviewsCompleted: number;
  totalToReview: number;
}

export interface EmptyReviewStateProps {
  // No props needed as it's a static component
}

export interface LoadingSkeletonProps {
  // No props needed as it's a static component
}

export interface ReviewLoadingProps {
  // No props needed as it's a static component
}

export interface DashboardTabsProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  availableModels: string[];
  modelMetrics: Record<string, any>;
  testProps: {
    testPrompt: string;
    setTestPrompt: (prompt: string) => void;
    isGenerating: boolean;
    testResult: string;
    handleTestGeneration: () => Promise<void>;
    handleTestWithModel: () => Promise<void>;
    selectedModel: string;
    setSelectedModel: (model: string) => void;
    selectedTaskCategory: TaskCategory;
    setSelectedTaskCategory: (category: TaskCategory) => void;
    TaskCategory: typeof TaskCategory;
  };
}

export interface PanelTabsProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  availableModels: string[];
  modelMetrics: Record<string, any>;
  testProps: {
    testPrompt: string;
    setTestPrompt: (prompt: string) => void;
    isGenerating: boolean;
    generatedText: string;
    handleTestGeneration: () => Promise<void>;
    TaskCategory: typeof TaskCategory;
  };
}
