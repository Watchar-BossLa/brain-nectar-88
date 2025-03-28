
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, BookOpen, BrainCircuit, Clock, LayoutGrid } from 'lucide-react';

const StudyPlanTips = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          Study Planning Tips
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Time Management</p>
              <p className="text-xs text-muted-foreground">
                Shorter, focused study sessions (25-30 minutes) with breaks are more effective than long cramming sessions.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <LayoutGrid className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Mix Topics</p>
              <p className="text-xs text-muted-foreground">
                Interleaving different subjects in your study plan leads to better long-term retention than focusing on one topic at a time.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <BrainCircuit className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Spaced Repetition</p>
              <p className="text-xs text-muted-foreground">
                Reviewing material at increasing intervals helps transfer knowledge to long-term memory.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Active Recall</p>
              <p className="text-xs text-muted-foreground">
                Test yourself frequently. Actively recalling information is more effective than re-reading or highlighting.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
          <p>
            Your personalized study plan will help you balance these principles for optimal learning.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyPlanTips;
