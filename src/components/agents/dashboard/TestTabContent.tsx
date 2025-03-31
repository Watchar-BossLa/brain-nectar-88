
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { calculateFlashcardRetention } from '@/services/spacedRepetition/reviewStats';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { FlashcardLearningStats } from '@/services/spacedRepetition/reviewTypes';

interface TestTabContentProps {
  handleTestTask: () => Promise<void>;
}

export function TestTabContent({ handleTestTask }: TestTabContentProps) {
  const [isTestingSpacedRep, setIsTestingSpacedRep] = useState(false);
  const [spacedRepResult, setSpacedRepResult] = useState<any>(null);

  const testSpacedRepetition = async () => {
    setIsTestingSpacedRep(true);
    try {
      // Get current user ID directly from local storage as a fallback
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Create a valid flashcard object for testing
      const testFlashcard: FlashcardLearningStats = {
        flashcard_id: 'test-id',
        userId: user.id,
        easinessFactor: 2.5,
        interval: 1,
        repetitionCount: 0,
        lastReviewedAt: new Date().toISOString(),
        nextReviewAt: new Date().toISOString(),
        reviewCount: 0,
        masteryLevel: 0,
        retentionRate: 0,
        totalCards: 10
      };
      
      // Test the retention calculation
      const retentionValue = calculateFlashcardRetention(testFlashcard);
      setSpacedRepResult({ 
        retention: retentionValue,
        userId: user.id, 
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error testing spaced repetition:', error);
      setSpacedRepResult({ error: 'Failed to test spaced repetition system' });
    } finally {
      setIsTestingSpacedRep(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Test Agent Task</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Submit a test task to the agent system to verify functionality.
        </p>
        <Button onClick={handleTestTask}>
          Submit Test Task
        </Button>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Test Spaced Repetition</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Test the enhanced spaced repetition algorithm for flashcards.
        </p>
        <Button 
          onClick={testSpacedRepetition} 
          disabled={isTestingSpacedRep}
          variant="outline"
        >
          {isTestingSpacedRep ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            'Test Algorithm'
          )}
        </Button>
      </div>
      
      {spacedRepResult && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">Spaced Repetition Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto bg-muted p-2 rounded-md max-h-40">
              {JSON.stringify(spacedRepResult, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
