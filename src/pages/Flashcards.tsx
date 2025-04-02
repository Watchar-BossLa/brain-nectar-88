
import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useFlashcardsPage } from '@/hooks/useFlashcardsPage';
import { deleteFlashcard } from '@/services/spacedRepetition';
import { convertToSupabaseFlashcard } from '@/components/flashcards/utils/flashcardTypeConverter';
import { loadDefaultFlashcardsForUser } from '@/services/flashcards/defaultFlashcards';
import { useAuth } from '@/context/auth';

// Component imports
import FlashcardStats from '@/components/flashcards/FlashcardStats';
import FlashcardsHeader from '@/components/flashcards/FlashcardsHeader';
import AllFlashcardsTab from '@/components/flashcards/tabs/AllFlashcardsTab';
import DueFlashcardsTab from '@/components/flashcards/tabs/DueFlashcardsTab';
import CreateFlashcardTab from '@/components/flashcards/tabs/CreateFlashcardTab';
import ReviewFlashcardsTab from '@/components/flashcards/tabs/ReviewFlashcardsTab';

const Flashcards = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  const [loadingDefaults, setLoadingDefaults] = useState(false);
  
  const {
    flashcards,
    dueFlashcards,
    stats,
    loading: isLoading,
    refreshFlashcards
  } = useFlashcardsPage();
  
  const { toast } = useToast();
  const { user } = useAuth();
  const [isAdvancedForm, setIsAdvancedForm] = useState(false);
  
  useEffect(() => {
    const checkAndLoadDefaultFlashcards = async () => {
      if (!user) return;
      
      if (user && !isLoading && flashcards.length === 0 && !loadingDefaults) {
        console.log('No flashcards found, attempting to load defaults...');
        setLoadingDefaults(true);
        
        try {
          const loaded = await loadDefaultFlashcardsForUser(user.id);
          if (loaded) {
            console.log('Default flashcards loaded successfully');
            toast({
              title: "Default flashcards loaded",
              description: "We've added some starter flashcards to help you get started!",
              duration: 5000,
            });
            await refreshFlashcards();
          } else {
            console.error("Failed to load default flashcards");
            toast({
              title: "Error",
              description: "Could not load default flashcards. Please try refreshing the page.",
              variant: "destructive",
              duration: 5000,
            });
          }
        } catch (error) {
          console.error("Error loading default flashcards:", error);
          toast({
            title: "Error",
            description: "Failed to load default flashcards. Please try again later.",
            variant: "destructive",
            duration: 5000,
          });
        } finally {
          setLoadingDefaults(false);
        }
      }
    };
    
    checkAndLoadDefaultFlashcards();
  }, [user, isLoading, flashcards.length, toast, refreshFlashcards]);
  
  const handleDeleteFlashcard = async (id: string) => {
    try {
      const { error } = await deleteFlashcard(id);
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Flashcard deleted successfully.'
      });
      
      handleUpdateStats();
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete flashcard',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateStats = () => {
    refreshFlashcards();
  };

  const handleCreateFlashcard = () => {
    setIsCreating(true);
    setActiveTab('create');
  };

  const handleFlashcardCreated = () => {
    setIsCreating(false);
    setActiveTab('all');
    handleUpdateStats();
  };

  const handleStartReview = () => {
    setActiveTab('review');
  };

  const handleCreateSimpleFlashcard = () => {
    setIsAdvancedForm(false);
    handleCreateFlashcard();
  };

  const handleCreateAdvancedFlashcard = () => {
    setIsAdvancedForm(true);
    handleCreateFlashcard();
  };

  const supabaseFlashcards = flashcards.map(convertToSupabaseFlashcard);
  const supaDueFlashcards = dueFlashcards.map(convertToSupabaseFlashcard);

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        <FlashcardsHeader 
          isCreating={isCreating}
          onCreateSimpleFlashcard={handleCreateSimpleFlashcard}
          onCreateAdvancedFlashcard={handleCreateAdvancedFlashcard}
        />
        
        <FlashcardStats stats={stats} />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Cards</TabsTrigger>
            <TabsTrigger value="due" disabled={dueFlashcards.length === 0}>
              Due ({dueFlashcards.length})
            </TabsTrigger>
            <TabsTrigger value="create" disabled={!isCreating}>Create</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>
          
          {loadingDefaults && flashcards.length === 0 && (
            <div className="mt-6 p-6 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-muted-foreground">Loading starter flashcards...</p>
              </div>
            </div>
          )}
          
          <TabsContent value="all" className="mt-6">
            <AllFlashcardsTab 
              isLoading={isLoading || loadingDefaults}
              flashcards={supabaseFlashcards}
              onDeleteFlashcard={handleDeleteFlashcard}
              onCardUpdated={handleUpdateStats}
              onCreateSimpleFlashcard={handleCreateSimpleFlashcard}
              onCreateAdvancedFlashcard={handleCreateAdvancedFlashcard}
            />
          </TabsContent>
          
          <TabsContent value="due" className="mt-6">
            <DueFlashcardsTab 
              flashcards={supaDueFlashcards}
              onStartReview={handleStartReview}
              onDeleteFlashcard={handleDeleteFlashcard}
              onCardUpdated={handleUpdateStats}
              onCreateSimpleFlashcard={handleCreateSimpleFlashcard}
              onCreateAdvancedFlashcard={handleCreateAdvancedFlashcard}
            />
          </TabsContent>
          
          <TabsContent value="create" className="mt-6">
            <CreateFlashcardTab 
              isAdvancedForm={isAdvancedForm}
              onFlashcardCreated={handleFlashcardCreated}
              onCancel={() => setIsCreating(false)}
            />
          </TabsContent>
          
          <TabsContent value="review" className="mt-6">
            <ReviewFlashcardsTab 
              onComplete={() => {
                handleUpdateStats();
                setActiveTab('all');
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Flashcards;
