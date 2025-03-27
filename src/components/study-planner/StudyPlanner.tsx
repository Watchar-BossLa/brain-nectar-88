
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CalendarPlus, Clock, Check, ListTodo, Calendar as CalendarIcon, BarChart } from 'lucide-react';
import { addDays, format, isToday, isAfter, isBefore, parseISO } from 'date-fns';
import StudyPlan from './StudyPlan';
import { useToast } from "@/components/ui/use-toast";

type StudySession = {
  id: string;
  title: string;
  date: Date;
  duration: number;
  topic: string;
  completed: boolean;
};

const StudyPlanner = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("schedule");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [sessionTitle, setSessionTitle] = useState("");
  const [duration, setDuration] = useState("30");
  const [topic, setTopic] = useState("accounting-basics");
  const [examDate, setExamDate] = useState<Date | undefined>(addDays(new Date(), 30));
  const [studyPlan, setStudyPlan] = useState<any>(null);
  const [showCompleted, setShowCompleted] = useState(true);
  const [studySessions, setStudySessions] = useState<StudySession[]>([
    {
      id: "1",
      title: "Accounting Fundamentals",
      date: new Date(),
      duration: 30,
      topic: "accounting-basics",
      completed: false
    },
    {
      id: "2",
      title: "Financial Statement Review",
      date: addDays(new Date(), 1),
      duration: 45,
      topic: "financial-statements",
      completed: false
    },
    {
      id: "3",
      title: "Balance Sheet Analysis",
      date: addDays(new Date(), 2),
      duration: 60,
      topic: "financial-statements",
      completed: false
    },
    {
      id: "4",
      title: "GAAP Principles Overview",
      date: addDays(new Date(), 3),
      duration: 90,
      topic: "accounting-standards",
      completed: false
    }
  ]);
  
  // Calculate total study time and completion stats
  const totalSessionsCount = studySessions.length;
  const completedSessionsCount = studySessions.filter(s => s.completed).length;
  const completionPercentage = totalSessionsCount > 0 
    ? Math.round((completedSessionsCount / totalSessionsCount) * 100) 
    : 0;
  const totalMinutes = studySessions.reduce((total, session) => total + session.duration, 0);
  const completedMinutes = studySessions
    .filter(s => s.completed)
    .reduce((total, session) => total + session.duration, 0);

  const addStudySession = () => {
    if (!date || !sessionTitle) return;
    
    const newSession: StudySession = {
      id: Date.now().toString(),
      title: sessionTitle,
      date: date,
      duration: parseInt(duration),
      topic,
      completed: false
    };
    
    setStudySessions([...studySessions, newSession]);
    setSessionTitle("");
    
    toast({
      title: "Study Session Added",
      description: `${sessionTitle} has been added to your schedule`,
    });
  };

  const toggleCompleted = (id: string) => {
    setStudySessions(
      studySessions.map(session => 
        session.id === id 
          ? { ...session, completed: !session.completed } 
          : session
      )
    );
    
    // Get the session that was toggled
    const toggledSession = studySessions.find(session => session.id === id);
    if (toggledSession) {
      toast({
        title: toggledSession.completed ? "Session Marked Incomplete" : "Session Completed",
        description: `${toggledSession.title} has been marked as ${toggledSession.completed ? 'incomplete' : 'complete'}`,
      });
    }
  };
  
  const deleteSession = (id: string) => {
    const sessionToDelete = studySessions.find(session => session.id === id);
    setStudySessions(studySessions.filter(session => session.id !== id));
    
    if (sessionToDelete) {
      toast({
        title: "Session Deleted",
        description: `${sessionToDelete.title} has been removed from your schedule`,
      });
    }
  };

  const handleCreatePlan = (plan: any) => {
    setStudyPlan(plan);
    setActiveTab("schedule");
    
    // In a real application, we would generate sessions based on the plan
    // For now, we'll just add a sample session
    const newSession: StudySession = {
      id: Date.now().toString(),
      title: `${plan.priorityTopics[0] || "Study"} Session`,
      date: plan.startDate,
      duration: plan.dailyStudyMinutes,
      topic: "generated-plan",
      completed: false
    };
    
    setStudySessions([...studySessions, newSession]);
  };

  const topics = [
    { value: "accounting-basics", label: "Accounting Basics" },
    { value: "financial-statements", label: "Financial Statements" },
    { value: "tax-accounting", label: "Tax Accounting" },
    { value: "managerial-accounting", label: "Managerial Accounting" },
    { value: "auditing", label: "Auditing" },
    { value: "accounting-standards", label: "Accounting Standards" },
    { value: "generated-plan", label: "From Study Plan" }
  ];
  
  // Filter sessions based on the showCompleted state
  const filteredSessions = showCompleted 
    ? studySessions 
    : studySessions.filter(session => !session.completed);
    
  // Sort sessions by date
  const sortedSessions = [...filteredSessions].sort((a, b) => 
    a.date.getTime() - b.date.getTime()
  );
  
  // Get upcoming sessions (today and future)
  const upcomingSessions = sortedSessions.filter(
    session => isToday(session.date) || isAfter(session.date, new Date())
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="schedule">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="plan">
              <BarChart className="mr-2 h-4 w-4" />
              Create Plan
            </TabsTrigger>
          </TabsList>
          
          {activeTab === "schedule" && (
            <div className="flex items-center space-x-2">
              <Switch
                id="show-completed"
                checked={showCompleted}
                onCheckedChange={setShowCompleted}
              />
              <Label htmlFor="show-completed">Show completed</Label>
            </div>
          )}
        </div>
        
        <TabsContent value="schedule" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarPlus className="h-5 w-5" />
                  Add Study Session
                </CardTitle>
                <CardDescription>
                  Schedule a new study session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="session-title">Session Title</Label>
                  <Input 
                    id="session-title" 
                    value={sessionTitle}
                    onChange={(e) => setSessionTitle(e.target.value)}
                    placeholder="Accounting Basics Review"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="border rounded-md"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Select value={topic} onValueChange={setTopic}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map(topic => (
                        <SelectItem key={topic.value} value={topic.value}>
                          {topic.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={addStudySession}
                  disabled={!date || !sessionTitle}
                >
                  Add to Schedule
                </Button>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ListTodo className="h-5 w-5" />
                      Study Schedule
                    </CardTitle>
                    <CardDescription>
                      Your upcoming study sessions
                    </CardDescription>
                  </div>
                  
                  {studyPlan && (
                    <Badge variant="outline" className="px-3 py-1">
                      {studyPlan.dailyStudyMinutes} min/day goal
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Completed</div>
                    <div className="text-2xl font-bold">{completedSessionsCount}/{totalSessionsCount}</div>
                    <Progress className="h-2 mt-2" value={completionPercentage} />
                  </div>
                  
                  <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Study time</div>
                    <div className="text-2xl font-bold">{Math.round(completedMinutes / 60)} hrs</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      of {Math.round(totalMinutes / 60)} hrs planned
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Next session</div>
                    {upcomingSessions.length > 0 ? (
                      <>
                        <div className="font-medium truncate">{upcomingSessions[0].title}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {format(upcomingSessions[0].date, "MMM d, h:mm a")}
                        </div>
                      </>
                    ) : (
                      <div className="text-sm">No upcoming sessions</div>
                    )}
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Topic</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedSessions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No study sessions scheduled
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedSessions.map(session => {
                        const topicLabel = topics.find(t => t.value === session.topic)?.label || session.topic;
                        const isUpcoming = isToday(session.date) || isAfter(session.date, new Date());
                        
                        return (
                          <TableRow key={session.id} className={session.completed ? "bg-muted/40" : ""}>
                            <TableCell className={session.completed ? "line-through opacity-70" : ""}>
                              {session.title}
                            </TableCell>
                            <TableCell>
                              <span className={`${isUpcoming ? "font-medium" : ""}`}>
                                {format(session.date, "MMM d, yyyy")}
                              </span>
                            </TableCell>
                            <TableCell className="flex items-center">
                              <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                              {session.duration} min
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{topicLabel}</Badge>
                            </TableCell>
                            <TableCell className="flex justify-end gap-2">
                              <Button
                                variant={session.completed ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleCompleted(session.id)}
                                className={`${session.completed ? 'bg-green-500 hover:bg-green-600' : ''}`}
                              >
                                {session.completed ? (
                                  <>
                                    <Check className="mr-1 h-4 w-4" />
                                    Done
                                  </>
                                ) : (
                                  "Complete"
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteSession(session.id)}
                                className="border-red-200 hover:bg-red-50 hover:text-red-600"
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="plan">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <StudyPlan 
                examDate={examDate} 
                onPlanCreated={handleCreatePlan}
              />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Study Plan Tips</CardTitle>
                <CardDescription>Get the most from your study plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Effective Time Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Break your study sessions into 25-30 minute blocks with short breaks in between for optimal focus and retention.
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="font-medium">Spaced Repetition</h3>
                  <p className="text-sm text-muted-foreground">
                    Review material at increasing intervals to improve long-term retention. Integrate flashcards into your study routine.
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="font-medium">Practice Tests</h3>
                  <p className="text-sm text-muted-foreground">
                    Take regular practice tests to identify knowledge gaps and become familiar with the exam format.
                  </p>
                </div>
                
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <h3 className="font-medium mb-1">Did you know?</h3>
                  <p className="text-sm text-muted-foreground">
                    Studies show that students who follow a structured study plan are 65% more likely to achieve their target scores.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Study Resources
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudyPlanner;
