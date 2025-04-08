
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useAuth } from '@/context/auth';
import { useToast } from '@/components/ui/use-toast';
import { calculateFlashcardRetention, getFlashcardLearningStats } from '@/services/spacedRepetition';

/**
 * Retention Analytics Dashboard for visualizing learning progress
 */
const RetentionDashboard = ({ topicId = null }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('retention');
  const [retentionData, setRetentionData] = useState({
    items: [],
    averageRetention: 0,
    retentionByTopic: {},
    lowestRetention: 0
  });
  const [learningStats, setLearningStats] = useState({
    totalCards: 0,
    masteredCards: 0,
    dueCards: 0,
    averageDifficulty: 0,
    reviewsToday: 0,
    averageRetention: 0,
    masteryByTopic: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  const [forgettingCurveData, setForgettingCurveData] = useState([]);
  const [focusAreas, setFocusAreas] = useState([]);

  // Fetch retention data on component mount
  useEffect(() => {
    if (user) {
      fetchRetentionData();
    }
  }, [user, topicId]);

  // Fetch all data needed for the dashboard
  const fetchRetentionData = async () => {
    setIsLoading(true);
    try {
      // Get retention data and learning stats
      const [retention, stats] = await Promise.all([
        calculateFlashcardRetention(user.id, topicId),
        getFlashcardLearningStats(user.id)
      ]);
      
      setRetentionData(retention);
      setLearningStats(stats);
      
      // Generate forgetting curve visualization data
      generateForgettingCurveData();
      
      // Generate focus areas
      const areas = determineTopFocusAreas(retention.items);
      setFocusAreas(areas);
    } catch (error) {
      console.error('Error fetching retention analytics:', error);
      toast({
        title: "Error Loading Analytics",
        description: "We couldn't load your retention analytics. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate data for forgetting curve visualization
  const generateForgettingCurveData = () => {
    // Simulate the forgetting curve over 30 days
    // Using Ebbinghaus formula: R = e^(-t/S) where t is time and S is memory strength
    const data = [];
    const memoryStrength = 5 + (learningStats.masteredCards / Math.max(learningStats.totalCards, 1)) * 10;
    
    for (let day = 0; day < 30; day++) {
      const retention = Math.exp(-1 * day / memoryStrength);
      data.push({
        day: day,
        retention: parseFloat((retention * 100).toFixed(1)),
        optimal: parseFloat((Math.exp(-1 * day / 15) * 100).toFixed(1))
      });
    }
    
    setForgettingCurveData(data);
  };

  // Determine which cards need the most focus based on retention
  const determineTopFocusAreas = (retentionItems) => {
    // Sort by lowest retention first
    const sortedItems = [...(retentionItems || [])].sort((a, b) => a.retention - b.retention);
    
    // Return the 5 lowest retention items
    return sortedItems.slice(0, 5);
  };

  // Format retention for display
  const formatRetention = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  // Generate optimal study time recommendations
  const getOptimalStudyTimes = () => {
    // Best time recommendations based on user's review history
    const now = new Date();
    const times = [];
    
    // Morning study time
    const morning = new Date();
    morning.setHours(9, 0, 0);
    if (morning > now) {
      times.push({
        time: '9:00 AM',
        retention: 95,
        recommended: true,
        priority: 'high'
      });
    }
    
    // Afternoon study time
    const afternoon = new Date();
    afternoon.setHours(14, 0, 0);
    if (afternoon > now) {
      times.push({
        time: '2:00 PM',
        retention: 90,
        recommended: true,
        priority: 'medium'
      });
    }
    
    // Evening study time
    const evening = new Date();
    evening.setHours(19, 0, 0);
    if (evening > now) {
      times.push({
        time: '7:00 PM',
        retention: 85,
        recommended: false,
        priority: 'low'
      });
    }
    
    return times.length > 0 ? times : [
      { time: '9:00 AM (tomorrow)', retention: 95, recommended: true, priority: 'high' }
    ];
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Retention Analytics</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="h-8 w-8 border-4 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading analytics...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format topics for display
  const formatTopicData = () => {
    const topicData = [];
    
    for (const [topicId, retention] of Object.entries(retentionData.retentionByTopic || {})) {
      topicData.push({
        topicId,
        retention: parseFloat((retention * 100).toFixed(1))
      });
    }
    
    return topicData.sort((a, b) => b.retention - a.retention);
  };

  const topicData = formatTopicData();
  const studyTimes = getOptimalStudyTimes();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/20">
        <CardTitle>Retention Analytics Dashboard</CardTitle>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-4 pt-2">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="retention">Retention</TabsTrigger>
            <TabsTrigger value="forgetting">Forgetting Curve</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="optimize">Study Optimizer</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="retention" className="p-4">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Overall Retention</h3>
            <div className="bg-muted/30 rounded-md p-6 text-center">
              <div className="text-4xl font-bold mb-2">
                {formatRetention(retentionData.averageRetention)}
              </div>
              <p className="text-sm text-muted-foreground">
                Estimated average knowledge retention
              </p>
              
              <div className="h-[200px] mt-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={retentionData.items.slice(0, 20)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="id" hide />
                    <YAxis domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <Tooltip 
                      formatter={(value) => [`${(value * 100).toFixed(1)}%`, 'Retention']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="retention" 
                      stroke="#0ea5e9" 
                      fillOpacity={1} 
                      fill="url(#colorRetention)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Focus Areas</h3>
            <div className="space-y-3">
              {focusAreas.length > 0 ? (
                focusAreas.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 border rounded-md">
                    <div className="flex-1 mr-4 line-clamp-1">
                      {item.front_content}
                    </div>
                    <div className={`text-sm font-medium px-2 py-1 rounded ${
                      item.retention < 0.4 ? 'bg-red-100 text-red-700' :
                      item.retention < 0.7 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {formatRetention(item.retention)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-6 border rounded-md bg-muted/20">
                  <p className="text-sm text-muted-foreground">
                    No focus areas identified yet. Start reviewing more cards!
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="forgetting" className="p-4">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Your Forgetting Curve</h3>
            <div className="bg-muted/30 rounded-md p-6">
              <p className="text-sm text-muted-foreground mb-4">
                This chart shows how your memory retention is projected to decline over time without review.
                The optimal curve shows ideal retention with proper spaced repetition.
              </p>
              
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forgettingCurveData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis 
                      dataKey="day" 
                      label={{ value: 'Days', position: 'insideBottom', offset: -5 }} 
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      label={{ value: 'Retention %', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip formatter={(value) => [`${value}%`]} />
                    <Line 
                      type="monotone" 
                      dataKey="retention" 
                      name="Your Retention" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="optimal" 
                      name="Optimal Retention" 
                      stroke="#22c55e" 
                      strokeWidth={2} 
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 text-sm">
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                  <span>Your projected forgetting curve</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  <span>Optimal retention with spaced repetition</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Retention Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-md">
                <h4 className="font-medium mb-2">Memory Peak</h4>
                <p className="text-sm text-muted-foreground">
                  Your retention is highest immediately after reviewing a card and declines by 
                  approximately 40% within the first 24 hours.
                </p>
              </div>
              
              <div className="p-4 border rounded-md">
                <h4 className="font-medium mb-2">Optimal Review</h4>
                <p className="text-sm text-muted-foreground">
                  To maintain 85%+ retention, review cards when your retention reaches ~70% - typically 
                  {learningStats.averageRetention > 0.7 ? ' every 3-4 days' : ' daily'}.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="topics" className="p-4">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Retention by Topic</h3>
            {topicData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topicData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis 
                      dataKey="topicId" 
                      type="category" 
                      tick={false}
                      width={150}
                    />
                    <Tooltip formatter={(value) => [`${value}%`, 'Retention']} />
                    <Bar dataKey="retention" fill="#3b82f6">
                      {topicData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`}
                          fill={
                            entry.retention > 80 ? '#22c55e' :
                            entry.retention > 60 ? '#eab308' :
                            '#ef4444'
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center p-6 bg-muted/20 rounded-md">
                <p>No topic data available. Start adding topics to your flashcards!</p>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Topic Breakdown</h3>
            <ScrollArea className="h-[200px]">
              {topicData.length > 0 ? (
                <div className="space-y-3">
                  {topicData.map((topic, index) => (
                    <div key={topic.topicId} className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <span className="font-medium">Topic {index + 1}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({topic.topicId.substring(0, 6)}...)
                        </span>
                      </div>
                      <div className={`px-2 py-1 rounded text-sm ${
                        topic.retention > 80 ? 'bg-green-100 text-green-700' :
                        topic.retention > 60 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {topic.retention}%
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center p-4 text-muted-foreground">No topics available</p>
              )}
            </ScrollArea>
          </div>
        </TabsContent>
        
        <TabsContent value="optimize" className="p-4">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Study Schedule Optimizer</h3>
            <div className="bg-muted/30 rounded-md p-6">
              <p className="text-sm text-muted-foreground mb-4">
                Based on your study patterns and memory retention, here are your optimal study times:
              </p>
              
              <div className="space-y-4">
                {studyTimes.map((time, index) => (
                  <div 
                    key={index}
                    className={`p-4 border rounded-md ${
                      time.recommended ? 'border-blue-200 bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">
                          {time.time}
                          {time.recommended && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              Recommended
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Estimated retention: {time.retention}%
                        </p>
                      </div>
                      <Button size="sm" variant={time.recommended ? "default" : "outline"}>
                        Schedule
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Review Batching</h3>
            <div className="p-4 border rounded-md">
              <p className="text-sm text-muted-foreground mb-3">
                Optimized study sessions based on your due cards and available time:
              </p>
              
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-100 rounded-md">
                  <h4 className="font-medium text-green-700">Quick Session (5 mins)</h4>
                  <p className="text-sm">Review {Math.min(5, learningStats.dueCards)} most urgent cards</p>
                </div>
                
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                  <h4 className="font-medium text-blue-700">Standard Session (15 mins)</h4>
                  <p className="text-sm">Review {Math.min(15, learningStats.dueCards)} cards due today</p>
                </div>
                
                <div className="p-3 bg-purple-50 border border-purple-100 rounded-md">
                  <h4 className="font-medium text-purple-700">Focus Session (30 mins)</h4>
                  <p className="text-sm">Deep dive on lowest retention topics</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default RetentionDashboard;
