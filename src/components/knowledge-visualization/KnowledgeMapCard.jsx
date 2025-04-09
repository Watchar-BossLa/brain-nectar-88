import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Network, Users, Calendar, ArrowRight, Lock, Globe, Tag } from 'lucide-react';

/**
 * Knowledge Map Card Component
 * @param {Object} props - Component props
 * @param {Object} props.map - Map data
 * @returns {React.ReactElement} Knowledge map card component
 */
const KnowledgeMapCard = ({ map }) => {
  const navigate = useNavigate();
  
  const handleViewMap = () => {
    navigate(`/knowledge-visualization/maps/${map.id}`);
  };
  
  // Format the creation date
  const createdDate = new Date(map.created_at).toLocaleDateString();
  const updatedDate = new Date(map.updated_at).toLocaleDateString();
  
  return (
    <Card className="w-full hover:shadow-md transition-shadow cursor-pointer" onClick={handleViewMap}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{map.title}</CardTitle>
          {map.is_public ? (
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
        <CardDescription className="line-clamp-2">{map.description || 'No description'}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-1 mb-3">
          {map.tags && map.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="flex items-center">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
          {(!map.tags || map.tags.length === 0) && (
            <span className="text-xs text-muted-foreground">No tags</span>
          )}
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Network className="h-4 w-4 mr-1" />
            <span>{map.concepts?.length || 0} concepts</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Updated {updatedDate}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <div className="flex items-center text-sm text-muted-foreground">
          {map.isOwner ? (
            <Badge variant="secondary" className="mr-2">
              Owner
            </Badge>
          ) : (
            <Badge variant="outline" className="mr-2">
              {map.role || 'Viewer'}
            </Badge>
          )}
          <span>Created {createdDate}</span>
        </div>
        <Button variant="ghost" size="sm" className="ml-auto" onClick={handleViewMap}>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default KnowledgeMapCard;
