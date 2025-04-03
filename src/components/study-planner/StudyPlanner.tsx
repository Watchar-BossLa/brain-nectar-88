
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { CalendarPlus, Clock, Check, ListTodo } from 'lucide-react';
import { addDays, format } from 'date-fns';

type StudySession = {
  id: string;
  title: string;
  date: Date;
  duration: number;
  topic: string;
  completed: boolean;
};

const StudyPlanner = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [sessionTitle, setSessionTitle] = useState("");
  const [duration, setDuration] = useState("30");
  const [topic, setTopic] = useState("accounting-basics");
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
    }
  ]);

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
  };

  const toggleCompleted = (id: string) => {
    setStudySessions(
      studySessions.map(session => 
        session.id === id 
          ? { ...session, completed: !session.completed } 
          : session
      )
    );
  };

  const topics = [
    { value: "accounting-basics", label: "Accounting Basics" },
    { value: "financial-statements", label: "Financial Statements" },
    { value: "tax-accounting", label: "Tax Accounting" },
    { value: "managerial-accounting", label: "Managerial Accounting" },
    { value: "auditing", label: "Auditing" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarPlus className="h-5 w-5" />
            Add Study Session
          </CardTitle>
          <CardDescription>
            Schedule your study sessions for better preparation
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
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="h-5 w-5" />
            Study Schedule
          </CardTitle>
          <CardDescription>
            Your upcoming study sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studySessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    No study sessions scheduled
                  </TableCell>
                </TableRow>
              ) : (
                studySessions.map(session => {
                  const topicLabel = topics.find(t => t.value === session.topic)?.label || session.topic;
                  
                  return (
                    <TableRow key={session.id}>
                      <TableCell>{session.title}</TableCell>
                      <TableCell>{format(session.date, 'MMM d, yyyy')}</TableCell>
                      <TableCell className="flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                        {session.duration} min
                      </TableCell>
                      <TableCell>{topicLabel}</TableCell>
                      <TableCell>
                        <Button
                          variant={session.completed ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleCompleted(session.id)}
                          className={`flex items-center ${session.completed ? 'bg-green-500 hover:bg-green-600' : ''}`}
                        >
                          {session.completed ? (
                            <>
                              <Check className="mr-1 h-4 w-4" />
                              Completed
                            </>
                          ) : (
                            "Mark Complete"
                          )}
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
  );
};

export default StudyPlanner;
