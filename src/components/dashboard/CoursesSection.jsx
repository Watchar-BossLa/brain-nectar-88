import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, ArrowRight, Plus } from 'lucide-react';

/**
 * Courses Section Component
 * Shows active courses on the dashboard
 * 
 * @returns {React.ReactElement} Courses section component
 */
const CoursesSection = () => {
  // In a real implementation, these would be fetched from an API
  const courses = [
    {
      id: 1,
      title: 'Introduction to Calculus',
      progress: 65,
      lastActivity: '2 days ago',
      nextLesson: 'Derivatives and Integrals'
    },
    {
      id: 2,
      title: 'Python Programming',
      progress: 30,
      lastActivity: 'Yesterday',
      nextLesson: 'Functions and Methods'
    },
    {
      id: 3,
      title: 'Organic Chemistry',
      progress: 15,
      lastActivity: '5 days ago',
      nextLesson: 'Alkanes and Alkenes'
    }
  ];
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Active Courses</h2>
        <div className="flex gap-2">
          <Link to="/courses">
            <Button variant="ghost" size="sm" className="gap-1">
              <span>View all</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            <span>Add Course</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map(course => (
          <Card key={course.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Last activity: {course.lastActivity}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
                
                <div className="text-sm">
                  <span className="font-medium">Next lesson: </span>
                  <span className="text-muted-foreground">{course.nextLesson}</span>
                </div>
                
                <Link to={`/courses/${course.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    Continue Learning
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CoursesSection;
