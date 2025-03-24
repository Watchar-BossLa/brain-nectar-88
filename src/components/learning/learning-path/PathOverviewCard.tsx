
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award } from 'lucide-react';

interface PathOverviewCardProps {
  path: any;
}

const PathOverviewCard = ({ path }: PathOverviewCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="h-5 w-5 mr-2 text-primary" />
          {path.qualification?.title || 'Learning Path'}
        </CardTitle>
        <CardDescription>
          Created {new Date(path.created_at).toLocaleDateString()}
          {path.description && ` • ${path.description}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span className="font-medium">32%</span>
          </div>
          <Progress value={32} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default PathOverviewCard;
