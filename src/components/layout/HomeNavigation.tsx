
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  GraduationCap, 
  BarChart2, 
  Brain, 
  Flame, 
  Menu,
  X
} from 'lucide-react';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';

const navigationItems = [
  {
    name: 'Dashboard',
    icon: <BarChart2 className="h-4 w-4 mr-2" />,
    path: '/'
  },
  {
    name: 'Courses',
    icon: <BookOpen className="h-4 w-4 mr-2" />,
    path: '/courses'
  },
  {
    name: 'Qualifications',
    icon: <GraduationCap className="h-4 w-4 mr-2" />,
    path: '/qualifications'
  },
  {
    name: 'Flashcards',
    icon: <Flame className="h-4 w-4 mr-2" />,
    path: '/flashcards'
  },
  {
    name: 'Adaptive Learning',
    icon: <Brain className="h-4 w-4 mr-2" />,
    path: '/adaptive-quiz'
  }
];

const HomeNavigation: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>(
    navigationItems.find(item => item.path === location.pathname)?.name || navigationItems[0].name
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <Tabs 
          defaultValue={activeTab} 
          onValueChange={handleTabChange} 
          className="w-full"
        >
          <TabsList className="w-full justify-start bg-background border border-border shadow-sm">
            {navigationItems.map((item) => (
              <TabsTrigger
                key={item.name}
                value={item.name}
                className="data-[state=active]:bg-primary/10"
                asChild
              >
                <Link to={item.path} className="flex items-center">
                  {item.icon}
                  {item.name}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="flex flex-col space-y-4 mt-6">
              {navigationItems.map((item) => (
                <SheetClose key={item.name} asChild>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-2 rounded-md hover:bg-secondary ${
                      location.pathname === item.path ? "bg-primary/10 text-primary" : ""
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                </SheetClose>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default HomeNavigation;
