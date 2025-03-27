
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuth(); // Changed 'logout' to 'signOut' to match AuthContextType
  const location = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await signOut(); // Changed to use signOut instead of logout
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout Failed",
        description: "There was an error logging you out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block text-xl">StudyBee</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link to="/dashboard" className={`transition-colors hover:text-primary ${location.pathname === '/dashboard' ? 'text-primary' : 'text-foreground/60'}`}>
              Dashboard
            </Link>
            <Link to="/flashcards" className={`transition-colors hover:text-primary ${location.pathname === '/flashcards' ? 'text-primary' : 'text-foreground/60'}`}>
              Flashcards
            </Link>
            <Link to="/qualifications" className={`transition-colors hover:text-primary ${location.pathname === '/qualifications' ? 'text-primary' : 'text-foreground/60'}`}>
              Qualifications
            </Link>
            <Link to="/study-planner" className={`transition-colors hover:text-primary ${location.pathname === '/study-planner' ? 'text-primary' : 'text-foreground/60'}`}>
              Study Planner
            </Link>
            <Link to="/accounting-tools" className={`transition-colors hover:text-primary ${location.pathname === '/accounting-tools' ? 'text-primary' : 'text-foreground/60'}`}>
              Accounting Tools
            </Link>
          </nav>
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          {/* Mobile menu (example, implement your actual mobile menu) */}
          <div className="md:hidden">
            {/* Add your mobile menu icon and logic here */}
            {/* Example: */}
            <button>
              {/* Mobile Menu Icon */}
            </button>
          </div>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.email} alt={user?.email || "User Avatar"} />
                    <AvatarFallback>{user?.email?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/user-profile">User Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  Logout
                  <LogOut className="ml-auto h-4 w-4" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Log In
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
