
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FlashcardList from '@/components/flashcards/FlashcardList';
import FlashcardForm from '@/components/flashcards/FlashcardForm';
import FlashcardReview from '@/components/flashcards/FlashcardReview';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Flashcards: React.FC = () => {
  const [activeTab, setActiveTab] = useState("review");
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-6">Please sign in to access your flashcards.</p>
          <Button onClick={() => navigate("/signin")}>Sign In</Button>
        </div>
      </MainLayout>
    );
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
