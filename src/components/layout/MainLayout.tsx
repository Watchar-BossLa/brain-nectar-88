
import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Graduation, 
  BarChart2, 
  Settings, 
  Home,
  User
} from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
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
            <div className="rounded-xl bg-primary p-2 w-10 h-10 flex items-center justify-center">
              <Graduation className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold">Study Bee</h1>
          </motion.div>
        </div>
        
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {[
              { icon: <Home size={18} />, label: 'Dashboard', path: '/' },
              { icon: <BookOpen size={18} />, label: 'My Courses', path: '/courses' },
              { icon: <Graduation size={18} />, label: 'Assessments', path: '/assessments' },
              { icon: <BarChart2 size={18} />, label: 'Progress', path: '/progress' },
              { icon: <User size={18} />, label: 'Profile', path: '/profile' },
              { icon: <Settings size={18} />, label: 'Settings', path: '/settings' },
            ].map((item, index) => (
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
          </ul>
        </nav>
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
