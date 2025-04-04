
import React, { useState } from 'react';
import { ClipboardCheck, Calendar, Clock, Plus } from 'lucide-react';
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  const [isCreatingTest, setIsCreatingTest] = useState(false);
  
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

  const handleStartAssessment = (assessment: typeof assessments[0]) => {
    if (assessment.status === 'available') {
      toast({
        title: "Starting assessment",
        description: `You are now starting: ${assessment.title}`
      });
    } else {
      toast({
        title: "Assessment not available",
        description: "This assessment is not available yet.",
        variant: "destructive"
      });
    }
  };

  const handleCreateTest = () => {
    setIsCreatingTest(true);
    toast({
      title: "Test created",
      description: "Your practice test has been generated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-medium">Course Assessments</h3>
          <p className="text-muted-foreground">Complete assessments to test your knowledge</p>
        </div>
        
        {/* Practice test creation - use Drawer on mobile and Sheet on desktop */}
        <div className="block md:hidden">
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Create Practice Test
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Create Practice Test</DrawerTitle>
                <DrawerDescription>
                  Generate a personalized practice test based on your learning progress.
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Our AI will analyze your learning progress and create a test focused on areas that need improvement.
                </p>
              </div>
              <DrawerFooter>
                <Button onClick={handleCreateTest}>Generate Test</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
        
        <div className="hidden md:block">
          <Sheet>
            <SheetTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Practice Test
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Create Practice Test</SheetTitle>
                <SheetDescription>
                  Generate a personalized practice test based on your learning progress.
                </SheetDescription>
              </SheetHeader>
              <div className="py-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Our AI will analyze your learning progress and create a test focused on areas that need improvement.
                </p>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button onClick={handleCreateTest}>Generate Test</Button>
                <Button variant="outline" onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Escape'}))}>
                  Cancel
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {assessments.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="hidden md:table-cell">Duration</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments.map(assessment => (
                <TableRow key={assessment.id}>
                  <TableCell className="font-medium">{assessment.title}</TableCell>
                  <TableCell className="hidden md:table-cell">{assessment.type}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{assessment.dueDate}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{assessment.duration}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {getStatusBadge(assessment.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      variant={assessment.status === 'available' ? 'default' : 'outline'}
                      onClick={() => handleStartAssessment(assessment)}
                    >
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
