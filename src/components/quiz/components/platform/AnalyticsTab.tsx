
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsSummary, TopicMasteryChart, ConfidenceAccuracyChart, PerformanceOverTimeChart } from '../analytics';
import { AnalyticsTabProps } from '../../types/platform-types';
import { useQuizAnalytics } from '../../hooks/useQuizAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DifficultyCategoryChart from '../analytics/DifficultyCategoryChart';

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ answeredQuestions, setActiveTab }) => {
  const {
    topicPerformance,
    difficultyPerformance,
    selectedTimeRange,
    setSelectedTimeRange,
    isLoading,
    // Access sessions directly instead of through analyticsData
    sessions
  } = useQuizAnalytics(answeredQuestions);

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Performance Analytics</h3>
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AnalyticsSummary 
          answeredQuestions={answeredQuestions}
          sessionData={sessions || []} 
        />
      </div>

      <Tabs defaultValue="topics">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="difficulty">Difficulty</TabsTrigger>
          <TabsTrigger value="confidence">Confidence</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="topics">
          {isLoading ? (
            <Card>
              <CardHeader>
                <CardTitle>Loading data...</CardTitle>
              </CardHeader>
            </Card>
          ) : (
            <TopicMasteryChart data={topicPerformance} />
          )}
        </TabsContent>

        <TabsContent value="difficulty">
          {isLoading ? (
            <Card>
              <CardHeader>
                <CardTitle>Loading data...</CardTitle>
              </CardHeader>
            </Card>
          ) : (
            <DifficultyCategoryChart data={difficultyPerformance} />
          )}
        </TabsContent>

        <TabsContent value="confidence">
          {isLoading ? (
            <Card>
              <CardHeader>
                <CardTitle>Loading data...</CardTitle>
              </CardHeader>
            </Card>
          ) : (
            <ConfidenceAccuracyChart answeredQuestions={answeredQuestions} />
          )}
        </TabsContent>

        <TabsContent value="trends">
          {isLoading ? (
            <Card>
              <CardHeader>
                <CardTitle>Loading data...</CardTitle>
              </CardHeader>
            </Card>
          ) : (
            <PerformanceOverTimeChart answeredQuestions={answeredQuestions} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsTab;
