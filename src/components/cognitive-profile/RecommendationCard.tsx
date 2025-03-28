
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LightbulbIcon } from 'lucide-react';

interface RecommendationCardProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

const RecommendationCard = ({ 
  title, 
  description, 
  actionText = "Apply Recommendation", 
  onAction 
}: RecommendationCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
            <LightbulbIcon className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </div>
          <CardTitle className="text-base font-medium">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-foreground/80">
          {description}
        </CardDescription>
      </CardContent>
      {onAction && (
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full text-primary" 
            onClick={onAction}
          >
            {actionText}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default RecommendationCard;
