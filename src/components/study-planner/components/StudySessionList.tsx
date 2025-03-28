
import React from 'react';
import { format } from 'date-fns';
import { Check, Clock, Trash2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { StudySession, StudyTopic } from '../types';

interface StudySessionListProps {
  sessions: StudySession[];
  topics: StudyTopic[];
  onToggleCompleted: (id: string) => void;
  onDeleteSession: (id: string) => void;
}

const StudySessionList: React.FC<StudySessionListProps> = ({
  sessions,
  topics,
  onToggleCompleted,
  onDeleteSession
}) => {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No study sessions scheduled. Add a session to get started.</p>
      </div>
    );
  }

  // Get topic label from topic value
  const getTopicLabel = (topicValue: string) => {
    const topic = topics.find(t => t.value === topicValue);
    return topic ? topic.label : topicValue;
  };

  // Group sessions by date
  const groupedSessions: { [key: string]: StudySession[] } = {};
  
  sessions.forEach(session => {
    const dateStr = format(session.date, 'yyyy-MM-dd');
    if (!groupedSessions[dateStr]) {
      groupedSessions[dateStr] = [];
    }
    groupedSessions[dateStr].push(session);
  });
  
  // Sort dates
  const sortedDates = Object.keys(groupedSessions).sort();

  return (
    <div className="space-y-6">
      {sortedDates.map(dateStr => (
        <div key={dateStr} className="space-y-2">
          <h3 className="text-sm font-medium">
            {format(new Date(dateStr), 'EEEE, MMMM d, yyyy')}
          </h3>
          
          <div className="space-y-2">
            {groupedSessions[dateStr].map(session => (
              <div 
                key={session.id}
                className={`p-3 border rounded-lg flex items-center justify-between ${
                  session.completed ? 'bg-muted/50' : ''
                }`}
              >
                <div className="flex items-start gap-2">
                  <Checkbox 
                    checked={session.completed}
                    onCheckedChange={() => onToggleCompleted(session.id)}
                    className="mt-1"
                  />
                  
                  <div className="space-y-1">
                    <p className={`font-medium ${session.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {session.title}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {format(session.date, 'h:mm a')} • {session.duration} min
                      </div>
                      
                      <Badge variant="outline" className="flex items-center text-xs">
                        <Bookmark className="mr-1 h-3 w-3" />
                        {getTopicLabel(session.topic)}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 items-center">
                  {session.completed && (
                    <Badge variant="outline" className="text-green-600 bg-green-50">
                      <Check className="mr-1 h-3 w-3" />
                      Completed
                    </Badge>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteSession(session.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudySessionList;
