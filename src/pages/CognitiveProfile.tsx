
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Lightbulb, BarChart2, Network } from 'lucide-react';
import CognitiveProfileCard from '@/components/cognitive-profile/CognitiveProfileCard';
import LearningStyleChart from '@/components/cognitive-profile/LearningStyleChart';
import ContentFormatPreference from '@/components/cognitive-profile/ContentFormatPreference';
import KnowledgeGraph from '@/components/cognitive-profile/KnowledgeGraph';
import StudyPatternAnalysis from '@/components/cognitive-profile/StudyPatternAnalysis';
import RecommendationCard from '@/components/cognitive-profile/RecommendationCard';

const CognitiveProfile = () => {
  // Mock data for the components
  const learningStyleData = [
    { name: 'Visual', value: 40, color: '#8b5cf6' },
    { name: 'Auditory', value: 20, color: '#ec4899' },
    { name: 'Reading', value: 25, color: '#3b82f6' },
    { name: 'Kinesthetic', value: 15, color: '#22c55e' },
  ];
  
  const contentFormatData = [
    { name: 'Video', value: 85, color: '#f97316' },
    { name: 'Interactive', value: 75, color: '#8b5cf6' },
    { name: 'Text', value: 60, color: '#3b82f6' },
    { name: 'Audio', value: 45, color: '#22c55e' },
  ];
  
  const knowledgeNodes = [
    { id: '1', label: 'Double-Entry Bookkeeping', category: 'Accounting Basics', strength: 80 },
    { id: '2', label: 'Balance Sheet', category: 'Financial Statements', strength: 75 },
    { id: '3', label: 'Income Statement', category: 'Financial Statements', strength: 65 },
    { id: '4', label: 'Cash Flow', category: 'Financial Statements', strength: 40 },
    { id: '5', label: 'Assets', category: 'Accounting Basics', strength: 90 },
    { id: '6', label: 'Liabilities', category: 'Accounting Basics', strength: 85 },
    { id: '7', label: 'IFRS', category: 'Standards', strength: 30 },
    { id: '8', label: 'GAAP', category: 'Standards', strength: 25 },
  ];
  
  const categoryColors = {
    'Accounting Basics': '#3b82f6',
    'Financial Statements': '#8b5cf6',
    'Standards': '#f97316',
  };
  
  const studyPatternData = [
    { time: '6 AM', effectiveness: 40, retention: 35 },
    { time: '9 AM', effectiveness: 65, retention: 60 },
    { time: '12 PM', effectiveness: 55, retention: 50 },
    { time: '3 PM', effectiveness: 45, retention: 40 },
    { time: '6 PM', effectiveness: 70, retention: 65 },
    { time: '9 PM', effectiveness: 80, retention: 75 },
    { time: '12 AM', effectiveness: 50, retention: 45 },
  ];
  
  const recommendations = [
    {
      title: 'Focus on Visual Learning Materials',
      description: 'Based on your learning style profile, emphasize visual learning materials like diagrams, charts, and videos for better retention.',
    },
    {
      title: 'Schedule Study Sessions in the Evening',
      description: 'Your study pattern shows highest effectiveness between 6-9 PM. Try to schedule important study sessions during this optimal window.',
    },
    {
      title: 'Strengthen Understanding of Standards',
      description: 'Your knowledge graph indicates weaker connections in accounting standards. Consider allocating more time to IFRS and GAAP concepts.',
    },
  ];

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Cognitive Profile</h1>
        <p className="text-muted-foreground mb-6">
          Your personalized cognitive learning pattern analysis and recommendations
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <CognitiveProfileCard 
            title="Learning Efficiency" 
            value="85%"
            description="Overall effectiveness of your learning approach"
            icon="brain"
            progress={85}
          />
          <CognitiveProfileCard 
            title="Knowledge Mastery" 
            value="64%"
            description="Average mastery across all concepts"
            icon="book"
            progress={64}
          />
          <CognitiveProfileCard 
            title="Optimal Study Duration" 
            value="45 min"
            description="Your ideal focus session length"
            icon="clock"
          />
          <CognitiveProfileCard 
            title="Memory Retention" 
            value="72%"
            description="Average long-term knowledge retention"
            icon="chart"
            progress={72}
          />
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span>Learning Profile</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              <span>Recommendations</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              <span>Knowledge Map</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LearningStyleChart data={learningStyleData} />
              <ContentFormatPreference data={contentFormatData} />
              <StudyPatternAnalysis data={studyPatternData} />
              <KnowledgeGraph nodes={knowledgeNodes} categories={categoryColors} />
            </div>
          </TabsContent>
          
          <TabsContent value="recommendations">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((recommendation, index) => (
                <RecommendationCard 
                  key={index}
                  title={recommendation.title}
                  description={recommendation.description}
                  actionText="Apply to My Learning Path"
                  onAction={() => console.log('Applied recommendation:', recommendation.title)}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StudyPatternAnalysis data={studyPatternData} />
              <ContentFormatPreference data={contentFormatData} />
            </div>
          </TabsContent>
          
          <TabsContent value="knowledge">
            <KnowledgeGraph 
              nodes={knowledgeNodes} 
              categories={categoryColors} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default CognitiveProfile;
