
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { generateLearningPath, getUserLearningPaths } from '@/services/learningPathService';
import { useToast } from '@/hooks/use-toast';
import { Tabs } from '@/components/ui/tabs';
import PathSkeleton from './loading/PathSkeleton';
import { 
  EmptyPathCard, 
  PathHeader, 
  PathContent, 
  PathTabsList 
} from './learning-path';

const AdaptiveLearningPath = ({ qualificationId }: { qualificationId?: string }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePath, setActivePath] = useState<any>(null);
  const [learningPaths, setLearningPaths] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchLearningPaths();
    }
  }, [user]);

  const fetchLearningPaths = async () => {
    if (!user) return;
    
    setIsLoading(true);
    const { data, error } = await getUserLearningPaths(user.id);
    
    if (error) {
      console.error('Error fetching learning paths:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your learning paths. Please try again.',
        variant: 'destructive',
      });
    } else if (data && data.length > 0) {
      setLearningPaths(data);
      setActivePath(data[0]); // Set the most recent plan as active
    }
    
    setIsLoading(false);
  };

  const handleGeneratePath = async () => {
    if (!user || !qualificationId) {
      toast({
        title: 'Error',
        description: 'Please select a qualification first.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsGenerating(true);
    const { data, error } = await generateLearningPath(user.id, qualificationId);
    
    if (error) {
      console.error('Error generating learning path:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate a learning path. Please try again.',
        variant: 'destructive',
      });
    } else if (data) {
      toast({
        title: 'Success',
        description: 'Your personalized learning path has been created.',
      });
      fetchLearningPaths(); // Refresh the list after generating
    }
    
    setIsGenerating(false);
  };

  if (isLoading) {
    return <PathSkeleton />;
  }

  return (
    <div className="space-y-6">
      <PathHeader 
        onGenerate={handleGeneratePath} 
        isGenerating={isGenerating} 
        qualificationId={qualificationId} 
      />

      {learningPaths.length === 0 ? (
        <EmptyPathCard 
          onGenerate={handleGeneratePath} 
          isGenerating={isGenerating} 
          isQualificationSelected={!!qualificationId} 
        />
      ) : (
        <Tabs defaultValue={activePath?.id} onValueChange={(value) => {
          const selected = learningPaths.find(path => path.id === value);
          if (selected) setActivePath(selected);
        }}>
          <PathTabsList 
            paths={learningPaths} 
            onValueChange={(value) => {
              const selected = learningPaths.find(path => path.id === value);
              if (selected) setActivePath(selected);
            }} 
          />
          
          {learningPaths.map((path) => (
            <PathContent key={path.id} path={path} />
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default AdaptiveLearningPath;
