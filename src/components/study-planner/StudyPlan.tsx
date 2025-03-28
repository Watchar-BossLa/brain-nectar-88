
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2, Calendar as CalendarIcon, Target, Brain, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { StudyPlanOptions, StudyPlanResponse } from './types';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from "@/components/ui/checkbox";

// Define topics
const topics = [
  { value: "accounting-basics", label: "Accounting Basics" },
  { value: "financial-statements", label: "Financial Statements" },
  { value: "tax-accounting", label: "Tax Accounting" },
  { value: "managerial-accounting", label: "Managerial Accounting" },
  { value: "auditing", label: "Auditing" },
  { value: "accounting-standards", label: "Accounting Standards" }
];

interface StudyPlanProps {
  onPlanCreated: (planOptions: StudyPlanOptions) => Promise<StudyPlanResponse>;
  isLoading: boolean;
}

const StudyPlan: React.FC<StudyPlanProps> = ({ onPlanCreated, isLoading }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [examDate, setExamDate] = useState<Date | undefined>(undefined);
  const [studyHoursPerWeek, setStudyHoursPerWeek] = useState<number>(10);
  const [dailyStudyMinutes, setDailyStudyMinutes] = useState<number>(Math.round((10 * 60) / 7)); // Default based on weekly hours
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [useCustomMinutes, setUseCustomMinutes] = useState<boolean>(false);

  // Update daily minutes when weekly hours change
  React.useEffect(() => {
    if (!useCustomMinutes) {
      setDailyStudyMinutes(Math.round((studyHoursPerWeek * 60) / 7));
    }
  }, [studyHoursPerWeek, useCustomMinutes]);

  const handleTopicToggle = (topicValue: string) => {
    setSelectedTopics(prev => 
      prev.includes(topicValue)
        ? prev.filter(t => t !== topicValue)
        : [...prev, topicValue]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate) {
      return;
    }

    const planOptions: StudyPlanOptions = {
      startDate,
      examDate,
      studyHoursPerWeek,
      priorityTopics: selectedTopics,
      difficulty,
      dailyStudyMinutes: useCustomMinutes ? dailyStudyMinutes : undefined
    };

    await onPlanCreated(planOptions);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Create Study Plan
        </CardTitle>
        <CardDescription>
          Generate a personalized study schedule based on your preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="exam-date">
                Exam Date <span className="text-muted-foreground text-xs">(Optional)</span>
              </Label>
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
                    <Trophy className="mr-2 h-4 w-4" />
                    {examDate ? format(examDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={examDate}
                    onSelect={setExamDate}
                    initialFocus
                    disabled={(date) => 
                      date < (startDate || new Date())
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="study-hours">Hours to Study per Week</Label>
            <Input
              id="study-hours"
              type="number"
              min={1}
              max={50}
              value={studyHoursPerWeek}
              onChange={(e) => setStudyHoursPerWeek(parseInt(e.target.value) || 10)}
            />
          </div>

          <div className="flex items-start space-x-2 pt-2">
            <Checkbox 
              id="custom-minutes"
              checked={useCustomMinutes}
              onCheckedChange={(checked) => setUseCustomMinutes(!!checked)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="custom-minutes"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Set custom daily study minutes
              </Label>
              <p className="text-sm text-muted-foreground">
                Instead of evenly distributing weekly hours
              </p>
            </div>
          </div>
          
          {useCustomMinutes && (
            <div className="space-y-2">
              <Label htmlFor="daily-minutes">Minutes to Study per Day</Label>
              <Input
                id="daily-minutes"
                type="number"
                min={10}
                max={480}
                value={dailyStudyMinutes}
                onChange={(e) => setDailyStudyMinutes(parseInt(e.target.value) || 30)}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="difficulty">Study Plan Difficulty</Label>
            <Select 
              value={difficulty} 
              onValueChange={(value) => setDifficulty(value as 'easy' | 'medium' | 'hard')}
            >
              <SelectTrigger id="difficulty">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">
                  <div className="flex items-center">
                    <span>Easy</span>
                    <Badge variant="outline" className="ml-2">
                      Beginner-friendly
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center">
                    <span>Medium</span>
                    <Badge variant="outline" className="ml-2">
                      Balanced
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value="hard">
                  <div className="flex items-center">
                    <span>Hard</span>
                    <Badge variant="outline" className="ml-2">
                      Intensive
                    </Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>
              Priority Topics <span className="text-muted-foreground text-xs">(Select all that apply)</span>
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-1">
              {topics.map((topic) => (
                <div key={topic.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={topic.value}
                    checked={selectedTopics.includes(topic.value)}
                    onCheckedChange={() => handleTopicToggle(topic.value)}
                  />
                  <Label 
                    htmlFor={topic.value}
                    className="text-sm cursor-pointer"
                  >
                    {topic.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          className="w-full"
          disabled={isLoading || !startDate}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Plan...
            </>
          ) : (
            <>
              <Brain className="mr-2 h-4 w-4" />
              Generate Study Plan
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StudyPlan;
