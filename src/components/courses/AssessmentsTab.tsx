
import React from 'react';
import { ClipboardCheck, Calendar, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock assessment data
const assessments = [
  {
    id: "assessment-1",
    title: "Mid-module Quiz",
    type: "Quiz",
    dueDate: "Apr 10, 2025",
    duration: "30 min",
    status: "not-started"
  },
  {
    id: "assessment-2",
    title: "Financial Statements Practical",
    type: "Assignment",
    dueDate: "Apr 15, 2025",
    duration: "2 hours",
    status: "not-started"
  },
  {
    id: "assessment-3",
    title: "Double-Entry Practice",
    type: "Exercise",
    dueDate: "Apr 8, 2025",
    duration: "45 min",
    status: "available"
  }
];

const AssessmentsTab = () => {
  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-amber-500">In Progress</Badge>;
      case 'available':
        return <Badge className="bg-blue-500">Available</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-medium">Course Assessments</h3>
          <p className="text-muted-foreground">Complete assessments to test your knowledge</p>
        </div>
        <Button className="w-full md:w-auto">Create Practice Test</Button>
      </div>
      
      {assessments.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments.map(assessment => (
                <TableRow key={assessment.id}>
                  <TableCell className="font-medium">{assessment.title}</TableCell>
                  <TableCell>{assessment.type}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{assessment.dueDate}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{assessment.duration}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(assessment.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant={assessment.status === 'available' ? 'default' : 'outline'}>
                      {assessment.status === 'completed' ? 'Review' : 'Start'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <ClipboardCheck className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-medium mb-2">No Assessments Yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            There are no assessments available for this course yet. Check back later.
          </p>
        </div>
      )}
    </div>
  );
};

export default AssessmentsTab;
