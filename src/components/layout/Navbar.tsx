import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Home, BookOpen, GraduationCap, GanttChart, FlaskConical, CreditCard, Brain, Wallet } from 'lucide-react';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: <Home className="h-4 w-4" />,
  },
  {
    name: 'Courses',
    href: '/courses',
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    name: 'Study Plans',
    href: '/study-plans',
    icon: <GraduationCap className="h-4 w-4" />,
  },
  {
    name: 'Flashcards',
    href: '/flashcards',
    icon: <FlaskConical className="h-4 w-4" />,
  },
  {
    name: 'AI Agents',
    href: '/agents',
    icon: <Brain className="h-4 w-4" />,
  },
  {
    name: 'Blockchain',
    href: '/blockchain',
    icon: <Wallet className="h-5 w-5" />,
  },
];

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  
  // Get user initials for avatar
  const userInitials = user?.email 
    ? user.email.split('@')[0].substring(0, 2).toUpperCase() 
    : 'U';

  return (
    <nav className="bg-background border-b border-border h-16 flex items-center justify-between px-4 sm:px-6">
      {/* Left side: Logo and Main Navigation */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-lg font-bold">
          StudyBee
        </Link>
        
        <div className="hidden sm:flex items-center space-x-2">
          {navigationItems.map((item) => (
            <Link 
              key={item.name}
              to={item.href}
              className={`

