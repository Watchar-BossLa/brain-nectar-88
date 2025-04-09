import React, { useState, useEffect } from 'react';
import { useAICoachStudyPlan, useAICoachGoal } from '@/services/ai-coach';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { 
  Calendar, 
  Plus, 
  Clock,
  CheckCircle2,
  Trash2,
  Loader2,
  BookOpen,
  Brain,
  ListChecks
} from 'lucide-react';

/**
 * Study Plan Card Component
 * Displays and manages the user's study plans
 * @returns {React.ReactElement} Study plan card component
 */
const StudyPlanCard = () => {
  const { user } = useAuth();
  const aiCoachStudyPlan = useAICoachStudyPlan();
  const aiCoachGoal = useAICoachGoal();
  
  const [plans, setPlans] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [planParameters, setPlanParameters] = useState({
    goalId: '',
    subject: '',
    timeFrame: 'week',
    hoursPerDay: 2,
    focusAreas: [],
    preferences: {}
  });
  const [focusAreaInput, setFocusAreaInput] = useState('');
  const [creatingPlan, setCreatingPlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planDetailsOpen, setPlanDetailsOpen] = useState(false);
  
  // Load user's study plans and goals
  useEffect(() => {
    if (!user) return;
    
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Initialize services if needed
        if (!aiCoachStudyPlan.initialized) {
          await aiCoachStudyPlan.initialize(user.id);
        }
        
        if (!aiCoachGoal.initialized) {
          await aiCoachGoal.initialize(user.id);
        }
        
        // Load study plans
        const userPlans = await aiCoachStudyPlan.getSavedStudyPlans();
        setPlans(userPlans);
        
        // Load active goals
        const userGoals = await aiCoachGoal.getUserGoals('active');
        setGoals(userGoals);
      } catch (error) {
        console.error('Error loading study plans:', error);
        toast({
          title: 'Error',
          description: 'Failed to load study plans',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user, aiCoachStudyPlan, aiCoachGoal]);
  
  // Handle form change
  const handleFormChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setPlanParameters(prev => ({
        ...prev,
        [name]: parseFloat(value)
      }));
    } else {
      setPlanParameters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle select change
  const handleSelectChange = (name, value) => {
    setPlanParameters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle adding focus area
  const handleAddFocusArea = () => {
    if (!focusAreaInput.trim()) return;
    
    setPlanParameters(prev => ({
      ...prev,
      focusAreas: [...prev.focusAreas, focusAreaInput.trim()]
    }));
    
    setFocusAreaInput('');
  };
  
  // Handle removing focus area
  const handleRemoveFocusArea = (index) => {
    setPlanParameters(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.filter((_, i) => i !== index)
    }));
  };
  
  // Handle creating a study plan
  const handleCreatePlan = async () => {
    try {
      setCreatingPlan(true);
      
      // Generate study plan
      const studyPlan = await aiCoachStudyPlan.generateStudyPlan(planParameters);
      
      // Save study plan
      const savedPlan = await aiCoachStudyPlan.saveStudyPlan(studyPlan);
      
      // Add to plans list
      setPlans(prev => [savedPlan, ...prev]);
      
      // Reset form
      setPlanParameters({
        goalId: '',
        subject: '',
        timeFrame: 'week',
        hoursPerDay: 2,
        focusAreas: [],
        preferences: {}
      });
      
      setCreateDialogOpen(false);
      
      toast({
        title: 'Plan Created',
        description: 'Your study plan has been created successfully',
      });
    } catch (error) {
      console.error('Error creating study plan:', error);
      toast({
        title: 'Creation Failed',
        description: error.message || 'An error occurred while creating the study plan',
        variant: 'destructive'
      });
    } finally {
      setCreatingPlan(false);
    }
  };
  
  // Handle viewing plan details
  const handleViewPlanDetails = async (plan) => {
    setSelectedPlan(plan);
    setPlanDetailsOpen(true);
  };
  
  // Handle marking block as completed
  const handleMarkBlockCompleted = async (blockId) => {
    if (!selectedPlan) return;
    
    try {
      const updatedPlan = await aiCoachStudyPlan.markStudyBlockCompleted(selectedPlan.id, blockId);
      
      // Update selected plan
      setSelectedPlan(updatedPlan);
      
      // Update plans list
      setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
      
      toast({
        title: 'Block Completed',
        description: 'Study block marked as completed',
      });
    } catch (error) {
      console.error('Error marking block as completed:', error);
      toast({
        title: 'Action Failed',
        description: error.message || 'An error occurred',
        variant: 'destructive'
      });
    }
  };
  
  // Handle marking activity as completed
  const handleMarkActivityCompleted = async (blockId, activityId) => {
    if (!selectedPlan) return;
    
    try {
      const updatedPlan = await aiCoachStudyPlan.markActivityCompleted(selectedPlan.id, blockId, activityId);
      
      // Update selected plan
      setSelectedPlan(updatedPlan);
      
      // Update plans list
      setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
      
      toast({
        title: 'Activity Completed',
        description: 'Study activity marked as completed',
      });
    } catch (error) {
      console.error('Error marking activity as completed:', error);
      toast({
        title: 'Action Failed',
        description: error.message || 'An error occurred',
        variant: 'destructive'
      });
    }
  };
  
  // Handle deleting a plan
  const handleDeletePlan = async (planId) => {
    if (!confirm('Are you sure you want to delete this study plan?')) {
      return;
    }
    
    try {
      await aiCoachStudyPlan.deleteStudyPlan(planId);
      
      // Update plans list
      setPlans(prev => prev.filter(p => p.id !== planId));
      
      // Close details dialog if open
      if (selectedPlan && selectedPlan.id === planId) {
        setPlanDetailsOpen(false);
        setSelectedPlan(null);
      }
      
      toast({
        title: 'Plan Deleted',
        description: 'The study plan has been deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast({
        title: 'Deletion Failed',
        description: error.message || 'An error occurred while deleting the plan',
        variant: 'destructive'
      });
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Calculate completion percentage
  const calculateCompletion = (plan) => {
    if (!plan || !plan.studyBlocks || plan.studyBlocks.length === 0) {
      return 0;
    }
    
    const totalBlocks = plan.studyBlocks.length;
    const completedBlocks = plan.studyBlocks.filter(block => block.completed).length;
    
    return Math.round((completedBlocks / totalBlocks) * 100);
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
            {[1, 2].map((i) => (
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
            <CardTitle>Study Plans</CardTitle>
            <CardDescription>
              {plans.length === 0
                ? 'Create personalized study plans'
                : `You have ${plans.length} study plan${plans.length === 1 ? '' : 's'}`
              }
            </CardDescription>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Plan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Study Plan</DialogTitle>
                <DialogDescription>
                  Generate a personalized study plan based on your preferences
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="goalId">Learning Goal (Optional)</Label>
                  <Select
                    value={planParameters.goalId}
                    onValueChange={(value) => handleSelectChange('goalId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a goal (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No specific goal</SelectItem>
                      {goals.map((goal) => (
                        <SelectItem key={goal.id} value={goal.id}>
                          {goal.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={planParameters.subject}
                    onChange={handleFormChange}
                    placeholder="e.g., Mathematics, History, Programming"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeFrame">Time Frame</Label>
                  <Select
                    value={planParameters.timeFrame}
                    onValueChange={(value) => handleSelectChange('timeFrame', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time frame" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hoursPerDay">Hours Per Day</Label>
                  <Input
                    id="hoursPerDay"
                    name="hoursPerDay"
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={planParameters.hoursPerDay}
                    onChange={handleFormChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Focus Areas</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={focusAreaInput}
                      onChange={(e) => setFocusAreaInput(e.target.value)}
                      placeholder="Add focus area"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFocusArea();
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddFocusArea}
                      disabled={!focusAreaInput.trim()}
                    >
                      Add
                    </Button>
                  </div>
                  
                  {planParameters.focusAreas.length > 0 && (
                    <div className="mt-2">
                      <ul className="space-y-1">
                        {planParameters.focusAreas.map((area, index) => (
                          <li key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                            <span>{area}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleRemoveFocusArea(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </li>
                        ))}
                      </ul>
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
                  onClick={handleCreatePlan}
                  disabled={(!planParameters.subject.trim() && !planParameters.goalId) || creatingPlan}
                >
                  {creatingPlan ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Plan'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {plans.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Study Plans</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create a personalized study plan to organize your learning effectively.
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Study Plan
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleViewPlanDetails(plan)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{plan.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {plan.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePlan(plan.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center space-x-4 mt-3 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {plan.totalHours} hours total
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {calculateCompletion(plan)}% complete
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
            // TODO: Implement plan analytics
            toast({
              title: 'Plan Analytics',
              description: 'This feature is not yet implemented',
            });
          }}
        >
          <ListChecks className="h-4 w-4 mr-2" />
          View All Plans
        </Button>
      </CardFooter>
      
      {/* Plan Details Dialog */}
      <Dialog open={planDetailsOpen} onOpenChange={setPlanDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedPlan && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPlan.title}</DialogTitle>
                <DialogDescription>
                  {selectedPlan.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="bg-muted p-2 rounded flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {formatDate(selectedPlan.startDate)} - {formatDate(selectedPlan.endDate)}
                    </span>
                  </div>
                  <div className="bg-muted p-2 rounded flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{selectedPlan.totalHours} hours total</span>
                  </div>
                  <div className="bg-muted p-2 rounded flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span>{selectedPlan.subject || 'General'}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Study Blocks</h3>
                  <div className="space-y-4">
                    {selectedPlan.studyBlocks.map((block) => (
                      <div key={block.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-3">
                            {block.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                            ) : (
                              <div className="h-5 w-5 border-2 border-muted-foreground rounded-full mt-1" />
                            )}
                            <div>
                              <h4 className="font-medium">{block.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {block.description}
                              </p>
                              <p className="text-sm mt-1">
                                <span className="font-medium">Time:</span> {block.hours} hours
                              </p>
                            </div>
                          </div>
                          {!block.completed && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkBlockCompleted(block.id)}
                            >
                              Mark Complete
                            </Button>
                          )}
                        </div>
                        
                        {block.activities && block.activities.length > 0 && (
                          <div className="mt-4 pl-8">
                            <h5 className="text-sm font-medium mb-2">Activities</h5>
                            <div className="space-y-2">
                              {block.activities.map((activity) => (
                                <div 
                                  key={activity.id} 
                                  className="flex items-start space-x-2 text-sm"
                                >
                                  <div className="flex-shrink-0 mt-0.5">
                                    <Checkbox
                                      checked={activity.completed}
                                      onCheckedChange={() => {
                                        if (!activity.completed) {
                                          handleMarkActivityCompleted(block.id, activity.id);
                                        }
                                      }}
                                      disabled={activity.completed}
                                    />
                                  </div>
                                  <div>
                                    <p className={activity.completed ? 'line-through text-muted-foreground' : ''}>
                                      {activity.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {activity.description}
                                    </p>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                                        {activity.duration} min
                                      </span>
                                      {activity.learningStyle && (
                                        <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                                          {activity.learningStyle}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {selectedPlan.learningStyles && selectedPlan.learningStyles.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Learning Styles</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlan.learningStyles.map((style, index) => (
                        <div 
                          key={index}
                          className="bg-primary/10 text-primary px-2 py-1 rounded flex items-center"
                        >
                          <Brain className="h-4 w-4 mr-1" />
                          {style.charAt(0).toUpperCase() + style.slice(1)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setPlanDetailsOpen(false)}
                >
                  Close
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    handleDeletePlan(selectedPlan.id);
                  }}
                >
                  Delete Plan
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default StudyPlanCard;
