
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Clock } from 'lucide-react';
import { format, isToday, isAfter } from 'date-fns';
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
  return (
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
        {sessions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
              No study sessions scheduled
            </TableCell>
          </TableRow>
        ) : (
          sessions.map(session => {
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
                    onClick={() => onToggleCompleted(session.id)}
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
                    onClick={() => onDeleteSession(session.id)}
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
  );
};

export default StudySessionList;
