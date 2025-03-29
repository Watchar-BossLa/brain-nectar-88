
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { LearningStats } from '@/types/flashcard';

interface LearningAnalyticsCardProps {
  stats: LearningStats | null;
  loading: boolean;
}

const LearningAnalyticsCard: React.FC<LearningAnalyticsCardProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Learning Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-56 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Learning Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-56 flex items-center justify-center">
            <p className="text-muted-foreground">No data available yet. Start learning to see analytics.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const pieData = [
    { name: 'Mastered', value: stats.masteredCardCount, color: '#22c55e' },
    { name: 'In Progress', value: stats.totalReviews - stats.masteredCardCount, color: '#3b82f6' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Knowledge Mastery</h3>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between">
                  <p className="text-sm font-medium">Retention Rate</p>
                  <p className="text-sm font-medium">{Math.round(stats.retentionRate * 100)}%</p>
                </div>
                <Progress value={stats.retentionRate * 100} className="h-2 mt-1" />
              </div>
              <div>
                <div className="flex justify-between">
                  <p className="text-sm font-medium">Learning Efficiency</p>
                  <p className="text-sm font-medium">{Math.round(stats.learningEfficiency * 100)}%</p>
                </div>
                <Progress value={stats.learningEfficiency * 100} className="h-2 mt-1" />
              </div>
              <div className="bg-muted p-2 rounded-md mt-2">
                <p className="text-sm">Recommended daily reviews: <span className="font-medium">{stats.recommendedDailyReviews}</span></p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningAnalyticsCard;
