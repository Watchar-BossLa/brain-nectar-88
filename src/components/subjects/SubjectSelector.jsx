import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Function, Atom, Flask, BarChart, DollarSign, BookOpen } from 'lucide-react';

const SubjectSelector = () => {
  const subjects = [
    {
      name: 'Mathematics',
      icon: <Function className="h-8 w-8 text-primary" />,
      description: 'Explore algebra, calculus, statistics, and more',
      path: '/mathematics',
      color: 'bg-blue-100 dark:bg-blue-950'
    },
    {
      name: 'Physics',
      icon: <Atom className="h-8 w-8 text-primary" />,
      description: 'Discover mechanics, electromagnetism, and quantum physics',
      path: '/physics',
      color: 'bg-purple-100 dark:bg-purple-950'
    },
    {
      name: 'Chemistry',
      icon: <Flask className="h-8 w-8 text-primary" />,
      description: 'Learn about elements, reactions, and molecular structures',
      path: '/chemistry',
      color: 'bg-green-100 dark:bg-green-950'
    },
    {
      name: 'Data Science',
      icon: <BarChart className="h-8 w-8 text-primary" />,
      description: 'Master statistics, machine learning, and data visualization',
      path: '/data-science',
      color: 'bg-orange-100 dark:bg-orange-950'
    },
    {
      name: 'Finance',
      icon: <DollarSign className="h-8 w-8 text-primary" />,
      description: 'Understand investments, markets, and financial planning',
      path: '/finance',
      color: 'bg-emerald-100 dark:bg-emerald-950'
    },
    {
      name: 'Accounting',
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      description: 'Study financial statements, auditing, and tax principles',
      path: '/accounting',
      color: 'bg-red-100 dark:bg-red-950'
    }
  ];

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold mb-6">Explore Subjects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Link to={subject.path} key={subject.name} className="block transition-transform hover:scale-[1.02]">
            <Card className={`h-full overflow-hidden border-2 hover:border-primary ${subject.color}`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-3">
                  {subject.icon}
                  <h3 className="text-xl font-semibold">{subject.name}</h3>
                </div>
                <p className="text-muted-foreground">{subject.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SubjectSelector;
