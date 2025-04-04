
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useDatabasedLearningPath } from '@/context/learning/DatabasedLearningPathContext';
import { DatabasedLearningPathProvider } from '@/context/learning/DatabasedLearningPathContext';

/**
 * A simplified learning path component that can be used as a tab
 * in another component without modifying existing code
 */
const DatabasedPathTab = () => {
  return (
    <DatabasedLearningPathProvider>
      <DatabasedPathTabContent />
    </DatabasedLearningPathProvider>
  );
};

// Separate the content to avoid provider nesting issues
const DatabasedPathTabContent = () => {
  const { modules, isLoading } = useDatabasedLearningPath();

  if (isLoading) {
    return <div className="py-8 text-center">Loading learning path data...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Your Learning Path</h3>
      <p className="text-muted-foreground">
        This is your personalized learning journey based on your progress.
      </p>
      
      {modules.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">No learning path has been created yet.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Visit the Learning Path page to generate your personalized learning journey.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {modules.map(module => (
            <div key={module.id} className="border rounded-lg p-4">
              <h4 className="font-medium">{module.title}</h4>
              <p className="text-sm text-muted-foreground">
                {module.topics.length} topics | {calculateModuleProgress(module)}% complete
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function to calculate module progress
const calculateModuleProgress = (module: any): number => {
  if (!module.topics || module.topics.length === 0) return 0;
  
  const totalMastery = module.topics.reduce((sum: number, topic: any) => sum + (topic.mastery || 0), 0);
  return Math.round(totalMastery / module.topics.length);
};

export default DatabasedPathTab;
