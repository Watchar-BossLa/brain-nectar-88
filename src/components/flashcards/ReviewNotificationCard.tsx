
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClockIcon, BrainCircuitIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const ReviewNotificationCard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dueCount, setDueCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDueCards = async () => {
      try {
        setLoading(true);
        const now = new Date().toISOString();
        
        // Count flashcards that are due for review
        const { count, error } = await supabase
          .from('flashcards')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .lte('next_review_date', now);
        
        if (error) {
          throw error;
        }
        
        setDueCount(count || 0);
      } catch (error) {
        console.error('Error fetching due flashcards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDueCards();
    
    // Set up a timer to check for due cards every minute
    const timer = setInterval(fetchDueCards, 60000);
    
    return () => clearInterval(timer);
  }, [user]);

  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-28" />
        </CardFooter>
      </Card>
    );
  }

  if (dueCount === 0) {
    return null;
  }

  return (
    <Card className="mb-6 border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <ClockIcon className="h-5 w-5 text-primary" />
          Cards Due for Review
        </CardTitle>
        <CardDescription>
          You have {dueCount} flashcard{dueCount !== 1 ? 's' : ''} ready for review
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Regular reviews help strengthen your memory and improve retention.
          Study now to maintain optimal learning progress.
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => navigate('/flashcards/review')}
          className="gap-2"
        >
          <BrainCircuitIcon className="h-4 w-4" />
          Start Review
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReviewNotificationCard;
