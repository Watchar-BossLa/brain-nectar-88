import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Brain, Clock, Calendar, BarChart, CheckCircle, X, ArrowRight, Lightbulb } from 'lucide-react';
import SpacedRepetitionSystem from '@/components/learning/spaced-repetition';

/**
 * SpacedRepetition page component
 * @returns {React.ReactElement} SpacedRepetition page component
 */
const SpacedRepetition = () => {
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Adaptive Spaced Repetition</h1>
            <p className="text-muted-foreground">
              Optimize your learning with scientifically-proven spaced repetition techniques
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <CardTitle>Optimized Learning</CardTitle>
              </div>
              <CardDescription>
                Learn more efficiently with algorithms that adapt to your performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our adaptive spaced repetition system uses the SM-2 algorithm to schedule reviews at optimal intervals,
                helping you remember more with less study time. The system adjusts based on how well you know each card,
                focusing your efforts where they're most needed.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <CardTitle>Long-Term Retention</CardTitle>
              </div>
              <CardDescription>
                Remember what you learn for months and years, not just days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                By reviewing information just before you're about to forget it, spaced repetition strengthens neural
                connections and moves knowledge into long-term memory. This approach is backed by decades of cognitive
                science research on how memory works.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                <CardTitle>Progress Tracking</CardTitle>
              </div>
              <CardDescription>
                Monitor your learning progress across all subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track your mastery level, review history, and upcoming reviews with detailed analytics. See which
                subjects and topics need more attention, and watch your knowledge grow over time with visual progress
                indicators.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Your Spaced Repetition System</h2>
          <SpacedRepetitionSystem />
        </div>
        
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white font-medium">1</div>
                  <CardTitle>Study</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Review flashcards that are due today. After seeing each question, try to recall the answer before
                  revealing it. This active recall strengthens memory more effectively than passive review.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white font-medium">2</div>
                  <CardTitle>Rate Your Recall</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  After revealing the answer, rate how well you knew it on a scale from "Not at all" to "Perfectly."
                  Be honest—this helps the algorithm schedule the optimal next review time for each card.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white font-medium">3</div>
                  <CardTitle>Adaptive Scheduling</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Based on your rating, the system calculates the optimal interval before your next review. Cards you
                  find difficult will appear more frequently, while well-known cards will have increasingly longer intervals.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-primary/5 border-primary/20 mt-6">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">The Science Behind Spaced Repetition</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Spaced repetition leverages the psychological spacing effect, first documented by Hermann Ebbinghaus in the 1880s.
                    His research showed that memory retention improves when learning is spread out over time rather than crammed into a single session.
                    Modern spaced repetition systems use algorithms that calculate optimal review intervals based on individual performance,
                    dramatically improving long-term retention compared to traditional study methods.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default SpacedRepetition;
