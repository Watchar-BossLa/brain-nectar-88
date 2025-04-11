import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Clock, Calendar, BarChart, CheckCircle, X, ArrowRight, Lightbulb } from 'lucide-react';

/**
 * SpacedRepetitionSystem component for adaptive learning
 * @returns {React.ReactElement} SpacedRepetitionSystem component
 */
const SpacedRepetitionSystem = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('study');
  
  // State for flashcards
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studySession, setStudySession] = useState({
    cardsReviewed: 0,
    cardsCorrect: 0,
    timeSpent: 0,
    isActive: false
  });
  
  // Sample flashcard data
  const [flashcards, setFlashcards] = useState([
    {
      id: 1,
      question: 'What is the law of supply?',
      answer: 'The law of supply states that, all else equal, an increase in price results in an increase in quantity supplied.',
      difficulty: 'medium',
      subject: 'Economics',
      topic: 'Microeconomics',
      lastReviewed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      nextReview: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      interval: 9, // days
      easeFactor: 2.5,
      repetitions: 3
    },
    {
      id: 2,
      question: 'What is the capital of France?',
      answer: 'Paris',
      difficulty: 'easy',
      subject: 'Geography',
      topic: 'European Geography',
      lastReviewed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      nextReview: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      interval: 7, // days
      easeFactor: 2.8,
      repetitions: 5
    },
    {
      id: 3,
      question: 'What is the Pythagorean theorem?',
      answer: 'In a right triangle, the square of the length of the hypotenuse equals the sum of the squares of the lengths of the other two sides (a² + b² = c²).',
      difficulty: 'medium',
      subject: 'Mathematics',
      topic: 'Geometry',
      lastReviewed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      nextReview: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
      interval: 5, // days
      easeFactor: 2.3,
      repetitions: 4
    },
    {
      id: 4,
      question: 'What is photosynthesis?',
      answer: 'Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with carbon dioxide and water, generating oxygen as a byproduct.',
      difficulty: 'hard',
      subject: 'Biology',
      topic: 'Plant Biology',
      lastReviewed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      nextReview: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      interval: 4, // days
      easeFactor: 2.1,
      repetitions: 2
    },
    {
      id: 5,
      question: 'What is the First Law of Thermodynamics?',
      answer: 'The First Law of Thermodynamics states that energy cannot be created or destroyed, only transferred or converted from one form to another.',
      difficulty: 'hard',
      subject: 'Physics',
      topic: 'Thermodynamics',
      lastReviewed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      nextReview: new Date(), // today
      interval: 5, // days
      easeFactor: 2.0,
      repetitions: 3
    }
  ]);
  
  // Get current flashcard
  const currentCard = flashcards[currentCardIndex];
  
  // Get due cards
  const dueCards = flashcards.filter(card => card.nextReview <= new Date());
  
  // Get cards by subject
  const cardsBySubject = flashcards.reduce((acc, card) => {
    acc[card.subject] = (acc[card.subject] || 0) + 1;
    return acc;
  }, {});
  
  // Get cards by difficulty
  const cardsByDifficulty = flashcards.reduce((acc, card) => {
    acc[card.difficulty] = (acc[card.difficulty] || 0) + 1;
    return acc;
  }, {});
  
  // Start study session
  const startStudySession = () => {
    setStudySession({
      ...studySession,
      isActive: true,
      cardsReviewed: 0,
      cardsCorrect: 0,
      timeSpent: 0
    });
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };
  
  // End study session
  const endStudySession = () => {
    setStudySession({
      ...studySession,
      isActive: false
    });
  };
  
  // Show answer
  const handleShowAnswer = () => {
    setShowAnswer(true);
  };
  
  // Rate card difficulty and update spaced repetition algorithm
  const rateCard = (rating) => {
    // Update card with new spaced repetition parameters
    const updatedCards = [...flashcards];
    const card = updatedCards[currentCardIndex];
    
    // SM-2 Algorithm implementation
    let newEaseFactor = card.easeFactor;
    let newInterval = card.interval;
    let newRepetitions = card.repetitions;
    
    // Update ease factor based on rating (0-5 scale)
    newEaseFactor = Math.max(1.3, card.easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02)));
    
    // Update repetitions and interval
    if (rating < 3) {
      // If rating is less than 3, reset repetitions
      newRepetitions = 0;
      newInterval = 1;
    } else {
      // If rating is 3 or higher, increase repetitions and interval
      newRepetitions = card.repetitions + 1;
      
      if (newRepetitions === 1) {
        newInterval = 1;
      } else if (newRepetitions === 2) {
        newInterval = 6;
      } else {
        newInterval = Math.round(card.interval * card.easeFactor);
      }
    }
    
    // Update card
    updatedCards[currentCardIndex] = {
      ...card,
      lastReviewed: new Date(),
      nextReview: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000),
      interval: newInterval,
      easeFactor: newEaseFactor,
      repetitions: newRepetitions
    };
    
    // Update flashcards
    setFlashcards(updatedCards);
    
    // Update study session
    setStudySession({
      ...studySession,
      cardsReviewed: studySession.cardsReviewed + 1,
      cardsCorrect: rating >= 3 ? studySession.cardsCorrect + 1 : studySession.cardsCorrect
    });
    
    // Move to next card or end session
    if (currentCardIndex < dueCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      endStudySession();
    }
  };
  
  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Render study session
  const renderStudySession = () => {
    if (!studySession.isActive) {
      return (
        <div className="text-center py-12">
          <Brain className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-medium mb-2">Ready to Study?</h3>
          <p className="text-muted-foreground mb-6">
            You have {dueCards.length} cards due for review today.
          </p>
          <Button onClick={startStudySession} disabled={dueCards.length === 0}>
            Start Study Session
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Study Session</h3>
            <p className="text-sm text-muted-foreground">
              Card {currentCardIndex + 1} of {dueCards.length}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={endStudySession}>
            End Session
          </Button>
        </div>
        
        <Card className="border-2 border-primary/20">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Badge variant="outline">{currentCard.subject}</Badge>
                <Badge variant="outline">{currentCard.topic}</Badge>
              </div>
              
              <div className="min-h-[200px] flex items-center justify-center p-4 bg-muted rounded-md">
                <div className="text-center">
                  <h3 className="text-xl font-medium mb-2">{currentCard.question}</h3>
                  {showAnswer && (
                    <div className="mt-6 p-4 bg-primary/10 rounded-md">
                      <p>{currentCard.answer}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {!showAnswer ? (
                <Button className="w-full" onClick={handleShowAnswer}>
                  Show Answer
                </Button>
              ) : (
                <div className="space-y-2">
                  <p className="text-center text-sm text-muted-foreground mb-2">
                    How well did you know this?
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    <Button variant="outline" className="border-red-500 hover:bg-red-500/10" onClick={() => rateCard(1)}>
                      <X className="h-4 w-4 mr-1" /> Not at all
                    </Button>
                    <Button variant="outline" className="border-orange-500 hover:bg-orange-500/10" onClick={() => rateCard(2)}>
                      Barely
                    </Button>
                    <Button variant="outline" className="border-yellow-500 hover:bg-yellow-500/10" onClick={() => rateCard(3)}>
                      Somewhat
                    </Button>
                    <Button variant="outline" className="border-green-500 hover:bg-green-500/10" onClick={() => rateCard(5)}>
                      <CheckCircle className="h-4 w-4 mr-1" /> Perfectly
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between text-sm text-muted-foreground">
          <div>
            Last reviewed: {formatDate(currentCard.lastReviewed)}
          </div>
          <div>
            Next review: {formatDate(currentCard.nextReview)}
          </div>
        </div>
      </div>
    );
  };
  
  // Render dashboard
  const renderDashboard = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Cards</p>
                  <p className="text-2xl font-bold">{flashcards.length}</p>
                </div>
                <Brain className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Due Today</p>
                  <p className="text-2xl font-bold">{dueCards.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mastery Level</p>
                  <p className="text-2xl font-bold">
                    {Math.round(
                      (flashcards.reduce((acc, card) => acc + card.repetitions, 0) / 
                      (flashcards.length * 5)) * 100
                    )}%
                  </p>
                </div>
                <BarChart className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Learning Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cards by Subject</span>
                </div>
                <div className="space-y-2">
                  {Object.entries(cardsBySubject).map(([subject, count]) => (
                    <div key={subject} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                        <span>{subject}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{count}</span>
                        <Progress value={(count / flashcards.length) * 100} className="w-24 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cards by Difficulty</span>
                </div>
                <div className="space-y-2">
                  {Object.entries(cardsByDifficulty).map(([difficulty, count]) => (
                    <div key={difficulty} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div 
                          className={`w-2 h-2 rounded-full mr-2 ${
                            difficulty === 'easy' ? 'bg-green-500' : 
                            difficulty === 'medium' ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`}
                        ></div>
                        <span className="capitalize">{difficulty}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{count}</span>
                        <Progress 
                          value={(count / flashcards.length) * 100} 
                          className={`w-24 h-2 ${
                            difficulty === 'easy' ? 'bg-green-500' : 
                            difficulty === 'medium' ? 'bg-yellow-500/50' : 
                            'bg-red-500/50'
                          }`} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {flashcards
                .sort((a, b) => a.nextReview - b.nextReview)
                .slice(0, 5)
                .map(card => (
                  <div key={card.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{card.question}</p>
                      <p className="text-sm text-muted-foreground">{card.subject} - {card.topic}</p>
                    </div>
                    <Badge variant={new Date() >= card.nextReview ? 'default' : 'outline'}>
                      {formatDate(card.nextReview)}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  // Render manage cards
  const renderManageCards = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Manage Flashcards</h3>
          <Button size="sm">
            Add New Card
          </Button>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {flashcards.map(card => (
                <div key={card.id} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{card.question}</p>
                      <p className="text-sm text-muted-foreground mt-1">{card.answer}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{card.subject}</Badge>
                      <Badge 
                        variant="outline" 
                        className={
                          card.difficulty === 'easy' ? 'border-green-500 text-green-500' : 
                          card.difficulty === 'medium' ? 'border-yellow-500 text-yellow-500' : 
                          'border-red-500 text-red-500'
                        }
                      >
                        {card.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                    <div>
                      Next review: {formatDate(card.nextReview)}
                    </div>
                    <div>
                      Interval: {card.interval} days
                    </div>
                    <div>
                      Repetitions: {card.repetitions}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="study" onValueChange={setActiveTab} value={activeTab}>
        <TabsList>
          <TabsTrigger value="study">Study</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="manage">Manage Cards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="study" className="pt-6">
          {renderStudySession()}
        </TabsContent>
        
        <TabsContent value="dashboard" className="pt-6">
          {renderDashboard()}
        </TabsContent>
        
        <TabsContent value="manage" className="pt-6">
          {renderManageCards()}
        </TabsContent>
      </Tabs>
      
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium">About Spaced Repetition</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Spaced repetition is an evidence-based learning technique that incorporates increasing intervals of time between reviews of previously learned material. 
                This system adapts to your performance, scheduling more frequent reviews for difficult cards and less frequent reviews for easier ones, 
                optimizing your learning efficiency and long-term retention.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpacedRepetitionSystem;
