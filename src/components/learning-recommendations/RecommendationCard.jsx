import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BookOpen, Video, Headphones, FileText, Zap, Star, X, Eye, Bookmark, Tag } from 'lucide-react';

/**
 * Recommendation Card Component
 * @param {Object} props - Component props
 * @param {Object} props.recommendation - Recommendation data
 * @param {Function} props.onView - View handler
 * @param {Function} props.onSave - Save handler
 * @param {Function} props.onDismiss - Dismiss handler
 * @returns {React.ReactElement} Recommendation card component
 */
const RecommendationCard = ({ recommendation, onView, onSave, onDismiss }) => {
  if (!recommendation || !recommendation.content_items) {
    return null;
  }
  
  const content = recommendation.content_items;
  
  // Get content type icon
  const getContentTypeIcon = () => {
    switch (content.content_type) {
      case 'video':
        return <Video className="h-4 w-4 mr-1" />;
      case 'audio':
        return <Headphones className="h-4 w-4 mr-1" />;
      case 'article':
        return <FileText className="h-4 w-4 mr-1" />;
      case 'interactive':
        return <Zap className="h-4 w-4 mr-1" />;
      default:
        return <BookOpen className="h-4 w-4 mr-1" />;
    }
  };
  
  // Get recommendation type badge
  const getRecommendationTypeBadge = () => {
    switch (recommendation.recommendation_type) {
      case 'topic_based':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Tag className="h-3 w-3 mr-1" />
            Topic Match
          </Badge>
        );
      case 'activity_based':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Zap className="h-3 w-3 mr-1" />
            Based on Activity
          </Badge>
        );
      case 'learning_style':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Star className="h-3 w-3 mr-1" />
            Matches Your Style
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            Recommended
          </Badge>
        );
    }
  };
  
  // Handle view click
  const handleViewClick = () => {
    if (onView) {
      onView(recommendation.id);
    }
  };
  
  // Handle save click
  const handleSaveClick = (e) => {
    e.stopPropagation();
    if (onSave) {
      onSave(recommendation.id);
    }
  };
  
  // Handle dismiss click
  const handleDismissClick = (e) => {
    e.stopPropagation();
    if (onDismiss) {
      onDismiss(recommendation.id);
    }
  };
  
  return (
    <Card 
      className="w-full hover:shadow-md transition-shadow cursor-pointer" 
      onClick={handleViewClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{content.title}</CardTitle>
          {getRecommendationTypeBadge()}
        </div>
        <CardDescription className="line-clamp-2">
          {content.description || 'No description available'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-1 mb-2">
          {content.topics && content.topics.map(topic => (
            <Badge key={topic} variant="secondary" className="flex items-center">
              <Tag className="h-3 w-3 mr-1" />
              {topic}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            {getContentTypeIcon()}
            <span className="capitalize">{content.content_type}</span>
          </div>
          {content.difficulty_level && (
            <div className="flex items-center">
              <span className="capitalize">{content.difficulty_level} level</span>
            </div>
          )}
          {content.estimated_duration && (
            <div className="flex items-center">
              <span>{content.estimated_duration} min</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <div className="flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  <span>{recommendation.relevance_score}% match</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Relevance score based on your profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" onClick={handleViewClick}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSaveClick}>
            <Bookmark className={`h-4 w-4 ${recommendation.is_saved ? 'fill-current' : ''}`} />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDismissClick}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RecommendationCard;
