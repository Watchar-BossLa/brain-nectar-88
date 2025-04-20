import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * Learning Goal Form component
 * Allows users to create and manage learning goals
 * @param {Object} props - Component props
 * @param {Array} props.goals - Current learning goals
 * @param {Function} props.onUpdate - Function called when goals are updated
 * @returns {React.ReactElement} Learning goal form component
 */
const LearningGoalForm = ({ goals = [], onUpdate }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userGoals, setUserGoals] = useState(goals);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    priority: 'medium',
    targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // Default to 2 weeks from now
  });

  const handleGoalChange = (field, value) => {
    setNewGoal(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddGoal = () => {
    if (!newGoal.title.trim()) {
      toast({
        title: 'Goal Required',
        description: 'Please enter a title for your learning goal.',
        variant: 'destructive'
      });
      return;
    }

    const updatedGoals = [
      ...userGoals,
      {
        id: Date.now().toString(),
        ...newGoal,
        createdAt: new Date()
      }
    ];

    setUserGoals(updatedGoals);
    
    // Reset form
    setNewGoal({
      title: '',
      description: '',
      priority: 'medium',
      targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    });

    // Notify parent component
    if (onUpdate) {
      onUpdate(updatedGoals);
    }

    toast({
      title: 'Goal Added',
      description: 'Your learning goal has been added successfully.'
    });
  };

  const handleRemoveGoal = (id) => {
    const updatedGoals = userGoals.filter(goal => goal.id !== id);
    setUserGoals(updatedGoals);

    if (onUpdate) {
      onUpdate(updatedGoals);
    }

    toast({
      title: 'Goal Removed',
      description: 'Your learning goal has been removed.'
    });
  };

  const handleSaveAllGoals = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would save to a backend
      await new Promise(resolve => setTimeout(resolve, 800));

      if (onUpdate) {
        onUpdate(userGoals);
      }

      toast({
        title: 'Goals Saved',
        description: 'Your learning goals have been saved successfully.'
      });
    } catch (error) {
      console.error('Error saving goals:', error);
      toast({
        title: 'Save Failed',
        description: 'Failed to save your learning goals. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Learning Goals</CardTitle>
        <CardDescription>
          Set your learning goals to track your progress
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* New Goal Form */}
        <div className="space-y-4 border rounded-md p-4">
          <h3 className="font-medium">Add New Goal</h3>
          
          <div className="space-y-2">
            <Label htmlFor="goalTitle">Goal Title</Label>
            <Input 
              id="goalTitle"
              value={newGoal.title}
              onChange={(e) => handleGoalChange('title', e.target.value)}
              placeholder="Learn calculus fundamentals"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goalDescription">Description (Optional)</Label>
            <Textarea 
              id="goalDescription"
              value={newGoal.description}
              onChange={(e) => handleGoalChange('description', e.target.value)}
              placeholder="Specific details about your goal"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goalPriority">Priority</Label>
              <Select 
                value={newGoal.priority} 
                onValueChange={(value) => handleGoalChange('priority', value)}
              >
                <SelectTrigger id="goalPriority">
                  <SelectValue placeholder="Set priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goalDate">Target Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="goalDate"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newGoal.targetDate ? format(newGoal.targetDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newGoal.targetDate}
                    onSelect={(date) => handleGoalChange('targetDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Button onClick={handleAddGoal} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Goal
          </Button>
        </div>

        {/* Existing Goals */}
        {userGoals.length > 0 ? (
          <div className="space-y-4">
            <h3 className="font-medium">Current Goals</h3>
            <div className="space-y-3">
              {userGoals.map((goal) => (
                <div 
                  key={goal.id} 
                  className="flex items-start justify-between border rounded-md p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <h4 className="font-medium">{goal.title}</h4>
                      <span className={`text-xs ml-2 px-2 py-0.5 rounded-full border ${getPriorityColor(goal.priority)}`}>
                        {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)}
                      </span>
                    </div>
                    {goal.description && (
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Target: {format(new Date(goal.targetDate), 'PPP')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveGoal(goal.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No learning goals added yet</p>
            <p className="text-sm">Add your first goal using the form above</p>
          </div>
        )}
      </CardContent>
      {userGoals.length > 0 && (
        <CardFooter>
          <Button onClick={handleSaveAllGoals} disabled={loading} className="w-full">
            {loading ? (
              <>
                <span className="mr-2">Saving</span>
                <span className="animate-spin">⋯</span>
              </>
            ) : 'Save All Goals'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default LearningGoalForm;
