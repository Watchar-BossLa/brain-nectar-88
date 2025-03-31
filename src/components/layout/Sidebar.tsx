
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  BookOpen, 
  Flame, 
  GraduationCap, 
  PenTool, 
  Calendar, 
  Settings, 
  LogOut,
  Brain,
  Route,
  Calculator,
  LineChart,
  PlusSquare,
  BarChart2,
  Database
} from "lucide-react";
import { useAuth } from "@/context/auth";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { useState } from "react";
import { subjects } from "@/utils/subjects";

export function Sidebar({ className }: { className?: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    accounting: true
  });

  const isActive = (path: string) => location.pathname === path;

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const toggleSection = (section: string) => {
    setOpenSections({
      ...openSections,
      [section]: !openSections[section]
    });
  };

  // Core navigation items
  const coreNavItems = [
    {
      icon: Home,
      label: "Home",
      path: "/",
    },
    {
      icon: GraduationCap,
      label: "Qualifications",
      path: "/qualifications",
    },
    {
      icon: Route,
      label: "Learning Path",
      path: "/learning-path",
    },
  ];

  // Map subjects to their icons
  const subjectIcons: Record<string, any> = {
    accounting: Calculator,
    finance: LineChart,
    mathematics: PlusSquare,
    statistics: BarChart2,
    dataScience: Database
  };

  // Subject-specific items
  const subjectNavItems = Object.values(subjects).map(subject => ({
    id: subject.id,
    label: subject.name,
    icon: subjectIcons[subject.id] || BookOpen,
    items: [
      { 
        label: "Study Materials", 
        path: `/${subject.id}/materials` 
      },
      { 
        label: "Flashcards", 
        path: subject.id === 'accounting' ? "/flashcards" : `/${subject.id}/flashcards` 
      },
      { 
        label: "Quizzes", 
        path: "/quiz", 
        queryParams: { subject: subject.id } 
      },
    ]
  }));

  // Tool items
  const toolNavItems = [
    {
      icon: Brain,
      label: "AI Dashboard",
      path: "/agent-dashboard",
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/settings",
    },
  ];

  return (
    <div className={cn("pb-12 min-h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 
            className="mb-2 px-2 text-xl font-semibold tracking-tight cursor-pointer"
            onClick={() => handleNavigate('/')}
          >
            Study Bee
          </h2>
          
          <div className="space-y-1">
            {/* Core Navigation */}
            {coreNavItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive(item.path) && "bg-primary text-primary-foreground"
                )}
                onClick={() => handleNavigate(item.path)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}

            {/* Divider */}
            <div className="my-2 border-t border-border" />

            {/* Subject Sections */}
            {subjectNavItems.map((subject) => (
              <Collapsible
                key={subject.id}
                open={openSections[subject.id]}
                onOpenChange={() => toggleSection(subject.id)}
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between"
                  >
                    <div className="flex items-center">
                      <subject.icon className="mr-2 h-4 w-4" />
                      {subject.label}
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={cn(
                        "h-4 w-4 transition-transform",
                        openSections[subject.id] ? "rotate-180" : ""
                      )}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-6 space-y-1 pt-1">
                  {subject.items.map((item) => (
                    <Button
                      key={`${subject.id}-${item.label}`}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start",
                        isActive(item.path) && "bg-primary/10 text-primary"
                      )}
                      onClick={() => handleNavigate(item.path)}
                    >
                      {item.label}
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}

            {/* Divider */}
            <div className="my-2 border-t border-border" />

            {/* Tool Navigation */}
            {toolNavItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive(item.path) && "bg-primary text-primary-foreground"
                )}
                onClick={() => handleNavigate(item.path)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="px-4 absolute bottom-4 w-full">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );
}
