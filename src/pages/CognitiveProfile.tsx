
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/auth';

const CognitiveProfile = () => {
  const { user } = useAuth();
  
  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Cognitive Profile</h1>
        <p className="text-muted-foreground mb-8">
          Your personalized learning profile based on performance data and learning patterns.
        </p>
        
        <Tabs defaultValue="profile">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Learning Profile</TabsTrigger>
            <TabsTrigger value="strengths">Strengths & Areas for Growth</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Style</CardTitle>
                  <CardDescription>
                    Your preferred methods of engaging with educational content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Primary Learning Modality</h3>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="rounded-md border p-3">
                          <p className="font-medium">Visual</p>
                          <p className="text-xl font-bold mt-1">65%</p>
                        </div>
                        <div className="rounded-md border p-3">
                          <p className="font-medium">Auditory</p>
                          <p className="text-xl font-bold mt-1">20%</p>
                        </div>
                        <div className="rounded-md border p-3">
                          <p className="font-medium">Kinesthetic</p>
                          <p className="text-xl font-bold mt-1">15%</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Information Processing</h3>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="rounded-md border p-3">
                          <p className="font-medium">Sequential</p>
                          <p className="text-xl font-bold mt-1">45%</p>
                        </div>
                        <div className="rounded-md border p-3">
                          <p className="font-medium">Global</p>
                          <p className="text-xl font-bold mt-1">55%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Memory & Retention</CardTitle>
                  <CardDescription>
                    Analysis of your memory patterns and retention capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Short-term Retention</span>
                        <span>72%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full">
                        <div className="bg-primary h-full rounded-full" style={{ width: '72%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Long-term Retention</span>
                        <span>68%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full">
                        <div className="bg-primary h-full rounded-full" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Spaced Repetition Benefit</span>
                        <span>High</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full">
                        <div className="bg-primary h-full rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="strengths">
            <Card>
              <CardHeader>
                <CardTitle>Your Cognitive Strengths & Growth Areas</CardTitle>
                <CardDescription>
                  Based on your quiz performance, flashcard reviews, and study patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Key Strengths</h3>
                    <ul className="space-y-2 list-disc pl-5">
                      <li>Strong visual memory and pattern recognition</li>
                      <li>Effective at applying concepts to practical scenarios</li>
                      <li>Consistent performance in financial statement analysis</li>
                      <li>Good retention of mathematical formulas and calculations</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Areas for Growth</h3>
                    <ul className="space-y-2 list-disc pl-5">
                      <li>Tax regulation concepts and applications</li>
                      <li>Audit principles and methodology</li>
                      <li>Long-term retention of technical terminology</li>
                      <li>Abstract accounting theory concepts</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle>Personalized Learning Recommendations</CardTitle>
                <CardDescription>
                  Optimized study strategies based on your cognitive profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Content Format Recommendations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium">Prioritize</h4>
                          <ul className="text-sm list-disc pl-5 mt-2">
                            <li>Visual diagrams</li>
                            <li>Flowcharts</li>
                            <li>Infographics</li>
                            <li>Video demonstrations</li>
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium">Include</h4>
                          <ul className="text-sm list-disc pl-5 mt-2">
                            <li>Practice problems</li>
                            <li>Case studies</li>
                            <li>Interactive simulations</li>
                            <li>Quizzes with feedback</li>
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium">Limit</h4>
                          <ul className="text-sm list-disc pl-5 mt-2">
                            <li>Long text passages</li>
                            <li>Audio-only content</li>
                            <li>Abstract theoretical discussions</li>
                            <li>Very lengthy sessions</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Study Schedule Optimization</h3>
                    <p className="mb-4">Based on your performance data, here's your optimal study schedule:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium">Optimal Study Times</h4>
                          <ul className="text-sm list-disc pl-5 mt-2">
                            <li>Morning: High focus for new concepts (8-10 AM)</li>
                            <li>Afternoon: Practice problems (2-4 PM)</li>
                            <li>Evening: Review sessions (7-8 PM)</li>
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium">Session Structure</h4>
                          <ul className="text-sm list-disc pl-5 mt-2">
                            <li>Optimal session length: 25-30 minutes</li>
                            <li>Break interval: 5 minutes</li>
                            <li>Topic switching: Every 1-2 sessions</li>
                            <li>Review frequency: Every 3 days</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default CognitiveProfile;
