import React, { useState, useEffect } from 'react';
import { useSpacedRepetition, useStudyItemGenerator } from '@/services/spaced-repetition';
import { useAuth } from '@/context/auth';
import MainLayout from '@/components/layout/MainLayout';
import { FlashcardReview, StudyStats, StudyDeckManager, DocumentToStudyItems } from '@/components/spaced-repetition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Brain, 
  BookOpen, 
  BarChart2, 
  FileText,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';

/**
 * Adaptive Spaced Repetition Page
 * Page for the adaptive spaced repetition system
 * @returns {React.ReactElement} Adaptive spaced repetition page
 */
const AdaptiveSpacedRepetition = () => {
  const { user } = useAuth();
  const spacedRepetition = useSpacedRepetition();
  const studyItemGenerator = useStudyItemGenerator();
  const [activeTab, setActiveTab] = useState('review');
  const [sessionId, setSessionId] = useState(null);
  const [startingSession, setStartingSession] = useState(false);
  const [sessionError, setSessionError] = useState(null);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  
  // Initialize services
  useEffect(() => {
    if (user) {
      spacedRepetition.initialize(user.id);
      studyItemGenerator.initialize();
    }
  }, [user, spacedRepetition, studyItemGenerator]);
  
  // Start a review session
  const handleStartSession = async () => {
    if (!user) return;
    
    try {
      setStartingSession(true);
      setSessionError(null);
      
      const options = {};
      
      // If a deck is selected, filter by deck items
      if (selectedDeck) {
        const deckItems = await studyItemGenerator.getDeckItems(selectedDeck.id);
        options.itemIds = deckItems.map(item => item.id);
      }
      
      const result = await spacedRepetition.startReviewSession(user.id, options);
      
      if (result.sessionId) {
        setSessionId(result.sessionId);
      } else {
        setSessionError('No items due for review');
      }
    } catch (err) {
      console.error('Error starting session:', err);
      setSessionError(err.message || 'Failed to start review session');
    } finally {
      setStartingSession(false);
    }
  };
  
  // Handle session completion
  const handleSessionComplete = (summary) => {
    console.log('Session complete:', summary);
    setSessionId(null);
  };
  
  // Handle deck selection
  const handleSelectDeck = (deck) => {
    setSelectedDeck(deck);
    setActiveTab('review');
  };
  
  // Handle document selection
  const handleSelectDocument = (document) => {
    setSelectedDocument(document);
    setActiveTab('create');
  };
  
  // Handle study item generation completion
  const handleGenerationComplete = (items) => {
    console.log('Generated items:', items);
    // Could show a success message or navigate to review tab
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-2">Adaptive Spaced Repetition</h1>
        <p className="text-lg mb-6">
          Optimize your learning with personalized review scheduling based on cognitive science
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Tabs defaultValue="stats" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="stats" className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Statistics</span>
                </TabsTrigger>
                <TabsTrigger value="decks" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Decks</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="stats">
                <StudyStats />
              </TabsContent>
              
              <TabsContent value="decks">
                <StudyDeckManager onSelectDeck={handleSelectDeck} />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="review" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span className="hidden sm:inline">Review</span>
                </TabsTrigger>
                <TabsTrigger value="create" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Create</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="review">
                {sessionId ? (
                  <FlashcardReview 
                    sessionId={sessionId} 
                    onComplete={handleSessionComplete} 
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Start Review Session</CardTitle>
                      <CardDescription>
                        Review items due for today using spaced repetition
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedDeck ? (
                        <div className="p-4 border rounded-md mb-4">
                          <div className="flex items-center">
                            <BookOpen className="h-5 w-5 text-primary mr-2" />
                            <div>
                              <h3 className="font-medium">{selectedDeck.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {selectedDeck.item_count} items in deck
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 border rounded-md mb-4">
                          <div className="flex items-center">
                            <Clock className="h-5 w-5 text-primary mr-2" />
                            <div>
                              <h3 className="font-medium">All Due Items</h3>
                              <p className="text-sm text-muted-foreground">
                                Review all items due for today
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {sessionError && (
                        <Alert variant="destructive" className="mb-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>{sessionError}</AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={handleStartSession} 
                        disabled={startingSession}
                        className="w-full"
                      >
                        {startingSession ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Starting...
                          </>
                        ) : (
                          'Start Review Session'
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="create">
                {selectedDocument ? (
                  <DocumentToStudyItems 
                    documentId={selectedDocument.id} 
                    onComplete={handleGenerationComplete} 
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Create Study Items</CardTitle>
                      <CardDescription>
                        Generate study items from documents or create them manually
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Document Selected</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Select a document from the Document Analysis page to generate study items.
                        </p>
                        <Button asChild>
                          <a href="/document-analysis">Go to Document Analysis</a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdaptiveSpacedRepetition;
