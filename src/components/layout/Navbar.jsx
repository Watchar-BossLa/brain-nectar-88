
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen,
  BookType,
  BarChart,
  User,
  Menu,
  X,
  Brain,
  Clock,
  Calculator,
  Briefcase,
  Compass,
  Camera,
} from 'lucide-react';
import { useAuth } from '@/context/auth';
import { Button } from '@/components/ui/button';
import NavbarTimerButton from './NavbarTimerButton';
import NavbarUserMenu from '../NavbarUserMenu';

/**
 * Main navigation bar component
 * @returns {React.ReactElement} Navbar component
 */
const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation links definition
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart },
    { name: 'Flashcards', href: '/flashcards', icon: BookOpen },
    { name: 'Qualifications', href: '/qualifications', icon: BookType },
    { name: 'Quiz', href: '/quiz', icon: Brain },
    { name: 'Financial Tools', href: '/financial-tools', icon: Calculator },
    { name: 'Learning Paths', href: '/advanced-learning', icon: Compass },
    { name: 'Visual Recognition', href: '/visual-recognition', icon: Camera },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <div className="text-primary text-2xl font-bold">StudyBee</div>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      isActive
                        ? 'border-b-2 border-primary text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-muted'
                    }`}
                  >
                    <Icon className="mr-1 h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <NavbarTimerButton />
            {user ? (
              <NavbarUserMenu />
            ) : (
              <div className="flex space-x-2">
                <Link to="/login">
                  <Button variant="outline">Log In</Button>
                </Link>
                <Link to="/sign-up">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={closeMobileMenu}
                className={`block pl-3 pr-4 py-2 text-base font-medium flex items-center ${
                  isActive
                    ? 'bg-primary/10 text-primary border-l-4 border-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
        <div className="border-t pt-4 pb-3">
          {user ? (
            <div className="px-4 space-y-2">
              <div className="font-medium">{user.email}</div>
              <Link
                to="/profile"
                onClick={closeMobileMenu}
                className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent flex items-center"
              >
                <User className="mr-3 h-5 w-5" />
                Profile
              </Link>
              <button
                onClick={() => {
                  signOut();
                  closeMobileMenu();
                }}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="px-4 flex flex-col space-y-2">
              <Link to="/login" onClick={closeMobileMenu}>
                <Button variant="outline" className="w-full">
                  Log In
                </Button>
              </Link>
              <Link to="/sign-up" onClick={closeMobileMenu}>
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
