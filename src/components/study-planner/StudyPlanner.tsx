
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, BarChart, ListTodo } from 'lucide-react';
import StudyPlan from './StudyPlan';
import { useToast } from "@/components/ui/use-toast";

// Import our new components
import AddSessionForm from './components/AddSessionForm';
import StudySessionList from './components/StudySessionList';
import StudyStats from './components/StudyStats';
import StudyPlanTips from './components/StudyPlanTips';

// Import our custom hook
import { useStudySessions } from './hooks/useStudySessions';

const StudyPlanner = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("schedule");
  const [studyPlan, setStudyPlan] = useState<any>(null);
  
  // Use our custom hook
  const {
    filteredSessions,
    showCompleted,
    setShowCompleted,
    statistics,
    topics,
    addSession,
    toggleCompleted,
    deleteSession
  } = useStudySessions();

  const handleCreatePlan = (plan: any) => {
    setStudyPlan(plan);
    setActiveTab("schedule");
    
    // In a real application, we would generate sessions based on the plan
    // For now, we'll just add a sample session
    addSession({
      title: `${plan.priorityTopics[0] || "Study"} Session`,
      date: plan.startDate,
      duration: plan.dailyStudyMinutes,
      topic: "generated-plan",
    });
  };

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
              <AddSessionForm topics={topics} onAddSession={addSession} />
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
                <StudyStats statistics={statistics} />
                <StudySessionList 
                  sessions={filteredSessions}
                  topics={topics}
                  onToggleCompleted={toggleCompleted}
                  onDeleteSession={deleteSession}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="plan">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <StudyPlan onPlanCreated={handleCreatePlan} />
            </div>
            <StudyPlanTips />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudyPlanner;
