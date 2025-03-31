
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function TestTabContent({ handleTestTask }: { handleTestTask: () => Promise<void> }) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  
  const handleTest = async () => {
    setIsLoading(true);
    try {
      // Get current user session using the correct Supabase v2 API
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;
      
      if (!session) {
        setResult('Error: No authenticated user session found');
        return;
      }
      
      // Test agent system task
      await handleTestTask();
      
      // Test flashcard stats
      const testStats = {
        flashcard_id: '123e4567-e89b-12d3-a456-426614174000',
        retention_rate: 0.85,
        review_count: 5,
        mastery_level: 0.7
      };
      
      setResult(JSON.stringify({
        message: 'Test tasks submitted successfully',
        userId: session.user.id,
        testStats
      }, null, 2));
      
    } catch (error) {
      console.error('Test error:', error);
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Agent System</CardTitle>
        <CardDescription>
          Run test tasks to verify the agent system is working correctly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button 
            onClick={handleTest} 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Running Tests...
              </>
            ) : (
              'Run Test Tasks'
            )}
          </Button>
        </div>
        
        {result && (
          <div className="space-y-2">
            <Label htmlFor="result">Test Result</Label>
            <Textarea
              id="result"
              value={result}
              readOnly
              className="font-mono h-64"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
