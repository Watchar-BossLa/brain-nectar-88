
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSessionHistory } from '../../hooks/adaptive-quiz/useSessionHistory';
import { format, parseISO } from 'date-fns';
import { ArrowLeft, Clock, Calendar, Award, Target, BookOpen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Import the components we need from the results folder
import PerformanceByTopic from '../results/PerformanceByTopic';
import PerformanceByDifficulty from '../results/PerformanceByDifficulty';
import PerformanceChart from '../results/PerformanceChart';
import ScoreSummary from '../results/ScoreSummary';

interface SessionDetailProps {
  sessionId: string;
  onBack: () => void;
}

const SessionDetail: React.FC<SessionDetailProps> = ({ sessionId, onBack }) => {
  const { getSession } = useSessionHistory();
  const session = getSession(sessionId);
  
  if (!session) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium">Session not found</h3>
            <p className="text-muted-foreground mt-2">The requested quiz session could not be found.</p>
            <Button onClick={onBack} variant="outline" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to History
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const { results, answeredQuestions, selectedTopics, initialDifficulty } = session;
  const formattedDate = format(parseISO(session.date), 'MMMM d, yyyy');
  const formattedTime = format(parseISO(session.date), 'h:mm a');
  const timeInMinutes = Math.floor(results.timeSpent / 60000);
  const timeInSeconds = Math.floor((results.timeSpent % 60000) / 1000);
  
  const scorePercentage = results.questionsAttempted > 0 
    ? Math.round((results.correctAnswers / results.questionsAttempted) * 100) 
    : 0;
    
  const scoreData = [
    { name: 'Correct', value: results.correctAnswers, color: '#10b981' },
    { name: 'Incorrect', value: results.incorrectAnswers, color: '#ef4444' },
    { name: 'Skipped', value: results.skippedQuestions, color: '#d1d5db' }
  ];
  
  const difficultyLabel = ['Easy', 'Medium', 'Hard'][initialDifficulty - 1];
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onBack}
              className="mb-2 -ml-2 text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to History
            </Button>
            <CardTitle>Session Results</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              {formattedDate} at {formattedTime}
            </CardDescription>
          </div>
          <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium flex items-center">
            <Award className="h-4 w-4 mr-1" />
            {difficultyLabel} Difficulty
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Summary */}
        <ScoreSummary
          scorePercentage={scorePercentage}
          correctAnswers={results.correctAnswers}
          questionsAttempted={results.questionsAttempted}
          incorrectAnswers={results.incorrectAnswers}
          skippedQuestions={results.skippedQuestions}
          timeInMinutes={timeInMinutes}
          timeInSeconds={timeInSeconds}
        />
        
        <Separator />
        
        {/* Topics */}
        <div className="space-y-3">
          <h3 className="font-medium flex items-center">
            <Target className="h-4 w-4 mr-2" /> Topics Covered
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedTopics.length > 0 ? (
              selectedTopics.map((topic, index) => (
                <span 
                  key={index}
                  className="bg-muted rounded-full px-3 py-1 text-sm"
                >
                  {topic}
                </span>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">All topics</span>
            )}
          </div>
        </div>
        
        <Separator />
        
        {/* Performance details */}
        <div>
          <h3 className="font-medium mb-3 flex items-center">
            <Target className="h-4 w-4 mr-2" /> Performance by Topic
          </h3>
          <PerformanceByTopic topics={results.performanceByTopic} />
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-4 flex items-center">
              <BookOpen className="h-4 w-4 mr-2" /> Performance Breakdown
            </h3>
            <PerformanceChart scoreData={scoreData} />
          </div>
          
          <div>
            <h3 className="font-medium mb-4 flex items-center">
              <Target className="h-4 w-4 mr-2" /> Performance by Difficulty
            </h3>
            <PerformanceByDifficulty difficulties={results.performanceByDifficulty} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionDetail;
