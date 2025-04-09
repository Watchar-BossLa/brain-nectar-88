import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Calendar, Clock, ArrowRight } from 'lucide-react';

/**
 * Assessments Recommended Section Component
 * Shows recommended assessments on the dashboard
 * 
 * @returns {React.ReactElement} Assessments recommended section component
 */
const AssessmentsRecommendedSection = () => {
  // In a real implementation, these would be fetched from an API
  const assessments = [
    {
      id: 1,
      title: 'Calculus Mid-Term',
      dueDate: '2023-03-15',
      estimatedTime: 60,
      course: 'Introduction to Calculus'
    },
    {
      id: 2,
      title: 'Python Programming Quiz',
      dueDate: '2023-03-10',
      estimatedTime: 30,
      course: 'Python Programming'
    },
    {
      id: 3,
      title: 'Organic Chemistry Lab Report',
      dueDate: '2023-03-20',
      estimatedTime: 120,
      course: 'Organic Chemistry'
    }
  ];
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Upcoming Assessments</CardTitle>
            <CardDescription>Assessments due soon</CardDescription>
          </div>
          <GraduationCap className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assessments.map(assessment => (
            <div 
              key={assessment.id}
              className="flex items-start space-x-3 p-3 rounded-lg border"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{assessment.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {assessment.course}
                </p>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center mr-3">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Due: {formatDate(assessment.dueDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{assessment.estimatedTime} min</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <Link to="/assessments">
            <Button variant="outline" size="sm" className="w-full">
              <span>View All Assessments</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentsRecommendedSection;
