import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lightbulb, TrendingUp, Clock, Brain, Calendar } from 'lucide-react';

/**
 * Learning Insights Component
 * Shows AI-generated insights about learning patterns
 * 
 * @param {Object} props - Component props
 * @param {Array} props.insights - Insights data
 * @param {string} props.title - Component title
 * @param {string} props.description - Component description
 * @returns {React.ReactElement} Learning insights component
 */
const LearningInsights = ({ 
  insights = {}, 
  title = "Learning Insights", 
  description = "AI-powered insights to improve your learning" 
}) => {
  // If no insights, show placeholder
  if (!insights || Object.keys(insights).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground">No insights available yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Get icon for insight type
  const getInsightIcon = (type) => {
    switch (type) {
      case 'pattern':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'timing':
        return <Clock className="h-5 w-5 text-purple-500" />;
      case 'retention':
        return <Brain className="h-5 w-5 text-green-500" />;
      case 'schedule':
        return <Calendar className="h-5 w-5 text-orange-500" />;
      default:
        return <Lightbulb className="h-5 w-5 text-yellow-500" />;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4 pt-4">
            {insights.all && insights.all.map((insight, index) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                    
                    {insight.action && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Suggested action: </span>
                        {insight.action}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="patterns" className="space-y-4 pt-4">
            {insights.patterns && insights.patterns.map((insight, index) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {(!insights.patterns || insights.patterns.length === 0) && (
              <div className="text-center py-8">
                <Lightbulb className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No pattern insights available yet</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-4 pt-4">
            {insights.recommendations && insights.recommendations.map((insight, index) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                    
                    {insight.action && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Suggested action: </span>
                        {insight.action}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {(!insights.recommendations || insights.recommendations.length === 0) && (
              <div className="text-center py-8">
                <Lightbulb className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No recommendations available yet</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="predictions" className="space-y-4 pt-4">
            {insights.predictions && insights.predictions.map((insight, index) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    <Brain className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                    
                    {insight.confidence && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Confidence: {insight.confidence}%
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {(!insights.predictions || insights.predictions.length === 0) && (
              <div className="text-center py-8">
                <Lightbulb className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No predictions available yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LearningInsights;
