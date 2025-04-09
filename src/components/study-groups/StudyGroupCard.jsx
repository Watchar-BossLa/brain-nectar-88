import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Calendar, ArrowRight } from 'lucide-react';

/**
 * Study Group Card Component
 * @param {Object} props - Component props
 * @param {Object} props.group - Group data
 * @param {Function} props.onJoin - Join group handler
 * @returns {React.ReactElement} Study group card component
 */
const StudyGroupCard = ({ group, onJoin }) => {
  const navigate = useNavigate();
  
  const handleViewGroup = () => {
    navigate(`/study-groups/${group.id}`);
  };
  
  const handleJoinGroup = (e) => {
    e.stopPropagation();
    if (onJoin) {
      onJoin(group.id);
    }
  };
  
  // Format the creation date
  const createdDate = new Date(group.created_at).toLocaleDateString();
  
  return (
    <Card className="w-full hover:shadow-md transition-shadow cursor-pointer" onClick={handleViewGroup}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{group.name}</CardTitle>
          {group.is_public ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Public
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Private
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2">{group.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{group.memberCount || 0} members</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Created {createdDate}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        {group.isMember ? (
          <div className="flex items-center text-sm text-muted-foreground">
            <Badge variant="secondary" className="mr-2">
              {group.memberRole === 'admin' ? 'Admin' : 'Member'}
            </Badge>
            <span>Joined {new Date(group.joinedAt).toLocaleDateString()}</span>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={handleJoinGroup}>
            Join Group
          </Button>
        )}
        <Button variant="ghost" size="sm" className="ml-auto" onClick={handleViewGroup}>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StudyGroupCard;
