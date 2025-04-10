import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  GraduationCap, 
  Clock, 
  BarChart2, 
  Star, 
  Calendar, 
  CheckCircle2,
  TrendingUp,
  FileText,
  Video,
  Lightbulb,
  MessageSquare
} from 'lucide-react';

/**
 * SubjectDashboard component that serves as a central hub for a subject
 * @returns {React.ReactElement} SubjectDashboard component
 */
const SubjectDashboard = ({ subject, description, progress, topics }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sample data for recent activity
  const recentActivity = [
    { id: 1, type: 'quiz', title: 'Completed Quiz: Fundamentals', date: '2 days ago', score: 85 },
    { id: 2, type: 'flashcards', title: 'Reviewed 25 Flashcards', date: '3 days ago', score: null },
    { id: 3, type: 'lesson', title: 'Completed Lesson: Advanced Concepts', date: '5 days ago', score: null },
    { id: 4, type: 'practice', title: 'Solved 10 Practice Problems', date: '1 week ago', score: 90 }
  ];
  
  // Sample data for recommended resources
  const recommendedResources = [
    { id: 1, type: 'video', title: 'Introduction to Key Concepts', duration: '15 min', difficulty: 'Beginner' },
    { id: 2, type: 'article', title: 'Advanced Techniques Explained', duration: '10 min read', difficulty: 'Intermediate' },
    { id: 3, type: 'practice', title: 'Problem Set: Challenging Problems', duration: '20 problems', difficulty: 'Advanced' },
    { id: 4, type: 'interactive', title: 'Interactive Tutorial: Visual Learning', duration: '25 min', difficulty: 'Intermediate' }
  ];
  
  // Get icon for activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'quiz':
        return <GraduationCap className="h-4 w-4" />;
      case 'flashcards':
        return <BookOpen className="h-4 w-4" />;
      case 'lesson':
        return <FileText className="h-4 w-4" />;
      case 'practice':
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  // Get icon for resource type
  const getResourceIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'article':
        return <FileText className="h-4 w-4" />;
      case 'practice':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'interactive':
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl">{subject} Dashboard</CardTitle>
            <CardDescription className="mt-1">
              {description || `Track your progress and access resources for ${subject}`}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
              {topics?.length || 0} Topics
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Last studied 2 days ago
            </Badge>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm font-medium">{progress || 0}%</span>
          </div>
          <Progress value={progress || 0} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Recent Activity */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map(activity => (
                      <div key={activity.id} className="flex items-start">
                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm">{activity.title}</h4>
                            {activity.score && (
                              <Badge variant="outline" className="ml-2">
                                {activity.score}%
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="ghost" size="sm" className="w-full mt-3">
                    View All Activity
                  </Button>
                </CardContent>
              </Card>
              
              {/* Recommended Resources */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Recommended For You</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recommendedResources.map(resource => (
                      <div key={resource.id} className="flex items-start">
                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm">{resource.title}</h4>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {resource.difficulty}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{resource.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="ghost" size="sm" className="w-full mt-3">
                    View All Resources
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <BookOpen className="h-5 w-5" />
                <span className="text-xs">Study Materials</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <GraduationCap className="h-5 w-5" />
                <span className="text-xs">Take a Quiz</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <MessageSquare className="h-5 w-5" />
                <span className="text-xs">Ask Questions</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Calendar className="h-5 w-5" />
                <span className="text-xs">Study Schedule</span>
              </Button>
            </div>
          </TabsContent>
          
          {/* Topics Tab */}
          <TabsContent value="topics" className="mt-4">
            <div className="space-y-4">
              {topics && topics.length > 0 ? (
                topics.map((topic, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{topic.title}</h3>
                          <p className="text-sm text-muted-foreground">{topic.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={topic.status === 'completed' ? 'default' : 'outline'}>
                            {topic.status === 'completed' ? 'Completed' : 'In Progress'}
                          </Badge>
                          <Button size="sm">Study</Button>
                        </div>
                      </div>
                      
                      {topic.subtopics && (
                        <div className="mt-3 pl-4 border-l">
                          <h4 className="text-sm font-medium mb-2">Subtopics</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {topic.subtopics.map((subtopic, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                {subtopic.completed ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                  <div className="h-4 w-4 rounded-full border border-muted-foreground" />
                                )}
                                <span>{subtopic.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No topics available for this subject yet.</p>
                  <Button variant="outline" className="mt-4">
                    Explore Recommended Topics
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Resources Tab */}
          <TabsContent value="resources" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Learning Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        <span className="text-sm">Lecture Notes</span>
                      </div>
                      <Button size="sm" variant="ghost">View</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Video className="h-4 w-4 mr-2" />
                        <span className="text-sm">Video Tutorials</span>
                      </div>
                      <Button size="sm" variant="ghost">View</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" />
                        <span className="text-sm">Textbook References</span>
                      </div>
                      <Button size="sm" variant="ghost">View</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Lightbulb className="h-4 w-4 mr-2" />
                        <span className="text-sm">Interactive Simulations</span>
                      </div>
                      <Button size="sm" variant="ghost">View</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Practice & Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        <span className="text-sm">Practice Problems</span>
                      </div>
                      <Button size="sm" variant="ghost">Start</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        <span className="text-sm">Quizzes</span>
                      </div>
                      <Button size="sm" variant="ghost">Start</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm">Timed Tests</span>
                      </div>
                      <Button size="sm" variant="ghost">Start</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        <span className="text-sm">Discussion Forums</span>
                      </div>
                      <Button size="sm" variant="ghost">Join</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Progress Tab */}
          <TabsContent value="progress" className="mt-4">
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-primary/10 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold">{progress || 0}%</div>
                      <div className="text-sm text-muted-foreground">Overall Completion</div>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold">85%</div>
                      <div className="text-sm text-muted-foreground">Average Quiz Score</div>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold">12</div>
                      <div className="text-sm text-muted-foreground">Study Hours</div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Skill Proficiency</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs">Fundamentals</span>
                          <span className="text-xs">90%</span>
                        </div>
                        <Progress value={90} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs">Problem Solving</span>
                          <span className="text-xs">75%</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs">Advanced Concepts</span>
                          <span className="text-xs">60%</span>
                        </div>
                        <Progress value={60} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs">Application</span>
                          <span className="text-xs">80%</span>
                        </div>
                        <Progress value={80} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Learning Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Strong Performance in Fundamentals</h4>
                        <p className="text-xs text-muted-foreground">
                          You've mastered the basic concepts. Consider moving to more advanced topics.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-amber-100 p-2 rounded-full mr-3">
                        <Lightbulb className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Improvement Area: Advanced Concepts</h4>
                        <p className="text-xs text-muted-foreground">
                          Spend more time on advanced topics to improve your understanding.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Consistent Study Pattern</h4>
                        <p className="text-xs text-muted-foreground">
                          You've been studying regularly. Keep up the good work!
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">
                    View Detailed Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SubjectDashboard;
