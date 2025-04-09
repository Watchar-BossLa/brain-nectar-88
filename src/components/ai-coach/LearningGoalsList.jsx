import React, { useState, useEffect } from 'react';
import { useAICoachGoal } from '@/services/ai-coach';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { 
  Target, 
  Plus, 
  Clock,
  CheckCircle2,
  Trash2,
  Archive,
  MoreHorizontal,
  Loader2,
  Calendar,
  BarChart
} from 'lucide-react';

/**
 * Learning Goals List Component
 * Displays and manages the user's learning goals
 * @returns {React.ReactElement} Learning goals list component
 */
const LearningGoalsList = () => {
  const { user } = useAuth();
  const aiCoachGoal = useAICoachGoal();
  
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newGoalData, setNewGoalData] = useState({
    title: '',
    description: '',
    goalType: 'study_time',
    targetDate: '',
    metrics: {}
  });
  const [creatingGoal, setCreatingGoal] = useState(false);
  const [suggestionsDialogOpen, setSuggestionsDialogOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  
  // Load user's goals
  useEffect(() => {
    if (!user) return;
    
    const loadGoals = async () => {
      try {
        setLoading(true);
        
        // Initialize service if needed
        if (!aiCoachGoal.initialized) {
          await aiCoachGoal.initialize(user.id);
        }
        
        // Load active goals
        const userGoals = await aiCoachGoal.getUserGoals('active');
        setGoals(userGoals);
      } catch (error) {
        console.error('Error loading goals:', error);
        toast({
          title: 'Error',
          description: 'Failed to load learning goals',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadGoals();
  }, [user, aiCoachGoal]);
  
  // Handle new goal form change
  const handleNewGoalChange = (e) => {
    const { name, value } = e.target;
    setNewGoalData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle select change
  const handleSelectChange = (name, value) => {
    if (name === 'goalType') {
      // Reset metrics when goal type changes
      setNewGoalData(prev => ({
        ...prev,
        goalType: value,
        metrics: {}
      }));
    } else {
      setNewGoalData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle metrics change
  const handleMetricsChange = (e) => {
    const { name, value } = e.target;
    setNewGoalData(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [name]: value
      }
    }));
  };
  
  // Handle creating a new goal
  const handleCreateGoal = async () => {
    if (!user || !newGoalData.title.trim() || !newGoalData.goalType) return;
    
    try {
      setCreatingGoal(true);
      
      // Process metrics based on goal type
      let processedMetrics = { ...newGoalData.metrics };
      
      switch (newGoalData.goalType) {
        case 'study_time':
          processedMetrics.target_hours = parseFloat(processedMetrics.target_hours) || 20;
          break;
        case 'topic_mastery':
          processedMetrics.target_mastery_level = parseFloat(processedMetrics.target_mastery_level) || 0.8;
          break;
        case 'exam_preparation':
          processedMetrics.total_topics = parseInt(processedMetrics.total_topics) || 10;
          processedMetrics.completed_topics = 0;
          break;
        case 'habit_formation':
          processedMetrics.target_sessions = parseInt(processedMetrics.target_sessions) || 21;
          break;
      }
      
      // Create goal
      const newGoal = await aiCoachGoal.createGoal({
        title: newGoalData.title.trim(),
        description: newGoalData.description.trim(),
        goalType: newGoalData.goalType,
        targetDate: newGoalData.targetDate ? new Date(newGoalData.targetDate) : null,
        metrics: processedMetrics
      });
      
      // Add new goal to list
      setGoals(prev => [newGoal, ...prev]);
      
      // Reset form
      setNewGoalData({
        title: '',
        description: '',
        goalType: 'study_time',
        targetDate: '',
        metrics: {}
      });
      setCreateDialogOpen(false);
      
      toast({
        title: 'Goal Created',
        description: 'Your learning goal has been created successfully',
      });
    } catch (error) {
      console.error('Error creating goal:', error);
      toast({
        title: 'Creation Failed',
        description: error.message || 'An error occurred while creating the goal',
        variant: 'destructive'
      });
    } finally {
      setCreatingGoal(false);
    }
  };
  
  // Handle completing a goal
  const handleCompleteGoal = async (goalId) => {
    try {
      await aiCoachGoal.completeGoal(goalId);
      
      // Update goals list
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
      
      toast({
        title: 'Goal Completed',
        description: 'Congratulations on completing your goal!',
      });
    } catch (error) {
      console.error('Error completing goal:', error);
      toast({
        title: 'Action Failed',
        description: error.message || 'An error occurred while completing the goal',
        variant: 'destructive'
      });
    }
  };
  
  // Handle archiving a goal
  const handleArchiveGoal = async (goalId) => {
    try {
      await aiCoachGoal.archiveGoal(goalId);
      
      // Update goals list
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
      
      toast({
        title: 'Goal Archived',
        description: 'The goal has been archived successfully',
      });
    } catch (error) {
      console.error('Error archiving goal:', error);
      toast({
        title: 'Action Failed',
        description: error.message || 'An error occurred while archiving the goal',
        variant: 'destructive'
      });
    }
  };
  
  // Handle deleting a goal
  const handleDeleteGoal = async (goalId) => {
    if (!confirm('Are you sure you want to delete this goal?')) {
      return;
    }
    
    try {
      await aiCoachGoal.deleteGoal(goalId);
      
      // Update goals list
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
      
      toast({
        title: 'Goal Deleted',
        description: 'The goal has been deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast({
        title: 'Deletion Failed',
        description: error.message || 'An error occurred while deleting the goal',
        variant: 'destructive'
      });
    }
  };
  
  // Load goal suggestions
  const loadGoalSuggestions = async () => {
    try {
      setLoadingSuggestions(true);
      
      // Get suggestions
      const goalSuggestions = await aiCoachGoal.generateGoalSuggestions();
      setSuggestions(goalSuggestions);
      
      // Open dialog
      setSuggestionsDialogOpen(true);
    } catch (error) {
      console.error('Error loading suggestions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load goal suggestions',
        variant: 'destructive'
      });
    } finally {
      setLoadingSuggestions(false);
    }
  };
  
  // Handle using a suggestion
  const handleUseSuggestion = (suggestion) => {
    setNewGoalData({
      title: suggestion.title,
      description: suggestion.description,
      goalType: suggestion.goalType,
      targetDate: '',
      metrics: suggestion.metrics
    });
    
    setSuggestionsDialogOpen(false);
    setCreateDialogOpen(true);
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Get goal type display name
  const getGoalTypeDisplay = (type) => {
    switch (type) {
      case 'study_time':
        return 'Study Time';
      case 'topic_mastery':
        return 'Topic Mastery';
      case 'exam_preparation':
        return 'Exam Preparation';
      case 'habit_formation':
        return 'Habit Formation';
      case 'practice':
        return 'Practice';
      default:
        return type;
    }
  };
  
  // Get metrics display
  const getMetricsDisplay = (goal) => {
    switch (goal.goal_type) {
      case 'study_time':
        return `${goal.metrics.target_hours || 0} hours`;
      case 'topic_mastery':
        return `${(goal.metrics.target_mastery_level || 0) * 100}% mastery`;
      case 'exam_preparation':
        return `${goal.metrics.completed_topics || 0}/${goal.metrics.total_topics || 0} topics`;
      case 'habit_formation':
        return `${goal.metrics.target_sessions || 0} sessions`;
      case 'practice':
        return `${goal.metrics.completed_problems || 0}/${goal.metrics.target_problems || 0} problems`;
      default:
        return '';
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-48" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Learning Goals</CardTitle>
            <CardDescription>
              {goals.length === 0
                ? 'Set goals to track your learning progress'
                : `You have ${goals.length} active goal${goals.length === 1 ? '' : 's'}`
              }
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={loadGoalSuggestions}
              disabled={loadingSuggestions}
            >
              {loadingSuggestions ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Target className="h-4 w-4 mr-2" />
              )}
              {!loadingSuggestions && 'Suggestions'}
            </Button>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Learning Goal</DialogTitle>
                  <DialogDescription>
                    Set a specific, measurable goal to improve your learning
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Goal Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={newGoalData.title}
                      onChange={handleNewGoalChange}
                      placeholder="Enter goal title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newGoalData.description}
                      onChange={handleNewGoalChange}
                      placeholder="Enter goal description"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="goalType">Goal Type</Label>
                    <Select
                      value={newGoalData.goalType}
                      onValueChange={(value) => handleSelectChange('goalType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select goal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="study_time">Study Time</SelectItem>
                        <SelectItem value="topic_mastery">Topic Mastery</SelectItem>
                        <SelectItem value="exam_preparation">Exam Preparation</SelectItem>
                        <SelectItem value="habit_formation">Habit Formation</SelectItem>
                        <SelectItem value="practice">Practice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="targetDate">Target Date (Optional)</Label>
                    <Input
                      id="targetDate"
                      name="targetDate"
                      type="date"
                      value={newGoalData.targetDate}
                      onChange={handleNewGoalChange}
                    />
                  </div>
                  
                  {/* Metrics fields based on goal type */}
                  <div className="space-y-2">
                    <Label>Goal Metrics</Label>
                    
                    {newGoalData.goalType === 'study_time' && (
                      <div className="space-y-2">
                        <Label htmlFor="target_hours">Target Hours</Label>
                        <Input
                          id="target_hours"
                          name="target_hours"
                          type="number"
                          min="1"
                          value={newGoalData.metrics.target_hours || ''}
                          onChange={handleMetricsChange}
                          placeholder="e.g., 20"
                        />
                      </div>
                    )}
                    
                    {newGoalData.goalType === 'topic_mastery' && (
                      <div className="space-y-2">
                        <Label htmlFor="target_mastery_level">Target Mastery Level (0-1)</Label>
                        <Input
                          id="target_mastery_level"
                          name="target_mastery_level"
                          type="number"
                          min="0"
                          max="1"
                          step="0.1"
                          value={newGoalData.metrics.target_mastery_level || ''}
                          onChange={handleMetricsChange}
                          placeholder="e.g., 0.8"
                        />
                      </div>
                    )}
                    
                    {newGoalData.goalType === 'exam_preparation' && (
                      <div className="space-y-2">
                        <Label htmlFor="total_topics">Total Topics to Cover</Label>
                        <Input
                          id="total_topics"
                          name="total_topics"
                          type="number"
                          min="1"
                          value={newGoalData.metrics.total_topics || ''}
                          onChange={handleMetricsChange}
                          placeholder="e.g., 10"
                        />
                      </div>
                    )}
                    
                    {newGoalData.goalType === 'habit_formation' && (
                      <div className="space-y-2">
                        <Label htmlFor="target_sessions">Target Sessions</Label>
                        <Input
                          id="target_sessions"
                          name="target_sessions"
                          type="number"
                          min="1"
                          value={newGoalData.metrics.target_sessions || ''}
                          onChange={handleMetricsChange}
                          placeholder="e.g., 21"
                        />
                      </div>
                    )}
                    
                    {newGoalData.goalType === 'practice' && (
                      <div className="space-y-2">
                        <Label htmlFor="target_problems">Target Problems</Label>
                        <Input
                          id="target_problems"
                          name="target_problems"
                          type="number"
                          min="1"
                          value={newGoalData.metrics.target_problems || ''}
                          onChange={handleMetricsChange}
                          placeholder="e.g., 50"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateGoal}
                    disabled={!newGoalData.title.trim() || creatingGoal}
                  >
                    {creatingGoal ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Goal'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Active Goals</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Setting clear goals can help you stay focused and track your progress.
            </p>
            <div className="flex justify-center space-x-4">
              <Button 
                variant="outline"
                onClick={loadGoalSuggestions}
                disabled={loadingSuggestions}
              >
                {loadingSuggestions ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Target className="h-4 w-4 mr-2" />
                )}
                {loadingSuggestions ? 'Loading...' : 'Get Suggestions'}
              </Button>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Goal
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="border rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{goal.title}</h3>
                    {goal.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {goal.description}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-green-600"
                      onClick={() => handleCompleteGoal(goal.id)}
                      title="Mark as completed"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-amber-600"
                      onClick={() => handleArchiveGoal(goal.id)}
                      title="Archive goal"
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDeleteGoal(goal.id)}
                      title="Delete goal"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                    <span>Progress: {Math.round(goal.progress * 100)}%</span>
                    <span>{getMetricsDisplay(goal)}</span>
                  </div>
                  <Progress value={goal.progress * 100} className="h-2" />
                </div>
                
                <div className="flex items-center space-x-4 mt-3 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {goal.target_date ? formatDate(goal.target_date) : 'No deadline'}
                  </div>
                  <div className="flex items-center">
                    <BarChart className="h-3 w-3 mr-1" />
                    {getGoalTypeDisplay(goal.goal_type)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => {
            // TODO: Implement goal analytics
            toast({
              title: 'Goal Analytics',
              description: 'This feature is not yet implemented',
            });
          }}
        >
          <BarChart className="h-4 w-4 mr-2" />
          View Goal Analytics
        </Button>
      </CardFooter>
      
      {/* Goal Suggestions Dialog */}
      <Dialog open={suggestionsDialogOpen} onOpenChange={setSuggestionsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Goal Suggestions</DialogTitle>
            <DialogDescription>
              Choose from these suggested learning goals or customize your own
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4 max-h-[400px] overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleUseSuggestion(suggestion)}
              >
                <h3 className="font-medium">{suggestion.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {suggestion.description}
                </p>
                <div className="flex items-center space-x-2 mt-2 text-xs text-muted-foreground">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                    {getGoalTypeDisplay(suggestion.goalType)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setSuggestionsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => {
              setSuggestionsDialogOpen(false);
              setCreateDialogOpen(true);
            }}>
              Create Custom Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default LearningGoalsList;
