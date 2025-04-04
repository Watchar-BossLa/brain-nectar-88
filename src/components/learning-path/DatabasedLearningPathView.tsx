
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDatabasedLearningPath } from '@/context/learning/DatabasedLearningPathContext';

// Import our new components
import ModuleCard from './components/ModuleCard';
import RecommendedTopics from './components/RecommendedTopics';
import StatsOverviewCards from './components/StatsOverviewCards';
import EmptyLearningPath from './components/EmptyLearningPath';
import LearningPathError from './components/LearningPathError';
import LearningPathSkeleton from './components/LearningPathSkeleton';
import ProgressSummary from './components/ProgressSummary';
import PathHeader from './components/PathHeader';

/**
 * Component to display and interact with learning paths from the database
 */
const DatabasedLearningPathView: React.FC = () => {
  const { 
    modules, 
    isLoading, 
    error, 
    stats,
    generateLearningPath, 
    refreshLearningPath 
  } = useDatabasedLearningPath();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Handle generate learning path
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Using a placeholder qualification ID - in a real app, this would be selected by the user
      await generateLearningPath("placeholder-qualification-id");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    await refreshLearningPath();
  };

  if (isLoading) {
    return <LearningPathSkeleton />;
  }

  if (error) {
    return <LearningPathError onRetry={handleRefresh} />;
  }

  if (modules.length === 0) {
    return <EmptyLearningPath onGenerate={handleGenerate} isGenerating={isGenerating} />;
  }

  return (
    <div className="space-y-6">
      <PathHeader 
        onRefresh={handleRefresh}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {stats && <StatsOverviewCards stats={stats} />}
          
          <ProgressSummary 
            modules={modules} 
            onViewAllModules={() => setActiveTab("modules")}
          />
        </TabsContent>
        
        <TabsContent value="modules" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {modules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-4">
          <RecommendedTopics modules={modules} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatabasedLearningPathView;
