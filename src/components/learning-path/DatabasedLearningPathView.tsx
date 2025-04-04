
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  RefreshCw, 
  ChevronRight, 
  BookOpen, 
  Star, 
  Clock, 
  CheckCircle 
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useDatabasedLearningPath } from '@/context/learning/DatabasedLearningPathContext';

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Learning Path</h2>
          <p className="text-muted-foreground">Track your progress and access recommended topics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
          <Button size="sm" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <GraduationCap className="w-4 h-4 mr-1" />
                Generate New Path
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {stats && <StatsOverviewCards stats={stats} />}
          
          <Card>
            <CardHeader>
              <CardTitle>Progress Summary</CardTitle>
              <CardDescription>Your learning journey at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modules.slice(0, 3).map(module => (
                  <div key={module.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{module.title}</span>
                      <span>
                        {calculateModuleProgress(module)}% Complete
                      </span>
                    </div>
                    <Progress 
                      value={calculateModuleProgress(module)} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full" onClick={() => setActiveTab("modules")}>
                View All Modules
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
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

// Helper component for module cards
const ModuleCard: React.FC<{ module: any }> = ({ module }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>{module.title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {module.description || 'No description available'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{calculateModuleProgress(module)}%</span>
            </div>
            <Progress value={calculateModuleProgress(module)} className="h-2 mt-1" />
          </div>
          
          <div className="space-y-3">
            {module.topics.slice(0, 3).map((topic: any) => (
              <div key={topic.id} className="flex items-center gap-2 text-sm">
                <BookOpen className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="flex-1 truncate">{topic.title}</span>
                <span className="text-xs text-muted-foreground">{topic.mastery}%</span>
              </div>
            ))}
            {module.topics.length > 3 && (
              <div className="text-center text-xs text-muted-foreground">
                +{module.topics.length - 3} more topics
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full">
            Start Learning
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// Helper component for recommended topics
const RecommendedTopics: React.FC<{ modules: any[] }> = ({ modules }) => {
  // Get all topics and filter recommended ones
  const allTopics = modules.flatMap(module => 
    module.topics.map((topic: any) => ({
      ...topic,
      moduleTitle: module.title
    }))
  );
  
  const recommendedTopics = allTopics
    .filter((topic: any) => topic.recommended)
    .sort((a: any, b: any) => a.mastery - b.mastery);
  
  if (recommendedTopics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Recommendations</CardTitle>
          <CardDescription>
            Great job! You've made good progress across all topics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-8">
            <Star className="h-16 w-16 text-yellow-500 mb-4" />
            <p className="text-center text-muted-foreground">
              Continue with your current modules or explore new content.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Recommended Focus Areas</h3>
      
      <div className="divide-y">
        {recommendedTopics.slice(0, 5).map((topic: any) => (
          <div key={topic.id} className="py-3 px-1">
            <div className="flex justify-between items-center mb-1">
              <div>
                <h4 className="font-medium">{topic.title}</h4>
                <p className="text-xs text-muted-foreground">From: {topic.moduleTitle}</p>
              </div>
              <Button size="sm">Study Now</Button>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Progress value={topic.mastery} className="h-2 flex-1" />
              <span className="text-xs whitespace-nowrap">{topic.mastery}% Mastery</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper component for statistics cards
const StatsOverviewCards: React.FC<{ stats: any }> = ({ stats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            Completed Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.completedTopics} / {stats.totalTopics}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.masteredTopics} topics mastered
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <Star className="h-4 w-4 mr-2 text-yellow-500" />
            Average Mastery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.averageMastery}%
          </div>
          <Progress value={stats.averageMastery} className="h-1.5 mt-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <Clock className="h-4 w-4 mr-2 text-blue-500" />
            Estimated Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.estimatedCompletionDays} days
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Current streak: {stats.streak} days
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper component for empty state
const EmptyLearningPath: React.FC<{ onGenerate: () => void, isGenerating: boolean }> = ({ 
  onGenerate, 
  isGenerating 
}) => {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>No Learning Path Available</CardTitle>
        <CardDescription>
          Generate a personalized learning path to get started.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center py-8">
        <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">
          Your adaptive learning path will be tailored to your progress and strengths.
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={onGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>Generate Learning Path</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Helper component for error state
const LearningPathError: React.FC<{ onRetry: () => void }> = ({ onRetry }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-red-500">Error Loading Learning Path</CardTitle>
        <CardDescription>
          We encountered a problem while loading your learning path.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          This could be due to a network issue or server problem.
        </p>
        <Button onClick={onRetry}>Try Again</Button>
      </CardContent>
    </Card>
  );
};

// Loading skeleton
const LearningPathSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      
      <Skeleton className="h-64" />
    </div>
  );
};

// Helper function to calculate module progress
const calculateModuleProgress = (module: any): number => {
  if (!module.topics || module.topics.length === 0) return 0;
  
  const totalMastery = module.topics.reduce((sum: number, topic: any) => sum + (topic.mastery || 0), 0);
  return Math.round(totalMastery / module.topics.length);
};

export default DatabasedLearningPathView;
