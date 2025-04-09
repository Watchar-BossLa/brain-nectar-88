import React, { useState, useEffect } from 'react';
import { useAICoachProfile } from '@/services/ai-coach';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { 
  Brain, 
  Eye, 
  Ear,
  BookOpen,
  HandMetal,
  Users,
  User,
  Calculator,
  CheckCircle2,
  Loader2,
  BarChart
} from 'lucide-react';

/**
 * Learning Style Assessment Component
 * Allows users to assess their learning style preferences
 * @returns {React.ReactElement} Learning style assessment component
 */
const LearningStyleAssessment = () => {
  const { user } = useAuth();
  const aiCoachProfile = useAICoachProfile();
  
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assessmentDialogOpen, setAssessmentDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [dominantStyles, setDominantStyles] = useState([]);
  
  // Assessment questions
  const questions = [
    {
      id: 'q1',
      text: 'When learning something new, I prefer to:',
      options: [
        { value: 'visual', text: 'See diagrams, charts, or demonstrations' },
        { value: 'auditory', text: 'Listen to explanations and discussions' },
        { value: 'reading', text: 'Read detailed instructions or explanations' },
        { value: 'kinesthetic', text: 'Try it out hands-on' }
      ]
    },
    {
      id: 'q2',
      text: 'I remember information best when:',
      options: [
        { value: 'visual', text: 'I can visualize it in my mind' },
        { value: 'reading', text: 'I\'ve written it down' },
        { value: 'auditory', text: 'I\'ve heard it explained' },
        { value: 'kinesthetic', text: 'I\'ve physically practiced it' }
      ]
    },
    {
      id: 'q3',
      text: 'When solving problems, I tend to:',
      options: [
        { value: 'logical', text: 'Break them down systematically' },
        { value: 'visual', text: 'Draw diagrams or visualize solutions' },
        { value: 'social', text: 'Discuss possible approaches with others' },
        { value: 'solitary', text: 'Think through them on my own' }
      ]
    },
    {
      id: 'q4',
      text: 'I learn most effectively when:',
      options: [
        { value: 'social', text: 'Working in a group' },
        { value: 'solitary', text: 'Studying alone' },
        { value: 'kinesthetic', text: 'Doing practical activities' },
        { value: 'reading', text: 'Taking detailed notes' }
      ]
    },
    {
      id: 'q5',
      text: 'When recalling information from a lecture, I most easily remember:',
      options: [
        { value: 'auditory', text: 'What the speaker said' },
        { value: 'visual', text: 'Visual aids that were used' },
        { value: 'reading', text: 'Notes I took during the lecture' },
        { value: 'kinesthetic', text: 'Examples or demonstrations that were given' }
      ]
    },
    {
      id: 'q6',
      text: 'When explaining a concept to someone else, I tend to:',
      options: [
        { value: 'visual', text: 'Draw a diagram or show a picture' },
        { value: 'auditory', text: 'Explain it verbally in detail' },
        { value: 'kinesthetic', text: 'Demonstrate it physically' },
        { value: 'logical', text: 'Explain the logical steps or reasoning' }
      ]
    },
    {
      id: 'q7',
      text: 'I prefer study materials that include:',
      options: [
        { value: 'visual', text: 'Charts, diagrams, and images' },
        { value: 'reading', text: 'Detailed written explanations' },
        { value: 'auditory', text: 'Audio recordings or lectures' },
        { value: 'kinesthetic', text: 'Interactive exercises or simulations' }
      ]
    },
    {
      id: 'q8',
      text: 'When making decisions, I typically:',
      options: [
        { value: 'logical', text: 'Analyze pros and cons systematically' },
        { value: 'social', text: 'Consider how it affects others and get input' },
        { value: 'solitary', text: 'Reflect on it independently' },
        { value: 'kinesthetic', text: 'Go with what feels right based on experience' }
      ]
    },
    {
      id: 'q9',
      text: 'I find it easiest to remember:',
      options: [
        { value: 'visual', text: 'Faces and places' },
        { value: 'auditory', text: 'Names and conversations' },
        { value: 'reading', text: 'Things I\'ve read' },
        { value: 'kinesthetic', text: 'Things I\'ve done' }
      ]
    },
    {
      id: 'q10',
      text: 'My ideal learning environment is:',
      options: [
        { value: 'solitary', text: 'Quiet and free from distractions' },
        { value: 'social', text: 'Interactive with opportunities for discussion' },
        { value: 'kinesthetic', text: 'Hands-on with practical activities' },
        { value: 'auditory', text: 'One where I can listen and discuss' }
      ]
    }
  ];
  
  // Load assessment data
  useEffect(() => {
    if (!user) return;
    
    const loadAssessment = async () => {
      try {
        setLoading(true);
        
        // Initialize service if needed
        if (!aiCoachProfile.initialized) {
          await aiCoachProfile.initialize(user.id);
        }
        
        // Load assessment
        const learningStyle = await aiCoachProfile.getLearningStyleAssessment();
        setAssessment(learningStyle);
        
        // Get dominant styles if assessment is completed
        if (learningStyle.assessment_completed) {
          const styles = await aiCoachProfile.getDominantLearningStyles(3);
          setDominantStyles(styles);
        }
      } catch (error) {
        console.error('Error loading learning style assessment:', error);
        toast({
          title: 'Error',
          description: 'Failed to load learning style assessment',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadAssessment();
  }, [user, aiCoachProfile]);
  
  // Handle answer selection
  const handleAnswerSelect = (value) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: value
    }));
  };
  
  // Handle next question
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };
  
  // Handle previous question
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };
  
  // Handle submitting assessment
  const handleSubmitAssessment = async () => {
    try {
      setSubmitting(true);
      
      // Calculate scores
      const scores = {
        visual: 0,
        auditory: 0,
        reading: 0,
        kinesthetic: 0,
        social: 0,
        solitary: 0,
        logical: 0
      };
      
      // Count answers for each style
      Object.values(answers).forEach(answer => {
        scores[answer] += 1;
      });
      
      // Normalize scores (0-1)
      const totalQuestions = questions.length;
      Object.keys(scores).forEach(key => {
        scores[key] = scores[key] / totalQuestions;
      });
      
      // Update assessment
      const updatedAssessment = await aiCoachProfile.updateLearningStyleAssessment({
        visual_score: scores.visual,
        auditory_score: scores.auditory,
        reading_score: scores.reading,
        kinesthetic_score: scores.kinesthetic,
        social_score: scores.social,
        solitary_score: scores.solitary,
        logical_score: scores.logical,
        assessment_completed: true,
        updated_at: new Date().toISOString()
      });
      
      setAssessment(updatedAssessment);
      
      // Get dominant styles
      const styles = await aiCoachProfile.getDominantLearningStyles(3);
      setDominantStyles(styles);
      
      // Close dialog
      setAssessmentDialogOpen(false);
      
      toast({
        title: 'Assessment Completed',
        description: 'Your learning style assessment has been saved',
      });
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast({
        title: 'Submission Failed',
        description: error.message || 'An error occurred while submitting the assessment',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  // Start assessment
  const handleStartAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setAssessmentDialogOpen(true);
  };
  
  // Get style icon
  const getStyleIcon = (style) => {
    switch (style) {
      case 'visual':
        return <Eye className="h-5 w-5 text-blue-500" />;
      case 'auditory':
        return <Ear className="h-5 w-5 text-green-500" />;
      case 'reading':
        return <BookOpen className="h-5 w-5 text-amber-500" />;
      case 'kinesthetic':
        return <HandMetal className="h-5 w-5 text-red-500" />;
      case 'social':
        return <Users className="h-5 w-5 text-purple-500" />;
      case 'solitary':
        return <User className="h-5 w-5 text-indigo-500" />;
      case 'logical':
        return <Calculator className="h-5 w-5 text-cyan-500" />;
      default:
        return <Brain className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get style description
  const getStyleDescription = (style) => {
    switch (style) {
      case 'visual':
        return 'You learn best through images, diagrams, and spatial understanding.';
      case 'auditory':
        return 'You learn best through listening, discussions, and verbal explanations.';
      case 'reading':
        return 'You learn best through reading and writing information.';
      case 'kinesthetic':
        return 'You learn best through physical activities and hands-on experiences.';
      case 'social':
        return 'You learn best in groups and through interaction with others.';
      case 'solitary':
        return 'You learn best through self-study and independent thinking.';
      case 'logical':
        return 'You learn best through logic, reasoning, and systems thinking.';
      default:
        return '';
    }
  };
  
  // Get style strategies
  const getStyleStrategies = (style) => {
    switch (style) {
      case 'visual':
        return [
          'Use diagrams, charts, and mind maps',
          'Color-code your notes',
          'Watch educational videos',
          'Visualize concepts in your mind'
        ];
      case 'auditory':
        return [
          'Record and listen to lectures',
          'Participate in group discussions',
          'Read material aloud',
          'Use verbal repetition for memorization'
        ];
      case 'reading':
        return [
          'Take detailed notes',
          'Rewrite key concepts in your own words',
          'Use written flashcards',
          'Create written summaries'
        ];
      case 'kinesthetic':
        return [
          'Use physical models or objects',
          'Take breaks for movement',
          'Study while walking',
          'Use gestures to remember concepts'
        ];
      case 'social':
        return [
          'Form study groups',
          'Teach concepts to others',
          'Participate in discussions',
          'Seek feedback from peers'
        ];
      case 'solitary':
        return [
          'Create a quiet, personal study space',
          'Set personal goals and track progress',
          'Use self-paced learning resources',
          'Schedule dedicated alone time for deep focus'
        ];
      case 'logical':
        return [
          'Organize information in a systematic way',
          'Look for patterns and relationships',
          'Break complex topics into smaller parts',
          'Use problem-solving techniques'
        ];
      default:
        return [];
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-48" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Style Profile</CardTitle>
        <CardDescription>
          {assessment?.assessment_completed
            ? 'Your personalized learning style profile'
            : 'Discover your preferred learning styles'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!assessment?.assessment_completed ? (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Learning Style Assessment</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Take a quick assessment to discover your preferred learning styles and get personalized study strategies.
            </p>
            <Button onClick={handleStartAssessment}>
              <Brain className="h-4 w-4 mr-2" />
              Start Assessment
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Your Learning Style Profile</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Visual</span>
                  </div>
                  <span>{Math.round(assessment.visual_score * 100)}%</span>
                </div>
                <Progress value={assessment.visual_score * 100} className="h-2" />
                
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <Ear className="h-4 w-4 mr-2 text-green-500" />
                    <span>Auditory</span>
                  </div>
                  <span>{Math.round(assessment.auditory_score * 100)}%</span>
                </div>
                <Progress value={assessment.auditory_score * 100} className="h-2" />
                
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-amber-500" />
                    <span>Reading/Writing</span>
                  </div>
                  <span>{Math.round(assessment.reading_score * 100)}%</span>
                </div>
                <Progress value={assessment.reading_score * 100} className="h-2" />
                
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <HandMetal className="h-4 w-4 mr-2 text-red-500" />
                    <span>Kinesthetic</span>
                  </div>
                  <span>{Math.round(assessment.kinesthetic_score * 100)}%</span>
                </div>
                <Progress value={assessment.kinesthetic_score * 100} className="h-2" />
                
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-purple-500" />
                    <span>Social</span>
                  </div>
                  <span>{Math.round(assessment.social_score * 100)}%</span>
                </div>
                <Progress value={assessment.social_score * 100} className="h-2" />
                
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-indigo-500" />
                    <span>Solitary</span>
                  </div>
                  <span>{Math.round(assessment.solitary_score * 100)}%</span>
                </div>
                <Progress value={assessment.solitary_score * 100} className="h-2" />
                
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <Calculator className="h-4 w-4 mr-2 text-cyan-500" />
                    <span>Logical</span>
                  </div>
                  <span>{Math.round(assessment.logical_score * 100)}%</span>
                </div>
                <Progress value={assessment.logical_score * 100} className="h-2" />
              </div>
            </div>
            
            {dominantStyles.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">Your Dominant Learning Styles</h3>
                <div className="space-y-4">
                  {dominantStyles.map((style, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        {getStyleIcon(style)}
                        <div>
                          <h4 className="font-medium capitalize">{style} Learner</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {getStyleDescription(style)}
                          </p>
                          
                          <div className="mt-3">
                            <h5 className="text-sm font-medium mb-1">Recommended Strategies:</h5>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                              {getStyleStrategies(style).map((strategy, idx) => (
                                <li key={idx}>{strategy}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleStartAssessment}
        >
          {assessment?.assessment_completed ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retake Assessment
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Start Assessment
            </>
          )}
        </Button>
      </CardFooter>
      
      {/* Assessment Dialog */}
      <Dialog open={assessmentDialogOpen} onOpenChange={setAssessmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Learning Style Assessment</DialogTitle>
            <DialogDescription>
              Question {currentQuestion + 1} of {questions.length}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <Progress value={(currentQuestion / (questions.length - 1)) * 100} className="h-2" />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{questions[currentQuestion].text}</h3>
              
              <RadioGroup
                value={answers[questions[currentQuestion].id] || ''}
                onValueChange={handleAnswerSelect}
              >
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50">
                      <RadioGroupItem 
                        value={option.value} 
                        id={`option-${index}`} 
                        className="mt-0"
                      />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between">
            <div>
              <Button 
                variant="outline" 
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setAssessmentDialogOpen(false)}
              >
                Cancel
              </Button>
              {currentQuestion < questions.length - 1 ? (
                <Button 
                  onClick={handleNextQuestion}
                  disabled={!answers[questions[currentQuestion].id]}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmitAssessment}
                  disabled={!answers[questions[currentQuestion].id] || submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Complete Assessment'
                  )}
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default LearningStyleAssessment;
