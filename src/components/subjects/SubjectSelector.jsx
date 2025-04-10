import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calculator, 
  Atom, 
  Flask, 
  BarChart, 
  DollarSign, 
  BookOpen, 
  Code, 
  Globe, 
  Brain, 
  Microscope,
  Music,
  Landmark,
  HeartPulse,
  Scale,
  Leaf
} from 'lucide-react';

/**
 * SubjectSelector component that allows users to navigate between different subjects
 * @returns {React.ReactElement} SubjectSelector component
 */
const SubjectSelector = ({ currentSubject }) => {
  const navigate = useNavigate();
  
  // Define subject categories and their subjects
  const subjectCategories = [
    {
      id: 'stem',
      name: 'STEM',
      subjects: [
        { id: 'mathematics', name: 'Mathematics', icon: <Calculator className="h-5 w-5" />, path: '/mathematics' },
        { id: 'physics', name: 'Physics', icon: <Atom className="h-5 w-5" />, path: '/physics' },
        { id: 'chemistry', name: 'Chemistry', icon: <Flask className="h-5 w-5" />, path: '/chemistry' },
        { id: 'biology', name: 'Biology', icon: <Microscope className="h-5 w-5" />, path: '/biology' },
        { id: 'computer-science', name: 'Computer Science', icon: <Code className="h-5 w-5" />, path: '/computer-science' },
        { id: 'data-science', name: 'Data Science', icon: <BarChart className="h-5 w-5" />, path: '/data-science' }
      ]
    },
    {
      id: 'business',
      name: 'Business',
      subjects: [
        { id: 'finance', name: 'Finance', icon: <DollarSign className="h-5 w-5" />, path: '/finance' },
        { id: 'economics', name: 'Economics', icon: <Landmark className="h-5 w-5" />, path: '/economics' },
        { id: 'accounting', name: 'Accounting', icon: <BookOpen className="h-5 w-5" />, path: '/accounting' },
        { id: 'marketing', name: 'Marketing', icon: <BarChart className="h-5 w-5" />, path: '/marketing' }
      ]
    },
    {
      id: 'humanities',
      name: 'Humanities',
      subjects: [
        { id: 'history', name: 'History', icon: <Globe className="h-5 w-5" />, path: '/history' },
        { id: 'philosophy', name: 'Philosophy', icon: <Brain className="h-5 w-5" />, path: '/philosophy' },
        { id: 'literature', name: 'Literature', icon: <BookOpen className="h-5 w-5" />, path: '/literature' },
        { id: 'music', name: 'Music', icon: <Music className="h-5 w-5" />, path: '/music' }
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      subjects: [
        { id: 'medicine', name: 'Medicine', icon: <HeartPulse className="h-5 w-5" />, path: '/medicine' },
        { id: 'law', name: 'Law', icon: <Scale className="h-5 w-5" />, path: '/law' },
        { id: 'environmental-science', name: 'Environmental Science', icon: <Leaf className="h-5 w-5" />, path: '/environmental-science' }
      ]
    }
  ];
  
  // Handle subject selection
  const handleSubjectSelect = (path) => {
    navigate(path);
  };
  
  // Find the category that contains the current subject
  const findCurrentCategory = () => {
    if (!currentSubject) return 'stem';
    
    for (const category of subjectCategories) {
      if (category.subjects.some(subject => subject.id === currentSubject.toLowerCase())) {
        return category.id;
      }
    }
    
    return 'stem';
  };
  
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <Tabs defaultValue={findCurrentCategory()}>
          <TabsList className="grid grid-cols-4 mb-4">
            {subjectCategories.map(category => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {subjectCategories.map(category => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {category.subjects.map(subject => {
                  const isActive = currentSubject && subject.id === currentSubject.toLowerCase();
                  
                  return (
                    <Button
                      key={subject.id}
                      variant={isActive ? "default" : "outline"}
                      className={`flex flex-col h-auto py-3 px-2 gap-2 ${isActive ? 'bg-primary text-primary-foreground' : ''}`}
                      onClick={() => handleSubjectSelect(subject.path)}
                    >
                      {subject.icon}
                      <span className="text-xs">{subject.name}</span>
                    </Button>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SubjectSelector;
