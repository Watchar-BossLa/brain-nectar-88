
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { fetchDueFlashcards, fetchFlashcardsByTopic } from '@/services/spacedRepetition';
import { Topic, Flashcard } from '@/types/supabase';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from 'react-router-dom';

interface AdaptiveLearningPathProps {
  topics: Topic[];
}

const AdaptiveLearningPath: React.FC<AdaptiveLearningPathProps> = ({ topics }) => {
  const { user } = useAuth();
  const [topicProgress, setTopicProgress] = useState<{ [topicId: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const calculateProgress = async () => {
      setLoading(true);
      const progress: { [topicId: string]: number } = {};

      for (const topic of topics) {
        try {
          // Get due flashcards for this topic
          const dueCardsInTopic = await fetchDueFlashcards(user.id, topic.id);
          
          // Get all flashcards for this topic
          const allCardsForTopic = await fetchFlashcardsByTopic(user.id, topic.id);

          const totalCardsInTopic = allCardsForTopic.length;
          const reviewedCards = totalCardsInTopic - dueCardsInTopic.length;

          progress[topic.id] = totalCardsInTopic > 0 ? (reviewedCards / totalCardsInTopic) * 100 : 0;
        } catch (error) {
          console.error("Error calculating progress for topic:", topic.title, error);
          progress[topic.id] = 0;
        }
      }

      setTopicProgress(progress);
      setLoading(false);
    };

    calculateProgress();
  }, [user, topics]);

  const navigateToReview = (topicId: string) => {
    navigate(`/flashcard-review?topic=${topicId}`);
  };

  return (
    <ScrollArea className="h-[500px] w-full">
      <div className="grid gap-4 p-4">
        {topics.map((topic) => (
          <Card key={topic.id} className="bg-muted">
            <CardHeader>
              <CardTitle>{topic.title}</CardTitle>
              <CardDescription>{topic.description || 'No description available.'}</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading progress...</p>
              ) : (
                <>
                  <Progress value={topicProgress[topic.id] || 0} />
                  <p className="text-sm text-muted-foreground mt-2">
                    {`Progress: ${Math.round(topicProgress[topic.id] || 0)}%`}
                  </p>
                </>
              )}
              <Button 
                onClick={() => navigateToReview(topic.id)}
                className="mt-4"
              >
                Review Flashcards
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default AdaptiveLearningPath;
