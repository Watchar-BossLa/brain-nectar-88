
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FlashcardList from '@/components/flashcards/FlashcardList';
import FlashcardForm from '@/components/flashcards/FlashcardForm';
import FlashcardReview from '@/components/flashcards/FlashcardReview';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Flashcards: React.FC = () => {
  const [activeTab, setActiveTab] = useState("review");
  const [showForm, setShowForm] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Only redirect after auth state is loaded and user is not authenticated
    if (!loading && !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access your flashcards",
        variant: "destructive"
      });
      navigate("/signin");
    }
  }, [user, loading, navigate, toast]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </MainLayout>
    );
  }

  // Redirect handled by useEffect, this is just a fallback
  if (!user) {
    return null;
  }

  return (
    <MainLayout>
      <div className="container max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Flashcards</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="review">Review</TabsTrigger>
            <TabsTrigger value="manage">Manage Flashcards</TabsTrigger>
          </TabsList>
          
          <TabsContent value="review">
            <FlashcardReview />
          </TabsContent>
          
          <TabsContent value="manage">
            {showForm ? (
              <div className="mb-8">
                <FlashcardForm 
                  onSuccess={() => {
                    setShowForm(false);
                  }}
                />
                <div className="flex justify-center mt-4">
                  <Button variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <FlashcardList onAddNew={() => setShowForm(true)} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Flashcards;
