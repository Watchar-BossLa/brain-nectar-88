
import React from 'react';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { useFlashcardStats } from '@/hooks/flashcards/useFlashcardStats';

const Dashboard = () => {
  const { user } = useAuth();
  const { stats, loading } = useFlashcardStats();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Flashcards Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Flashcards</CardTitle>
            <CardDescription>Your flashcard statistics</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Flashcards</p>
                    <p className="text-2xl font-semibold">{stats.totalCards}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Due Today</p>
                    <p className="text-2xl font-semibold">{stats.dueCards}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Mastered</p>
                    <p className="text-2xl font-semibold">{stats.masteredCards}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reviews Today</p>
                    <p className="text-2xl font-semibold">{stats.reviewsToday}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link to="/flashcard-review">
                    <Button className="w-full">Review Flashcards</Button>
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
