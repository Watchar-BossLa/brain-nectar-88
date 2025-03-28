
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarPlus } from 'lucide-react';
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
  const [sessionTitle, setSessionTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [duration, setDuration] = useState("30");
  const [topic, setTopic] = useState(topics[0]?.value || "");

  const handleSubmit = () => {
    if (!date || !sessionTitle) return;
    
    onAddSession({
      title: sessionTitle,
      date,
      duration: parseInt(duration),
      topic
    });
    
    setSessionTitle("");
  };

  return (
    <>
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
          onClick={handleSubmit}
          disabled={!date || !sessionTitle}
        >
          Add to Schedule
        </Button>
      </CardContent>
    </>
  );
};

export default AddSessionForm;
