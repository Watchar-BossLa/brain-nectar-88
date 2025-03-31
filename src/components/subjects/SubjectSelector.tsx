
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { subjects, SubjectInfo } from '@/utils/subjects';
import { Button } from '@/components/ui/button';

interface SubjectSelectorProps {
  currentSubject?: string;
  onSelect?: (subject: string) => void;
  displayStyle?: 'cards' | 'buttons' | 'dropdown';
  className?: string;
}

export const SubjectSelector = ({
  currentSubject = 'accounting',
  onSelect,
  displayStyle = 'cards',
  className
}: SubjectSelectorProps) => {
  const navigate = useNavigate();
  
  const handleSubjectSelect = (subjectId: string) => {
    if (onSelect) {
      onSelect(subjectId);
    } else {
      // If no handler is provided, navigate to the subject's primary path
      const subject = subjects[subjectId];
      if (subject?.primaryPath) {
        navigate(subject.primaryPath);
      }
    }
  };
  
  if (displayStyle === 'buttons') {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {Object.values(subjects).map((subject) => (
          <Button
            key={subject.id}
            variant={currentSubject === subject.id ? "default" : "outline"}
            size="sm"
            onClick={() => handleSubjectSelect(subject.id)}
            className={cn(
              "flex items-center gap-1",
              currentSubject === subject.id && "bg-primary text-primary-foreground"
            )}
          >
            {subject.name}
            {currentSubject === subject.id && <Check className="h-3.5 w-3.5" />}
          </Button>
        ))}
      </div>
    );
  }

  // Default card style
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4", className)}>
      {Object.values(subjects).map((subject) => (
        <div
          key={subject.id}
          className={cn(
            "border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow",
            currentSubject === subject.id && "border-primary bg-primary/5"
          )}
          onClick={() => handleSubjectSelect(subject.id)}
        >
          <div className="flex justify-between items-center">
            <h3 className={cn("font-medium text-lg", subject.color)}>{subject.name}</h3>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {subject.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SubjectSelector;
