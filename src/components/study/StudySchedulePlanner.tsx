
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { CalendarIcon, Clock, ArrowDown } from 'lucide-react';
import { useAgentOrchestration } from '@/hooks/useAgentOrchestration';
import { useToast } from '@/components/ui/use-toast';

interface StudySchedulePlannerProps {
  topicIds?: string[];
  className?: string;
  onScheduleCreated?: (schedule: any) => void;
}

/**
 * Study Schedule Planner component with customizable schedules
 */
const StudySchedulePlanner: React.FC<StudySchedulePlannerProps> = ({
  topicIds = [],
  className = "",
  onScheduleCreated
}) => {
  const { toast } = useToast();
  const { optimizeStudySchedule, isPending } = useAgentOrchestration();
  
  const [dailyTimeMinutes, setDailyTimeMinutes] = useState(60);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // 30 days from now
  const [schedule, setSchedule] = useState<any>(null);
  const [availableDays, setAvailableDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false
  });
  
  const handleGenerateSchedule = async () => {
    if (!startDate || !endDate) {
      toast({
        title: 'Missing Dates',
        description: 'Please select both start and end dates',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // Prepare list of available days
      const availableDaysList = Object.entries(availableDays)
        .filter(([, isAvailable]) => isAvailable)
        .map(([day]) => day);
      
      const result = await optimizeStudySchedule({
        dailyAvailableTime: dailyTimeMinutes,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        availableDays: availableDaysList
      });
      
      // In a real implementation, we would wait for the agent to generate the schedule
      // For now, we'll use a placeholder
      setTimeout(() => {
        const placeholderSchedule = {
          scheduleId: 'schedule-123',
          dailyTimeMinutes,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          availableDays: availableDaysList,
          dailySessions: generatePlaceholderSessions(startDate, endDate, availableDaysList)
        };
        
        setSchedule(placeholderSchedule);
        
        if (onScheduleCreated) {
          onScheduleCreated(placeholderSchedule);
        }
        
        toast({
          title: 'Schedule Generated',
          description: 'Your customized study schedule is ready!'
        });
      }, 1500);
    } catch (error) {
      console.error('Error generating schedule:', error);
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate study schedule',
        variant: 'destructive'
      });
    }
  };
  
  // Generate placeholder schedule for demo purposes
  const generatePlaceholderSessions = (start: Date, end: Date, availableDays: string[]) => {
    const sessions = [];
    const dayMap = {
      'monday': 1,
      'tuesday': 2,
      'wednesday': 3,
      'thursday': 4,
      'friday': 5,
      'saturday': 6,
      'sunday': 0
    };
    
    const availableDayNumbers = availableDays.map(day => dayMap[day as keyof typeof dayMap]);
    
    const current = new Date(start);
    while (current <= end) {
      if (availableDayNumbers.includes(current.getDay())) {
        sessions.push({
          date: new Date(current).toISOString(),
          duration: dailyTimeMinutes,
          topics: [
            { id: 'topic-1', title: 'Accounting Equation', duration: Math.round(dailyTimeMinutes * 0.3) },
            { id: 'topic-2', title: 'Financial Statements', duration: Math.round(dailyTimeMinutes * 0.7) }
          ]
        });
      }
      current.setDate(current.getDate() + 1);
    }
    
    return sessions;
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Study Schedule Planner</CardTitle>
        <CardDescription>
          Create a customized study schedule tailored to your availability
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!schedule ? (
          <>
            <div className="space-y-2">
              <Label>Daily Study Time (minutes)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[dailyTimeMinutes]}
                  min={15}
                  max={180}
                  step={15}
                  onValueChange={(value) => setDailyTimeMinutes(value[0])}
                  className="flex-1"
                />
                <span className="w-12 text-right">{dailyTimeMinutes}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'PPP') : 'Select date'}
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
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) => (startDate ? date < startDate : false)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Available Days</Label>
              <div className="grid grid-cols-7 gap-2">
                {Object.entries(availableDays).map(([day, isChecked]) => (
                  <div key={day} className="flex flex-col items-center">
                    <Checkbox
                      id={`day-${day}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => 
                        setAvailableDays(prev => ({ ...prev, [day]: Boolean(checked) }))
                      }
                    />
                    <Label htmlFor={`day-${day}`} className="mt-1 text-xs">
                      {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Study Period</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(schedule.startDate), 'PPP')} to {format(new Date(schedule.endDate), 'PPP')}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Daily Time</h3>
                <p className="text-sm text-muted-foreground">{schedule.dailyTimeMinutes} minutes</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Scheduled Sessions</h3>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {schedule.dailySessions.map((session: any, index: number) => (
                  <Card key={index} className="p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{format(new Date(session.date), 'EEEE, MMMM d')}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {session.duration} minutes
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!schedule ? (
          <Button 
            className="w-full" 
            onClick={handleGenerateSchedule}
            disabled={isPending.schedule}
          >
            Generate Study Schedule
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setSchedule(null)}
          >
            Create New Schedule
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default StudySchedulePlanner;
