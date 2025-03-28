
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addDays, isAfter, isBefore, differenceInDays } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { AlertCircle, Calendar as CalendarIcon, Check, CheckCircle, Clock, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface StudyPlanProps {
  qualificationId?: string;
  examDate?: Date;
  onPlanCreated?: (plan: any) => void;
}

const StudyPlan: React.FC<StudyPlanProps> = ({ 
  qualificationId, 
  examDate: initialExamDate,
  onPlanCreated 
}) => {
  const { toast } = useToast();
  const [examDate, setExamDate] = useState<Date | undefined>(initialExamDate);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [studyHoursPerWeek, setStudyHoursPerWeek] = useState(10);
  const [priorityTopics, setPriorityTopics] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [planCreated, setPlanCreated] = useState(false);
  
  // Sample topics for the demo
  const availableTopics = [
    "Accounting Fundamentals",
    "Financial Statements",
    "Balance Sheets",
    "Income Statements",
    "Cash Flow Statements",
    "Budgeting",
    "Tax Accounting",
    "GAAP Principles",
    "IFRS Standards",
    "Auditing"
  ];
  
  const toggleTopic = (topic: string) => {
    if (priorityTopics.includes(topic)) {
      setPriorityTopics(priorityTopics.filter(t => t !== topic));
    } else {
      setPriorityTopics([...priorityTopics, topic]);
    }
  };
  
  const calculateAvailableDays = () => {
    if (!startDate || !examDate) return 0;
    if (isBefore(examDate, startDate)) return 0;
    
    return differenceInDays(examDate, startDate);
  };
  
  const calculateDailyStudyTime = () => {
    const availableDays = calculateAvailableDays();
    if (availableDays <= 0) return 0;
    
    const totalHours = (studyHoursPerWeek / 7) * availableDays;
    return Math.round((totalHours / availableDays) * 60); // minutes per day
  };
  
  const handleCreatePlan = () => {
    if (!examDate || !startDate) {
      toast({
        title: "Missing Information",
        description: "Please set both start date and exam date",
        variant: "destructive"
      });
      return;
    }
    
    if (isBefore(examDate, startDate)) {
      toast({
        title: "Invalid Dates",
        description: "Exam date cannot be before start date",
        variant: "destructive"
      });
      return;
    }
    
    setIsCreatingPlan(true);
    
    // Simulate creating a study plan
    setTimeout(() => {
      setIsCreatingPlan(false);
      setPlanCreated(true);
      
      toast({
        title: "Study Plan Created",
        description: "Your personalized study plan is ready",
      });
      
      if (onPlanCreated) {
        onPlanCreated({
          startDate,
          examDate,
          studyHoursPerWeek,
          priorityTopics,
          difficulty,
          dailyStudyMinutes: calculateDailyStudyTime()
        });
      }
    }, 1500);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Study Plan</CardTitle>
        <CardDescription>
          Generate a personalized study plan based on your schedule and exam date
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {planCreated ? (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <AlertTitle>Study Plan Created!</AlertTitle>
              <AlertDescription>
                Your personalized study plan has been generated based on your preferences.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <p className="text-sm font-medium mb-2">Study Period</p>
                <p className="text-sm">
                  {format(startDate!, "MMM d, yyyy")} to {format(examDate!, "MMM d, yyyy")}
                </p>
                <p className="text-sm mt-1">({calculateAvailableDays()} days available)</p>
              </div>
              
              <div className="p-4 border rounded-lg bg-muted/50">
                <p className="text-sm font-medium mb-2">Daily Study Target</p>
                <p className="text-sm flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  {calculateDailyStudyTime()} minutes per day
                </p>
                <p className="text-sm mt-1">{studyHoursPerWeek} hours per week</p>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg bg-muted/50">
              <p className="text-sm font-medium mb-2">Priority Topics</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {priorityTopics.length > 0 ? (
                  priorityTopics.map(topic => (
                    <Badge key={topic} variant="secondary">{topic}</Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No priority topics selected</p>
                )}
              </div>
            </div>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Next Steps</AlertTitle>
              <AlertDescription>
                Go to the Study Planner page to view your complete schedule and track your progress.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="start-date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="exam-date">Exam Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="exam-date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !examDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {examDate ? format(examDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={examDate}
                      onSelect={setExamDate}
                      initialFocus
                      disabled={(date) => isBefore(date, new Date())}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {startDate && examDate && isAfter(examDate, startDate) && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  You have {calculateAvailableDays()} days until your exam. We recommend at least {Math.ceil(calculateAvailableDays() / 4)} hours of study per week.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="study-hours">Study Hours Per Week</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="study-hours"
                  type="number"
                  value={studyHoursPerWeek}
                  onChange={(e) => setStudyHoursPerWeek(parseInt(e.target.value) || 0)}
                  min={1}
                  max={40}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">
                  {studyHoursPerWeek > 0 && startDate && examDate && isAfter(examDate, startDate) && (
                    <>= {calculateDailyStudyTime()} minutes per day</>
                  )}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="difficulty">Study Plan Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy - More breaks, shorter sessions</SelectItem>
                  <SelectItem value="medium">Medium - Balanced approach</SelectItem>
                  <SelectItem value="hard">Hard - Intensive study schedule</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Priority Topics</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                {availableTopics.map(topic => (
                  <div key={topic} className="flex items-center space-x-2">
                    <Button
                      variant={priorityTopics.includes(topic) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleTopic(topic)}
                      className="w-full justify-start text-left"
                    >
                      {priorityTopics.includes(topic) && (
                        <Check className="mr-2 h-4 w-4" />
                      )}
                      {topic}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {planCreated ? (
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setPlanCreated(false)}
            >
              Modify Plan
            </Button>
            <Button className="flex-1">
              View Full Schedule
            </Button>
          </div>
        ) : (
          <Button 
            onClick={handleCreatePlan} 
            disabled={!startDate || !examDate || isBefore(examDate, startDate) || isCreatingPlan}
            className="w-full"
          >
            {isCreatingPlan ? "Creating Plan..." : "Create Study Plan"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default StudyPlan;
