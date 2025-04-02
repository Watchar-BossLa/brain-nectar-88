
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  GraduationCap, 
  BarChart2, 
  Brain, 
  Flame, 
  Menu,
  X,
  Home,
  ChevronLeft
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
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

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
  const navigate = useNavigate();
  
  // Find the active tab based on the current path
  const findActiveTab = () => {
    const currentPath = location.pathname;
    const currentItem = navigationItems.find(item => item.path === currentPath);
    return currentItem ? currentItem.name : navigationItems[0].name;
  };
  
  const [activeTab, setActiveTab] = useState<string>(findActiveTab());
  const isOnHomePage = location.pathname === '/';

  // Update active tab when location changes
  useEffect(() => {
    setActiveTab(findActiveTab());
  }, [location.pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const selectedItem = navigationItems.find(item => item.name === value);
    if (selectedItem) {
      navigate(selectedItem.path);
    }
  };

  const handleHomeNavigation = () => {
    navigate('/');
  };

  // Generate path segments for breadcrumb
  const generatePathSegments = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    if (pathSegments.length === 0) {
      return [];
    }
    
    return pathSegments.map((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      return {
        name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        path
      };
    });
  };

  const pathSegments = generatePathSegments();

  return (
    <div className="flex flex-col space-y-2 w-full">
      {/* Back navigation button and breadcrumbs */}
      {!isOnHomePage && (
        <div className="flex items-center mb-2">
          <Button
            onClick={handleHomeNavigation}
            variant="ghost"
            size="sm"
            className="mr-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Button>
          
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              
              {pathSegments.map((segment, index) => (
                <React.Fragment key={segment.path}>
                  {index === pathSegments.length - 1 ? (
                    <BreadcrumbItem>
                      <BreadcrumbPage>{segment.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                  ) : (
                    <>
                      <BreadcrumbItem>
                        <BreadcrumbLink href={segment.path}>{segment.name}</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                    </>
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}
      
      {/* Main Navigation */}
      <div className="flex items-center">
        {/* Desktop Navigation */}
        <div className="hidden md:block flex-1">
          <Tabs 
            value={activeTab} 
            onValueChange={handleTabChange} 
            className="w-full"
          >
            <TabsList className="w-full justify-start bg-background border border-border shadow-sm">
              {navigationItems.map((item) => (
                <TabsTrigger
                  key={item.name}
                  value={item.name}
                  className="data-[state=active]:bg-primary/10"
                >
                  {item.icon}
                  {item.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex-1">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col space-y-4 mt-6">
                {/* Home navigation always included in mobile menu */}
                <SheetClose asChild>
                  <Link
                    to="/"
                    className={`flex items-center px-4 py-2 rounded-md hover:bg-secondary ${
                      location.pathname === "/" ? "bg-primary/10 text-primary" : ""
                    }`}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </SheetClose>
                
                {navigationItems.map((item) => (
                  item.path !== "/" && (
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
                  )
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default HomeNavigation;
