import React from 'react';
import { FlashcardStatsProps } from '@/types/components';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpenCheck, Clock, BrainCircuit } from 'lucide-react';

const FlashcardStats: React.FC<FlashcardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Cards</p>
              <h3 className="text-2xl font-bold">{stats.totalCards}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <BookOpenCheck className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Mastered</p>
              <h3 className="text-2xl font-bold">{stats.masteredCards}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Clock className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">Due for Review</p>
              <h3 className="text-2xl font-bold">{stats.dueCards}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 flex items-center justify-center bg-blue-100 text-blue-500 rounded-md font-bold text-lg">
              {stats.reviewsToday}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reviews Today</p>
              <div className="text-2xl font-bold flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-2">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${stats.averageDifficulty * 20}%` }}
                  ></div>
                </div>
                {(stats.averageDifficulty || 0).toFixed(1)}/5
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlashcardStats;
