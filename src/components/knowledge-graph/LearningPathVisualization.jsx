import React, { useState, useEffect } from 'react';
import { useLearningPathGenerator } from '@/services/knowledge-graph';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ChevronRight, 
  ChevronLeft, 
  BarChart2, 
  BookOpen,
  ArrowRight,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react';

/**
 * Learning Path Visualization Component
 * Visualizes a learning path with steps and progression
 * @param {Object} props - Component props
 * @param {string} props.pathId - Learning path ID
 * @param {Function} [props.onStepClick] - Callback when a step is clicked
 * @returns {React.ReactElement} Learning path visualization component
 */
const LearningPathVisualization = ({ pathId, onStepClick }) => {
  const learningPathGenerator = useLearningPathGenerator();
  const [path, setPath] = useState(null);
  const [difficultyData, setDifficultyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // Load learning path
  useEffect(() => {
    if (!pathId) return;
    
    const loadPath = async () => {
      try {
        setLoading(true);
        
        // Get learning path
        const pathData = await learningPathGenerator.getLearningPath(pathId);
        setPath(pathData);
        
        // Get difficulty progression
        const difficulty = await learningPathGenerator.generateDifficultyProgression(pathId);
        setDifficultyData(difficulty);
        
        setError(null);
      } catch (err) {
        console.error('Error loading learning path:', err);
        setError(err.message || 'Failed to load learning path');
      } finally {
        setLoading(false);
      }
    };
    
    loadPath();
  }, [pathId, learningPathGenerator]);
  
  // Handle step click
  const handleStepClick = (step) => {
    if (onStepClick) {
      onStepClick(step);
    }
  };
  
  // Handle next step
  const handleNextStep = () => {
    if (path && path.steps && currentStepIndex < path.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-full" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription>Failed to load learning path</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // Render empty state
  if (!path || !path.steps || path.steps.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Learning Path</CardTitle>
          <CardDescription>
            This learning path is empty or does not exist
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Steps Found</h3>
            <p className="text-sm text-muted-foreground">
              This learning path does not contain any steps.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Get current step
  const currentStep = path.steps[currentStepIndex];
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{path.name}</CardTitle>
            <CardDescription>
              {path.description || `Learning path with ${path.steps.length} steps`}
            </CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center">
            <BookOpen className="h-3 w-3 mr-1" />
            {path.steps.length} steps
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{currentStepIndex + 1} / {path.steps.length}</span>
          </div>
          <Progress value={((currentStepIndex + 1) / path.steps.length) * 100} className="h-2" />
        </div>
        
        {/* Current step */}
        <div 
          className="border rounded-lg p-6 mb-6 cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => handleStepClick(currentStep)}
        >
          <h3 className="text-xl font-medium mb-2">
            {currentStep.concept ? currentStep.concept.name : `Step ${currentStepIndex + 1}`}
          </h3>
          
          {currentStep.description && (
            <p className="text-muted-foreground mb-4">
              {currentStep.description}
            </p>
          )}
          
          {currentStep.concept && currentStep.concept.description && (
            <div className="bg-muted/50 p-4 rounded-md mb-4">
              <p className="text-sm">
                {currentStep.concept.description}
              </p>
            </div>
          )}
          
          {difficultyData && difficultyData.progression && (
            <div className="flex items-center text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>
                Difficulty: {Math.round(difficultyData.progression[currentStepIndex]?.difficulty * 100)}%
              </span>
            </div>
          )}
          
          {currentStep.concept && currentStep.concept.tags && currentStep.concept.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {currentStep.concept.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        {/* Path overview */}
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-3 flex items-center">
            <BarChart2 className="h-4 w-4 mr-2" />
            Path Overview
          </h4>
          
          <div className="space-y-2">
            {path.steps.map((step, index) => (
              <div 
                key={step.id}
                className={`flex items-center p-2 rounded-md cursor-pointer ${
                  index === currentStepIndex ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
                }`}
                onClick={() => setCurrentStepIndex(index)}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                  index < currentStepIndex ? 'bg-green-100 text-green-700' :
                  index === currentStepIndex ? 'bg-blue-100 text-blue-700' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    index === currentStepIndex ? 'text-primary' : ''
                  }`}>
                    {step.concept ? step.concept.name : `Step ${index + 1}`}
                  </p>
                </div>
                {index < path.steps.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Difficulty chart */}
        {difficultyData && (
          <div className="mt-6 border rounded-lg p-4">
            <h4 className="font-medium mb-3 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Difficulty Progression
            </h4>
            
            <div className="h-32 relative">
              {difficultyData.progression.map((item, index) => (
                <div 
                  key={index}
                  className={`absolute bottom-0 bg-primary/80 rounded-t-sm transition-all ${
                    index === currentStepIndex ? 'bg-primary' : ''
                  }`}
                  style={{
                    left: `${(index / difficultyData.progression.length) * 100}%`,
                    width: `${(1 / difficultyData.progression.length) * 100}%`,
                    height: `${item.difficulty * 100}%`,
                    maxWidth: '30px',
                    marginLeft: '-15px'
                  }}
                  title={`${item.conceptName}: ${Math.round(item.difficulty * 100)}%`}
                />
              ))}
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Step 1</span>
              <span>Step {difficultyData.progression.length}</span>
            </div>
            
            <div className="flex justify-between items-center mt-4 text-sm">
              <div className="flex items-center">
                <Award className="h-4 w-4 text-muted-foreground mr-1" />
                <span>Average Difficulty: {Math.round(difficultyData.averageDifficulty * 100)}%</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                <span>Estimated Time: {Math.round(difficultyData.totalDifficulty * 30)} min</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevStep}
          disabled={currentStepIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={handleNextStep}
          disabled={currentStepIndex === path.steps.length - 1}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LearningPathVisualization;
