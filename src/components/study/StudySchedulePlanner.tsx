
import React, { useState } from 'react';
import { useAgentOrchestration } from '@/hooks/useAgentOrchestration';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

/**
 * Component for creating and managing customized study schedules
 */
const StudySchedulePlanner: React.FC = () => {
  const { optimizeStudySchedule, isPending, results } = useAgentOrchestration();
  const [dailyHours, setDailyHours] = useState(2);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [goalDate, setGoalDate] = useState<Date | undefined>(undefined);
  const [priorityTopics, setPriorityTopics] = useState('');
  
  const handleGenerateSchedule = async () => {
    const options = {
      dailyAvailableTime: dailyHours,
      priorityTopics: priorityTopics ? priorityTopics.split(',').map(topic => topic.trim()) : undefined,
      startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
      endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
      goalDate: goalDate ? format(goalDate, 'yyyy-MM-dd') : undefined
    };
    
    await optimizeStudySchedule(options);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Study Schedule Planner</CardTitle>
        <CardDescription>
          Create a personalized study schedule based on your availability and goals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="daily-hours">Daily Study Hours</Label>
          <Input
            id="daily-hours"
            type="number"
            min={0.5}
            max={12}
            step={0.5}
            value={dailyHours}
            onChange={(e) => setDailyHours(parseFloat(e.target.value))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="priority-topics">Priority Topics (comma separated)</Label>
          <Input
            id="priority-topics"
            placeholder="Financial Statements, Accounting Equation"
            value={priorityTopics}
            onChange={(e) => setPriorityTopics(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
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
            <Label>End Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  {endDate ? format(endDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={(date) => 
                    (startDate ? date < startDate : false)
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>Goal Completion Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !goalDate && "text-muted-foreground"
                  )}
                >
                  {goalDate ? format(goalDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={goalDate}
                  onSelect={setGoalDate}
                  initialFocus
                  disabled={(date) => 
                    (startDate ? date < startDate : false)
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGenerateSchedule} 
          disabled={isPending.schedule || !startDate}
          className="w-full"
        >
          {isPending.schedule ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Schedule...
            </>
          ) : (
            'Generate Optimized Schedule'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StudySchedulePlanner;
