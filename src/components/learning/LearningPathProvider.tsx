
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';

// Define the structure for a learning path
export interface LearningPath {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  pathData: Record<string, any>;
  modules: Array<{
    id: string;
    title: string;
    description: string;
    topics: Array<{
      id: string;
      title: string;
      description?: string;
      resources?: Array<{
        id: string;
        title: string;
        type: string;
        url: string;
      }>;
      mastery?: number;
    }>;
  }>;
}

interface LearningPathContextType {
  path: LearningPath | null;
  isLoading: boolean;
  error: Error | null;
  refreshPath: () => Promise<void>;
}

const LearningPathContext = createContext<LearningPathContextType | undefined>(undefined);

export const useLearningPath = () => {
  const context = useContext(LearningPathContext);
  if (context === undefined) {
    throw new Error('useLearningPath must be used within a LearningPathProvider');
  }
  return context;
};

export const LearningPathProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [path, setPath] = useState<LearningPath | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPath = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Mocking API call for now
      const mockPath = {
        id: "path-1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "active",
        path_data: {},
        modules: [
          {
            id: "module-1",
            title: "Accounting Fundamentals",
            description: "Learn the basics of accounting principles",
            topics: [
              {
                id: "topic-1",
                title: "The Accounting Equation",
                description: "Understanding assets, liabilities and equity",
                mastery: 0.2
              },
              {
                id: "topic-2",
                title: "Double-Entry Bookkeeping",
                description: "The foundation of all accounting systems",
                mastery: 0
              }
            ]
          }
        ]
      };

      // Convert to the correct type structure
      const formattedPath: LearningPath = {
        id: mockPath.id,
        createdAt: mockPath.created_at,
        updatedAt: mockPath.updated_at,
        status: mockPath.status,
        pathData: mockPath.path_data,
        modules: mockPath.modules
      };

      setPath(formattedPath);
    } catch (err) {
      console.error('Error fetching learning path:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      toast({
        title: "Error",
        description: "Failed to load your learning path. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPath();
  }, [user]);

  const value = {
    path,
    isLoading,
    error,
    refreshPath: fetchPath
  };

  return (
    <LearningPathContext.Provider value={value}>
      {children}
    </LearningPathContext.Provider>
  );
};
