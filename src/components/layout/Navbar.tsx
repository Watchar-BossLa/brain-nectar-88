
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home, BookOpen, Brain, FlaskConical, Award, User } from 'lucide-react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  
  return (
    <nav className="border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold">StudyBee</span>
          </Link>
          
          {user && (
            <div className="ml-10 hidden md:flex items-center space-x-4">
              <Link to="/" className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary">
                <Home className="w-4 h-4 mr-2" />
                <span>Home</span>
              </Link>
              <Link to="/dashboard" className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary">
                <BookOpen className="w-4 h-4 mr-2" />
                <span>Learning Path</span>
              </Link>
              <Link to="/advanced-learning" className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary">
                <Brain className="w-4 h-4 mr-2" />
                <span>Advanced Learning</span>
              </Link>
              <Link to="/agent-dashboard" className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary">
                <FlaskConical className="w-4 h-4 mr-2" />
                <span>Agent System</span>
              </Link>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ''} />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
