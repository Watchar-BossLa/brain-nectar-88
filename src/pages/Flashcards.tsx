
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BookOpen, BrainCircuit, Sigma } from 'lucide-react';
import FlashcardList from '@/components/flashcards/FlashcardList';
import AdvancedFlashcardForm from '@/components/flashcards/AdvancedFlashcardForm';
import SpacedRepetitionCard from '@/components/flashcards/SpacedRepetitionCard';
import FlashcardStats from '@/components/flashcards/FlashcardStats';
import ReviewNotificationCard from '@/components/flashcards/ReviewNotificationCard';
import { useFlashcardsPage } from '@/hooks/useFlashcardsPage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Flashcards = () => {
  const {
    activeTab,
    setActiveTab,
    isCreating,
    flashcards,
    dueFlashcards,
    currentReviewCard,
    isLoading,
    isReviewing,
    stats,
    handleCreateFlashcard,
    handleFlashcardCreated,
    handleStartReview,
    handleCompleteReview,
    handleUpdateStats,
    fetchFlashcards
  } = useFlashcardsPage();

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <BookOpen className="h-4 w-4 mr-2 text-primary" />
            Spaced Repetition
          </CardTitle>
          <CardDescription>Optimized learning schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Due today:</span>
              <span className="font-semibold">{dueFlashcards.length}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-muted-foreground">Mastered:</span>
              <span className="font-semibold">{stats.masteredCards} of {stats.totalCards}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-muted-foreground">Reviews today:</span>
              <span className="font-semibold">{stats.reviewsToday}</span>
            </div>
            <Button 
              size="sm" 
              className="mt-4"
              onClick={handleStartReview}
              disabled={dueFlashcards.length === 0}
            >
              Review Now
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <BrainCircuit className="h-4 w-4 mr-2 text-primary" />
            Memory Metrics
          </CardTitle>
          <CardDescription>Learning effectiveness</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average difficulty:</span>
              <span className="font-semibold">{stats.averageDifficulty.toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-muted-foreground">Mastery rate:</span>
              <span className="font-semibold">{((stats.masteredCards / Math.max(stats.totalCards, 1)) * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-muted-foreground">Retention goal:</span>
              <span className="font-semibold">85%</span>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              className="mt-4"
              onClick={() => setActiveTab('all')}
            >
              View All Cards
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Sigma className="h-4 w-4 mr-2 text-primary" />
            Formula Cards
          </CardTitle>
          <CardDescription>LaTeX & financial statements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <div className="text-sm text-muted-foreground">
              Create specialized flashcards with:
            </div>
            <ul className="text-sm mt-1 space-y-1">
              <li>• LaTeX formula support</li>
              <li>• Financial statement visualization</li>
              <li>• Interactive learning components</li>
            </ul>
            <Button 
              size="sm" 
              variant="secondary"
              className="mt-4"
              onClick={handleCreateFlashcard}
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> 
              Create Advanced Card
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <MainLayout>
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Advanced Flashcards</h1>
            <Button onClick={handleCreateFlashcard} disabled={isCreating}>
              <Plus className="mr-2 h-4 w-4" /> Create Flashcard
            </Button>
          </div>
          
          {renderDashboard()}
          
          {/* Stats Dashboard */}
          <FlashcardStats stats={stats} />
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Flashcards</TabsTrigger>
              <TabsTrigger value="review" disabled={isReviewing}>
                Review Due ({dueFlashcards.length})
              </TabsTrigger>
              <TabsTrigger value="create" disabled={!isCreating}>Create</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <ReviewNotificationCard 
                dueCount={dueFlashcards.length} 
                onStartReview={handleStartReview} 
              />
              
              <FlashcardList 
                onAddNew={handleCreateFlashcard}
                isLoading={isLoading}
                onFlashcardsUpdated={fetchFlashcards}
              />
            </TabsContent>
            
            <TabsContent value="review">
              {isReviewing && currentReviewCard && (
                <SpacedRepetitionCard 
                  flashcard={currentReviewCard}
                  onComplete={handleCompleteReview}
                  onUpdateStats={handleUpdateStats}
                />
              )}
            </TabsContent>
            
            <TabsContent value="create">
              {isCreating && (
                <AdvancedFlashcardForm 
                  onSuccess={handleFlashcardCreated}
                  onCancel={() => {
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
