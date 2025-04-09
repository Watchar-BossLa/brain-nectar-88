import React, { useState } from 'react';
import { useLearningProfile } from '@/services/learning-recommendations';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import { Loader2, BrainCircuit, Eye, Headphones, BookOpen, Hammer } from 'lucide-react';

/**
 * Learning Style Assessment Component
 * @param {Object} props - Component props
 * @param {Function} props.onComplete - Completion callback
 * @returns {React.ReactElement} Learning style assessment component
 */
const LearningStyleAssessment = ({ onComplete }) => {
  const learningProfile = useLearningProfile();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  
  // Get questions
  const questions = learningProfile.getLearningStyleQuestions();
  const totalSteps = questions.length;
  
  // Handle answer change
  const handleAnswerChange = (value) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentStep].id]: parseInt(value)
    }));
  };
  
  // Handle next step
  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  // Handle assessment completion
  const handleComplete = async () => {
    try {
      setLoading(true);
      
      // Process assessment results
      const assessmentResults = learningProfile.processLearningStyleAssessment(answers);
      
      // Save results to profile
      await learningProfile.saveLearningStyleAssessment(assessmentResults);
      
      setResults(assessmentResults);
      
      toast({
        title: 'Assessment Complete',
        description: 'Your learning style profile has been updated',
      });
      
      if (onComplete) {
        onComplete(assessmentResults);
      }
    } catch (error) {
      console.error('Error completing assessment:', error);
      toast({
        title: 'Error',
        description: 'Failed to save assessment results',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Get learning style icon
  const getLearningStyleIcon = (style) => {
    switch (style) {
      case 'visual':
        return <Eye className="h-6 w-6" />;
      case 'auditory':
        return <Headphones className="h-6 w-6" />;
      case 'reading':
        return <BookOpen className="h-6 w-6" />;
      case 'kinesthetic':
        return <Hammer className="h-6 w-6" />;
      default:
        return <BrainCircuit className="h-6 w-6" />;
    }
  };
  
  // Get learning style description
  const getLearningStyleDescription = (style) => {
    switch (style) {
      case 'visual':
        return 'You learn best through visual aids like charts, diagrams, and videos. Visual information helps you understand and remember concepts more effectively.';
      case 'auditory':
        return 'You learn best through listening and discussion. Verbal explanations, lectures, and talking through concepts help you understand and remember information.';
      case 'reading':
        return 'You learn best through reading and writing. Text-based information and taking notes helps you understand and remember concepts more effectively.';
      case 'kinesthetic':
        return 'You learn best through hands-on activities and physical experiences. Practical application helps you understand and remember concepts more effectively.';
      default:
        return 'You have a balanced learning style that incorporates multiple approaches to learning.';
    }
  };
  
  // Render results
  if (results) {
    const dominantStyle = results.dominantStyle;
    const scores = results.scores;
    
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6" />
            Your Learning Style Profile
          </CardTitle>
          <CardDescription>
            Based on your responses, we've identified your learning style preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center p-4 border rounded-lg bg-muted/50">
            <div className="p-3 rounded-full bg-primary/10 mb-2">
              {getLearningStyleIcon(dominantStyle)}
            </div>
            <h3 className="text-lg font-medium capitalize mb-1">{dominantStyle} Learner</h3>
            <p className="text-sm text-center text-muted-foreground">
              {getLearningStyleDescription(dominantStyle)}
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-md font-medium">Your Learning Style Breakdown</h3>
            
            <div className="space-y-3">
              {Object.entries(scores).map(([style, score]) => (
                <div key={style} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {getLearningStyleIcon(style)}
                      <span className="ml-2 capitalize">{style}</span>
                    </div>
                    <span>{Math.round(score * 100)}%</span>
                  </div>
                  <Progress value={score * 100} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => onComplete(results)} className="w-full">
            Continue
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  // Render assessment
  const currentQuestion = questions[currentStep];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Learning Style Assessment</CardTitle>
        <CardDescription>
          Answer these questions to help us understand your learning preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span>Question {currentStep + 1} of {totalSteps}</span>
          <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}% complete</span>
        </div>
        <Progress value={((currentStep + 1) / totalSteps) * 100} className="h-2" />
        
        <div className="py-4">
          <h3 className="text-lg font-medium mb-4">{currentQuestion.text}</h3>
          
          <RadioGroup 
            value={answers[currentQuestion.id]?.toString() || ''} 
            onValueChange={handleAnswerChange}
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="r1" />
                <Label htmlFor="r1">Strongly Disagree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="r2" />
                <Label htmlFor="r2">Disagree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="r3" />
                <Label htmlFor="r3">Neutral</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4" id="r4" />
                <Label htmlFor="r4">Agree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5" id="r5" />
                <Label htmlFor="r5">Strongly Agree</Label>
              </div>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevStep}
          disabled={currentStep === 0 || loading}
        >
          Previous
        </Button>
        <Button 
          onClick={handleNextStep}
          disabled={!answers[currentQuestion.id] || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : currentStep === totalSteps - 1 ? (
            'Complete'
          ) : (
            'Next'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LearningStyleAssessment;
