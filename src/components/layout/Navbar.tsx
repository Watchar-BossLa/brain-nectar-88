import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Home, BookOpen, GraduationCap, GanttChart, FlaskConical, CreditCard, Brain } from 'lucide-react';

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
          <Link 
            to="/"
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
              location.pathname === '/' 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          
          <Link 
            to="/courses"
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
              location.pathname === '/courses' 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Courses</span>
          </Link>
          
          <Link 
            to="/study-plans"
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
              location.pathname === '/study-plans' 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>Study Plans</span>
          </Link>
          
          <Link 
            to="/flashcards"
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
              location.pathname === '/flashcards' 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <FlaskConical className="h-4 w-4" />
            <span>Flashcards</span>
          </Link>
          
          <Link 
            to="/agents"
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
              location.pathname === '/agents' 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Brain className="h-4 w-4" />
            <span>AI Agents</span>
          </Link>
        </div>
      </div>

      {/* Right side: User Profile and Authentication */}
      <div className="flex items-center space-x-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="h-9 w-9">
                <AvatarImage src="" />
                <AvatarFallback className="text-xl">{userInitials}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/billing">Billing</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  signOut();
                }}
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Link to="/signin" className="text-sm text-muted-foreground hover:text-foreground">
              Sign In
            </Link>
            <Link to="/signup" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
