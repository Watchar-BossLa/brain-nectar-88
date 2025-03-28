
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Plus, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { StudyTopic } from '../types';

interface AddSessionFormProps {
  topics: StudyTopic[];
  onAddSession: (session: {
    title: string;
    date: Date;
    duration: number;
    topic: string;
  }) => void;
}

const AddSessionForm: React.FC<AddSessionFormProps> = ({ topics, onAddSession }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [duration, setDuration] = useState(30);
  const [topic, setTopic] = useState<string>(topics[0]?.value || '');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !date || !duration || !topic) {
      return;
    }
    
    onAddSession({
      title,
      date,
      duration,
      topic
    });
    
    // Reset form
    setTitle('');
    setDuration(30);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Study Session
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Session Title</Label>
            <Input
              id="title"
              placeholder="Study Accounting Basics"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date & Time</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <Input
                id="duration"
                type="number"
                min={5}
                max={480}
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Select
              value={topic}
              onValueChange={setTopic}
            >
              <SelectTrigger id="topic">
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic.value} value={topic.value}>
                    {topic.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" className="w-full mt-2">
            Add Session
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddSessionForm;
