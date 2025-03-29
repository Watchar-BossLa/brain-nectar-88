
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MasteryProgressChartProps {
  masteryData: {
    category: string;
    progress: number;
  }[];
}

const MasteryProgressChart: React.FC<MasteryProgressChartProps> = ({ masteryData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Knowledge Mastery</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {masteryData.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{item.category}</span>
                <span className="text-sm font-medium">{item.progress}%</span>
              </div>
              <Progress 
                value={item.progress} 
                className="h-2"
                indicatorClassName={
                  item.progress < 30 ? "bg-red-500" :
                  item.progress < 70 ? "bg-yellow-500" : "bg-green-500"
                }
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MasteryProgressChart;
