import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Route, Clock, Calendar, ArrowRight, Lock, Globe, Network } from 'lucide-react';

/**
 * Learning Path Card Component
 * @param {Object} props - Component props
 * @param {Object} props.path - Path data
 * @returns {React.ReactElement} Learning path card component
 */
const LearningPathCard = ({ path }) => {
  const navigate = useNavigate();
  
  const handleViewPath = () => {
    navigate(`/knowledge-visualization/paths/${path.id}`);
  };
  
  // Format the creation date
  const createdDate = new Date(path.created_at).toLocaleDateString();
  
  // Calculate progress percentage
  const progressPercentage = path.progress ? 
    Math.round(path.progress.completion_percentage) : 
    0;
  
  // Get progress status
  const getProgressStatus = () => {
    if (!path.progress) return 'Not Started';
    
    switch (path.progress.status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'Not Started';
    }
  };
  
  // Get difficulty badge
  const getDifficultyBadge = () => {
    switch (path.difficulty_level) {
      case 'beginner':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Beginner
          </Badge>
        );
      case 'intermediate':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Intermediate
          </Badge>
        );
      case 'advanced':
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Advanced
          </Badge>
        );
      case 'expert':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Expert
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {path.difficulty_level || 'Unknown'}
          </Badge>
        );
    }
  };
  
  return (
    <Card className="w-full hover:shadow-md transition-shadow cursor-pointer" onClick={handleViewPath}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{path.title}</CardTitle>
          {path.is_public ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Globe className="h-3 w-3 mr-1" />
              Public
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Lock className="h-3 w-3 mr-1" />
              Private
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2">{path.description || 'No description'}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {getDifficultyBadge()}
            <Badge variant="secondary">
              <Route className="h-3 w-3 mr-1" />
              {path.path_nodes_count || 0} nodes
            </Badge>
          </div>
          {path.knowledge_maps && (
            <Badge variant="outline" className="flex items-center">
              <Network className="h-3 w-3 mr-1" />
              {path.knowledge_maps.title}
            </Badge>
          )}
        </div>
        
        <div className="space-y-1 mb-3">
          <div className="flex justify-between text-xs">
            <span>{getProgressStatus()}</span>
            <span>{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          {path.estimated_duration && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{path.estimated_duration} min</span>
            </div>
          )}
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Created {createdDate}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-end">
        <Button variant="ghost" size="sm" onClick={handleViewPath}>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LearningPathCard;
