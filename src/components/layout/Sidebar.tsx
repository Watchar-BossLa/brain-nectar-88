
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth';
import {
  BookOpen,
  GraduationCap,
  Calendar,
  LineChart,
  Settings,
  Home,
  FlaskConical,
  Brain,
  LayoutDashboard,
  ScrollText,
  Users,
} from 'lucide-react';

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isSidebarOpen, toggleSidebar }: SidebarProps) {
  const { user, isAdmin } = useAuth();

  const navigationItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
    },
    {
      name: 'Courses',
      href: '/courses',
      icon: BookOpen,
    },
    {
      name: 'Qualifications',
      href: '/qualifications',
      icon: GraduationCap,
    },
    {
      name: 'Quiz',
      href: '/quiz',
      icon: FlaskConical,
    },
    {
      name: 'Adaptive Quiz',
      href: '/adaptive-quiz',
      icon: Brain,
    },
    {
      name: 'Flashcards',
      href: '/flashcards',
      icon: ScrollText,
    },
    {
      name: 'Learning Path',
      href: '/learning-path',
      icon: LineChart,
    },
    {
      name: 'Study Planner',
      href: '/study-planner',
      icon: Calendar,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  // Add admin link only for admin users
  if (isAdmin) {
    navigationItems.push({
      name: 'Admin Panel',
      href: '/admin',
      icon: LayoutDashboard,
    });
  }

  return (
    <div className={`
      fixed top-0 left-0 h-full z-40 transition-all duration-300 ease-in-out
      ${isSidebarOpen ? 'w-64' : 'w-16'}
      bg-card border-r
    `}>
      <div className="flex flex-col h-full">
        <div className="flex items-center p-4">
          <div className={`overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'w-auto' : 'w-0'}`}>
            <h2 className={`font-bold text-xl ${isSidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
              Study Bee
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className={`${isSidebarOpen ? 'ml-auto' : 'mx-auto'}`}
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
            )}
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`
                    flex items-center hover:bg-accent hover:text-accent-foreground rounded-md transition-all
                    ${isSidebarOpen ? 'py-2 px-3 justify-start' : 'p-3 justify-center'}
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  <span className={`ml-2 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'} transition-all duration-300`}>
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
