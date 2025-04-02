
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, Clock, BookOpen, CheckCircle } from "lucide-react";

interface FlashcardStatsOverviewProps {
  total: number;
  mastered: number;
  learning: number;
  due: number;
  isLoading?: boolean;
}

const FlashcardStatsOverview: React.FC<FlashcardStatsOverviewProps> = ({
  total,
  mastered,
  learning,
  due,
  isLoading = false
}) => {
  const { t } = useTranslation();
  
  const stats = [
    { 
      label: t('flashcards.totalCards'), 
      value: total, 
      icon: BookOpen, 
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' 
    },
    { 
      label: t('flashcards.masteredCards'), 
      value: mastered, 
      icon: CheckCircle, 
      color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' 
    },
    { 
      label: t('flashcards.learningCards'), 
      value: learning, 
      icon: Brain, 
      color: 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300' 
    },
    { 
      label: t('flashcards.dueToday'), 
      value: due, 
      icon: Clock, 
      color: 'bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-300' 
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-4 flex items-center space-x-4">
            <div className={`p-2 rounded-full ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              {isLoading ? (
                <Skeleton className="h-6 w-10 mt-1" />
              ) : (
                <p className="text-2xl font-bold">{stat.value}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FlashcardStatsOverview;
