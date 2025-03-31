
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Medal, Trophy, Award, Users, UserCircle2 } from 'lucide-react';
import { useSessionHistory } from '../../hooks/adaptive-quiz';
import { QuizSessionSummary } from '@/types/quiz-session';

interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  date: string;
  difficulty: string;
  topics: string[];
  isCurrentUser?: boolean;
}

const Leaderboard: React.FC = () => {
  const { sessions } = useSessionHistory();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [topicFilter, setTopicFilter] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  
  // In a real app, you would fetch this from an API
  // For now, we'll simulate it with mock data and combine with user's session data
  useEffect(() => {
    // Mock data for other users
    const mockUsers: LeaderboardEntry[] = [
      { id: '1', username: 'AccountingPro', score: 95, date: '2023-10-15', difficulty: 'Hard', topics: ['IFRS', 'Financial Reporting'] },
      { id: '2', username: 'FinanceWhiz', score: 88, date: '2023-10-16', difficulty: 'Medium', topics: ['Taxation', 'Accounting Standards'] },
      { id: '3', username: 'StudyMaster', score: 82, date: '2023-10-17', difficulty: 'Hard', topics: ['Financial Reporting', 'Audit'] },
      { id: '4', username: 'AccountingStudent', score: 75, date: '2023-10-18', difficulty: 'Medium', topics: ['IFRS', 'Management Accounting'] },
      { id: '5', username: 'FinancePro', score: 70, date: '2023-10-19', difficulty: 'Easy', topics: ['Audit', 'Ethics'] },
    ];

    // Transform user sessions to leaderboard format
    const userEntries: LeaderboardEntry[] = sessions?.map((session) => {
      const scorePercentage = Math.round((session.results.correctAnswers / session.results.questionsAttempted) * 100);
      const difficultyLabel = session.initialDifficulty === 1 ? 'Easy' : 
                             session.initialDifficulty === 2 ? 'Medium' : 'Hard';
      
      return {
        id: session.id,
        username: 'You', // In a real app, get the actual username
        score: scorePercentage,
        date: new Date(session.date).toLocaleDateString(),
        difficulty: difficultyLabel,
        topics: session.selectedTopics,
        isCurrentUser: true
      };
    }) || [];

    // Combine mock and user data, then sort by score
    const allEntries = [...mockUsers, ...userEntries].sort((a, b) => b.score - a.score);
    
    setLeaderboardData(allEntries);
  }, [sessions]);
  
  // Filter the leaderboard data based on selected filters
  const filteredData = leaderboardData.filter(entry => {
    const matchesTopic = !topicFilter || entry.topics.includes(topicFilter);
    const matchesDifficulty = !difficultyFilter || entry.difficulty === difficultyFilter;
    return matchesTopic && matchesDifficulty;
  });

  // Extract all unique topics for filtering
  const allTopics = Array.from(new Set(leaderboardData.flatMap(entry => entry.topics)));
  
  // Get unique difficulties
  const difficulties = Array.from(new Set(leaderboardData.map(entry => entry.difficulty)));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Leaderboard
        </CardTitle>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={!topicFilter ? "default" : "outline"} 
              className="cursor-pointer"
              onClick={() => setTopicFilter(null)}
            >
              All Topics
            </Badge>
            {allTopics.map(topic => (
              <Badge 
                key={topic} 
                variant={topicFilter === topic ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => setTopicFilter(topic === topicFilter ? null : topic)}
              >
                {topic}
              </Badge>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={!difficultyFilter ? "default" : "outline"} 
              className="cursor-pointer"
              onClick={() => setDifficultyFilter(null)}
            >
              All Difficulties
            </Badge>
            {difficulties.map(diff => (
              <Badge 
                key={diff} 
                variant={difficultyFilter === diff ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => setDifficultyFilter(diff === difficultyFilter ? null : diff)}
              >
                {diff}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Time</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {filteredData.length > 0 ? (
              filteredData.map((entry, index) => (
                <div 
                  key={entry.id} 
                  className={`flex items-center justify-between p-3 rounded-md ${
                    entry.isCurrentUser ? 'bg-primary-100 dark:bg-primary-900/20' : 
                    index < 3 ? 'bg-muted/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8">
                      {index === 0 ? (
                        <Trophy className="h-6 w-6 text-yellow-500" />
                      ) : index === 1 ? (
                        <Medal className="h-6 w-6 text-gray-400" />
                      ) : index === 2 ? (
                        <Award className="h-6 w-6 text-amber-700" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        {entry.isCurrentUser ? (
                          <UserCircle2 className="h-4 w-4 text-primary" />
                        ) : (
                          <Users className="h-4 w-4" />
                        )}
                        <span className="font-medium">
                          {entry.username} {entry.isCurrentUser && "(You)"}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground flex flex-wrap gap-1">
                        <span>{entry.difficulty}</span>
                        <span>•</span>
                        <span>{entry.topics.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold">{entry.score}%</div>
                    <div className="text-xs text-muted-foreground">{entry.date}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No results match the selected filters
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="monthly">
            <div className="text-center py-8 text-muted-foreground">
              Monthly leaderboard data will be available soon
            </div>
          </TabsContent>
          
          <TabsContent value="weekly">
            <div className="text-center py-8 text-muted-foreground">
              Weekly leaderboard data will be available soon
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
