
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const coursesData = [
  {
    id: 1,
    title: 'Financial Accounting Basics',
    description: 'Learn the fundamentals of financial accounting including the accounting equation, journal entries, and financial statements.',
    progress: 45,
    image: '/lovable-uploads/0d1e3e9b-51a0-4dff-87fc-047ce00b238a.png'
  },
  {
    id: 2,
    title: 'Managerial Accounting',
    description: 'Understand how to use accounting information for internal decision-making processes.',
    progress: 10,
    image: '/lovable-uploads/0d1e3e9b-51a0-4dff-87fc-047ce00b238a.png'
  },
  {
    id: 3,
    title: 'Tax Accounting',
    description: 'Learn the principles of tax accounting and how to apply tax regulations to various business scenarios.',
    progress: 0,
    image: '/lovable-uploads/0d1e3e9b-51a0-4dff-87fc-047ce00b238a.png'
  },
  {
    id: 4,
    title: 'Auditing Principles',
    description: 'Explore the fundamental concepts of auditing and assurance in accounting practice.',
    progress: 0,
    image: '/lovable-uploads/0d1e3e9b-51a0-4dff-87fc-047ce00b238a.png'
  }
];

const Courses = () => {
  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">My Courses</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesData.map((course) => (
            <Card key={course.id} className="overflow-hidden flex flex-col">
              <div className="h-40 bg-muted relative">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="object-cover w-full h-full"
                />
                {course.progress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>
                  {course.progress > 0 ? `${course.progress}% complete` : 'Not started'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{course.description}</p>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button className="w-full">
                  {course.progress > 0 ? 'Continue Course' : 'Start Course'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Courses;
