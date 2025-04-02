
import React from 'react';
import { Award, Calendar, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const AssessmentsTab = () => {
  const assessments = [
    { 
      id: 1, 
      title: "Mid-Term Quiz", 
      description: "Test your understanding of financial accounting concepts covered in modules 1-3.", 
      dueDate: "April 15, 2023",
      duration: "45 min",
      status: "available"
    },
    { 
      id: 2, 
      title: "Journal Entries Assignment", 
      description: "Practice creating various journal entries for business transactions.", 
      dueDate: "April 22, 2023",
      duration: "1 hour",
      status: "upcoming"
    },
    { 
      id: 3, 
      title: "Financial Statement Analysis Project", 
      description: "Analyze provided financial statements and report on the company's financial position.", 
      dueDate: "May 5, 2023",
      duration: "2 hours",
      status: "upcoming"
    }
  ];

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Course Assessments</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {assessments.map(assessment => (
          <Card key={assessment.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-medium">{assessment.title}</h4>
                <Badge variant={assessment.status === "available" ? "default" : "outline"}>
                  {assessment.status === "available" ? "Available" : "Upcoming"}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm mb-4">{assessment.description}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>Due: {assessment.dueDate}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>Duration: {assessment.duration}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {assessment.status === "available" ? (
                <Link to="/assessment" className="w-full">
                  <Button 
                    variant="default"
                    className="w-full"
                  >
                    Start Assessment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button 
                  variant="secondary"
                  className="w-full"
                  disabled
                >
                  Not Available Yet
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AssessmentsTab;
