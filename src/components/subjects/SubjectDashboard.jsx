import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

/**
 * SubjectDashboard component for displaying subject overview and progress
 * @param {Object} props Component props
 * @param {string} props.subject The subject name
 * @param {string} props.description The subject description
 * @param {number} props.progress The overall progress percentage
 * @param {Array} props.topics The topics in the subject
 * @returns {React.ReactElement} SubjectDashboard component
 */
const SubjectDashboard = ({ subject, description, progress, topics }) => {
  // Calculate overall statistics
  const totalSubtopics = topics.reduce((acc, topic) => acc + topic.subtopics.length, 0);
  const completedSubtopics = topics.reduce((acc, topic) => 
    acc + topic.subtopics.filter(subtopic => subtopic.completed).length, 0);
  
  // Get status counts
  const statusCounts = {
    completed: topics.filter(topic => topic.status === 'completed').length,
    in_progress: topics.filter(topic => topic.status === 'in_progress').length,
    not_started: topics.filter(topic => topic.status === 'not_started').length
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{subject} Overview</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <Badge variant="outline" className="px-3 py-1">
              {progress}% Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={progress} className="h-2" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Topics</p>
                      <p className="text-2xl font-bold">{topics.length}</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{statusCounts.completed}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-amber-500" />
                        <span className="text-sm">{statusCounts.in_progress}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{statusCounts.not_started}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Subtopics</p>
                      <p className="text-2xl font-bold">{totalSubtopics}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">{completedSubtopics} completed</span>
                      <span className="text-sm text-muted-foreground">
                        ({Math.round((completedSubtopics / totalSubtopics) * 100)}%)
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Estimated Time</p>
                      <p className="text-2xl font-bold">{Math.round((100 - progress) / 10)} hours</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      To complete
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map(topic => (
          <Card key={topic.title}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{topic.title}</CardTitle>
                {topic.status === 'completed' && (
                  <Badge className="bg-green-500">Completed</Badge>
                )}
                {topic.status === 'in_progress' && (
                  <Badge className="bg-amber-500">In Progress</Badge>
                )}
                {topic.status === 'not_started' && (
                  <Badge variant="outline">Not Started</Badge>
                )}
              </div>
              <CardDescription>{topic.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {topic.subtopics.map(subtopic => (
                  <li key={subtopic.title} className="flex items-center gap-2">
                    {subtopic.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-gray-300" />
                    )}
                    <span className={subtopic.completed ? 'text-sm' : 'text-sm text-muted-foreground'}>
                      {subtopic.title}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubjectDashboard;
