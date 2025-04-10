import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Function, 
  Atom, 
  Flask, 
  BarChart, 
  DollarSign, 
  Code, 
  Microscope, 
  BookOpen,
  GraduationCap,
  Globe,
  Landmark,
  Lightbulb
} from 'lucide-react';

/**
 * SubjectSelector component for navigating between subjects
 * @param {Object} props Component props
 * @param {string} props.currentSubject The current subject being viewed
 * @returns {React.ReactElement} SubjectSelector component
 */
const SubjectSelector = ({ currentSubject }) => {
  // Subject data with icons and routes
  const subjects = [
    { 
      id: 'mathematics', 
      name: 'Mathematics', 
      icon: <Function className="h-5 w-5" />,
      route: '/mathematics',
      color: 'text-blue-500'
    },
    { 
      id: 'physics', 
      name: 'Physics', 
      icon: <Atom className="h-5 w-5" />,
      route: '/physics',
      color: 'text-orange-500'
    },
    { 
      id: 'chemistry', 
      name: 'Chemistry', 
      icon: <Flask className="h-5 w-5" />,
      route: '/chemistry',
      color: 'text-green-500'
    },
    { 
      id: 'biology', 
      name: 'Biology', 
      icon: <Microscope className="h-5 w-5" />,
      route: '/biology',
      color: 'text-emerald-500'
    },
    { 
      id: 'data science', 
      name: 'Data Science', 
      icon: <BarChart className="h-5 w-5" />,
      route: '/data-science',
      color: 'text-cyan-500'
    },
    { 
      id: 'finance', 
      name: 'Finance', 
      icon: <DollarSign className="h-5 w-5" />,
      route: '/finance',
      color: 'text-indigo-500'
    },
    { 
      id: 'computer science', 
      name: 'Computer Science', 
      icon: <Code className="h-5 w-5" />,
      route: '/computer-science',
      color: 'text-pink-500'
    },
    { 
      id: 'literature', 
      name: 'Literature', 
      icon: <BookOpen className="h-5 w-5" />,
      route: '/literature',
      color: 'text-purple-500'
    },
    { 
      id: 'history', 
      name: 'History', 
      icon: <Landmark className="h-5 w-5" />,
      route: '/history',
      color: 'text-amber-500'
    },
    { 
      id: 'geography', 
      name: 'Geography', 
      icon: <Globe className="h-5 w-5" />,
      route: '/geography',
      color: 'text-teal-500'
    },
    { 
      id: 'psychology', 
      name: 'Psychology', 
      icon: <Lightbulb className="h-5 w-5" />,
      route: '/psychology',
      color: 'text-rose-500'
    },
    { 
      id: 'education', 
      name: 'Education', 
      icon: <GraduationCap className="h-5 w-5" />,
      route: '/education',
      color: 'text-yellow-500'
    }
  ];
  
  // Filter out the current subject
  const otherSubjects = subjects.filter(subject => 
    subject.id.toLowerCase() !== currentSubject.toLowerCase()
  );
  
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-3">Explore Other Subjects</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {otherSubjects.map(subject => (
            <Link key={subject.id} to={subject.route}>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
              >
                <span className={subject.color}>{subject.icon}</span>
                <span className="truncate">{subject.name}</span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectSelector;
