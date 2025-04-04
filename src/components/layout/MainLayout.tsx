
import React, { ReactNode, useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  GraduationCap, 
  BarChart2, 
  Settings, 
  Home,
  User,
  Award,
  LogOut,
  Timer
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import MainLayoutTimerButton from './MainLayoutTimerButton';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    navigate('/signin');
    setIsSigningOut(false);
  };

  const userInitials = user?.email 
    ? user.email.split('@')[0].substring(0, 2).toUpperCase() 
    : 'U';

  const navigationItems = [
    { icon: <Home size={18} />, label: 'Dashboard', path: '/' },
    { icon: <BookOpen size={18} />, label: 'My Courses', path: '/courses' },
    { icon: <Award size={18} />, label: 'Qualifications', path: '/qualifications' },
    { icon: <GraduationCap size={18} />, label: 'Assessments', path: '/assessments' },
    { icon: <BarChart2 size={18} />, label: 'Progress', path: '/progress' },
    { icon: <User size={18} />, label: 'Profile', path: '/profile' },
    { icon: <Settings size={18} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden bg-background">
      {/* Sidebar */}
      <motion.aside 
        className="w-full md:w-64 md:h-screen md:min-h-screen border-r border-border bg-secondary/30 backdrop-blur-sm z-10"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="p-6">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 relative bg-transparent">
                <img 
                  src="/lovable-uploads/0d1e3e9b-51a0-4dff-87fc-047ce00b238a.png" 
                  alt="Study Bee Logo" 
                  className="w-full h-full object-contain"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-b from-[#f5d742] to-[#1e3a8a] inline-block text-transparent bg-clip-text font-sans">Study Bee</h1>
            </Link>
          </motion.div>
        </div>
        
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {navigationItems.map((item, index) => (
              <motion.li 
                key={item.path}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'hover:bg-muted/50'
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              </motion.li>
            ))}
            
            {/* Study Timer Button */}
            <motion.li
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 + navigationItems.length * 0.05, duration: 0.3 }}
            >
              <MainLayoutTimerButton />
            </motion.li>
          </ul>
        </nav>

        <div className="absolute bottom-16 left-0 right-0 p-4 flex justify-center">
          <ThemeSwitcher />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full flex items-center justify-start gap-3 px-4 py-3 hover:bg-muted/50 rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{user?.email?.split('@')[0]}</span>
                  <span className="text-xs text-muted-foreground truncate max-w-[120px]">{user?.email}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onSelect={handleSignOut}
                disabled={isSigningOut}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.aside>
      
      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <motion.div 
          className="h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default MainLayout;
