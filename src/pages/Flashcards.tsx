
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpenCheck, Plus, Clock, BrainCircuit } from 'lucide-react';
import FlashcardList from '@/components/flashcards/FlashcardList';
import FlashcardForm from '@/components/flashcards/FlashcardForm';
import SpacedRepetitionCard from '@/components/flashcards/SpacedRepetitionCard';
import { useAuth } from '@/context/AuthContext';
import { spacedRepetitionService } from '@/services/flashcards/spacedRepetitionService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Flashcards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [dueFlashcards, setDueFlashcards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewing, setIsReviewing] = useState(false);
  const [stats, setStats] = useState({
    totalCards: 0,
    masteredCards: 0,
    dueCards: 0,
    averageDifficulty: 0,
    reviewsToday: 0
  });

  useEffect(() => {
    if (user) {
      fetchFlashcards();
      fetchDueFlashcards();
      fetchStats();
    }
  }, [user]);

  const fetchFlashcards = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setFlashcards(data || []);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      toast({
        title: 'Error fetching flashcards',
        description: 'There was a problem loading your flashcards.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDueFlashcards = async () => {
    if (!user) return;
    
    try {
      const dueCards = await spacedRepetitionService.getDueFlashcards(user.id);
      setDueFlashcards(dueCards);
    } catch (error) {
      console.error('Error fetching due flashcards:', error);
    }
  };
  
  const fetchStats = async () => {
    if (!user) return;
    
    try {
      const flashcardStats = await spacedRepetitionService.getFlashcardStats(user.id);
      setStats(flashcardStats);
    } catch (error) {
      console.error('Error fetching flashcard stats:', error);
    }
  };

  const handleCreateFlashcard = () => {
    setIsCreating(true);
    setActiveTab('create');
  };

  const handleFlashcardCreated = () => {
    setIsCreating(false);
    setActiveTab('all');
    fetchFlashcards();
    fetchDueFlashcards();
    fetchStats();
    
    toast({
      title: 'Flashcard created',
      description: 'Your new flashcard has been added.',
    });
  };

  const handleStartReview = () => {
    if (dueFlashcards.length === 0) {
      toast({
        title: 'No cards to review',
        description: 'You don\'t have any flashcards due for review right now.',
      });
      return;
    }
    
    setIsReviewing(true);
    setActiveTab('review');
  };

  const handleCompleteReview = () => {
    setIsReviewing(false);
    fetchDueFlashcards();
    fetchStats();
    setActiveTab('all');
    
    toast({
      title: 'Review complete',
      description: 'Your progress has been saved.',
    });
  };

  const handleUpdateStats = () => {
    fetchStats();
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Flashcards</h1>
            <Button onClick={handleCreateFlashcard} disabled={isCreating}>
              <Plus className="mr-2 h-4 w-4" /> Create Flashcard
            </Button>
          </div>
          
          {/* Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <BrainCircuit className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Cards</p>
                    <h3 className="text-2xl font-bold">{stats.totalCards}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <BookOpenCheck className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Mastered</p>
                    <h3 className="text-2xl font-bold">{stats.masteredCards}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Due for Review</p>
                    <h3 className="text-2xl font-bold">{stats.dueCards}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 flex items-center justify-center bg-blue-100 text-blue-500 rounded-md font-bold text-lg">
                    {stats.reviewsToday}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reviews Today</p>
                    <div className="text-2xl font-bold flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-2">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${stats.averageDifficulty * 20}%` }}
                        ></div>
                      </div>
                      {(stats.averageDifficulty || 0).toFixed(1)}/5
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Flashcards</TabsTrigger>
              <TabsTrigger value="review" disabled={isReviewing}>
                Review Due ({dueFlashcards.length})
              </TabsTrigger>
              <TabsTrigger value="create" disabled={!isCreating}>Create</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {dueFlashcards.length > 0 && (
                <Card className="mb-6 border-yellow-200 bg-yellow-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Time to review!</CardTitle>
                    <CardDescription>
                      You have {dueFlashcards.length} flashcards due for review.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button onClick={handleStartReview} className="bg-yellow-500 hover:bg-yellow-600">
                      Start Review Session
                    </Button>
                  </CardFooter>
                </Card>
              )}
              
              <FlashcardList 
                flashcards={flashcards} 
                isLoading={isLoading} 
                onFlashcardsUpdated={fetchFlashcards}
              />
            </TabsContent>
            
            <TabsContent value="review">
              {isReviewing && (
                <SpacedRepetitionCard 
                  flashcards={dueFlashcards}
                  onComplete={handleCompleteReview}
                  onUpdateStats={handleUpdateStats}
                />
              )}
            </TabsContent>
            
            <TabsContent value="create">
              {isCreating && (
                <FlashcardForm 
                  onFlashcardCreated={handleFlashcardCreated}
                  onCancel={() => {
                    setIsCreating(false);
                    setActiveTab('all');
                  }}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Flashcards;
