
import React from 'react';
import { BookOpen } from 'lucide-react';

const ResourcesTab = () => {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <BookOpen className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-medium mb-2">Course Resources</h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        Access supplementary materials, readings, and practice files for this course.
      </p>
    </div>
  );
};

export default ResourcesTab;
