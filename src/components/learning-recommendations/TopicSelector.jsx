import React, { useState } from 'react';
import { useLearningProfile } from '@/services/learning-recommendations';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';
import { Tag, Plus, X, Loader2, Sparkles } from 'lucide-react';

/**
 * Topic Selector Component
 * @param {Object} props - Component props
 * @param {Array} props.userTopics - User's current topics
 * @param {Function} props.onUpdate - Update callback
 * @returns {React.ReactElement} Topic selector component
 */
const TopicSelector = ({ userTopics = [], onUpdate }) => {
  const learningProfile = useLearningProfile();
  
  const [loading, setLoading] = useState(false);
  const [topicInput, setTopicInput] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [interestLevel, setInterestLevel] = useState(5);
  const [proficiencyLevel, setProficiencyLevel] = useState(3);
  
  // Suggested topics
  const suggestedTopics = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
    'History', 'Geography', 'Literature', 'Philosophy', 'Psychology',
    'Economics', 'Business', 'Marketing', 'Finance', 'Law',
    'Art', 'Music', 'Design', 'Photography', 'Film',
    'Health', 'Nutrition', 'Fitness', 'Medicine', 'Nursing',
    'Engineering', 'Architecture', 'Environmental Science', 'Astronomy', 'Geology',
    'Languages', 'Writing', 'Communication', 'Public Speaking', 'Leadership',
    'Data Science', 'Machine Learning', 'Artificial Intelligence', 'Web Development', 'Mobile Development'
  ].filter(topic => 
    !userTopics.some(ut => ut.topic.toLowerCase() === topic.toLowerCase()) &&
    topic.toLowerCase().includes(topicInput.toLowerCase())
  ).slice(0, 8);
  
  // Handle topic input change
  const handleTopicInputChange = (e) => {
    setTopicInput(e.target.value);
  };
  
  // Handle topic selection
  const handleSelectTopic = (topic) => {
    setTopicInput('');
    setSelectedTopic(topic);
  };
  
  // Handle interest level change
  const handleInterestLevelChange = (value) => {
    setInterestLevel(value[0]);
  };
  
  // Handle proficiency level change
  const handleProficiencyLevelChange = (value) => {
    setProficiencyLevel(value[0]);
  };
  
  // Handle add topic
  const handleAddTopic = async () => {
    if (!selectedTopic) return;
    
    try {
      setLoading(true);
      
      // Add topic to user profile
      await learningProfile.addTopic({
        topic: selectedTopic,
        interestLevel,
        proficiencyLevel,
        topicData: {
          addedAt: new Date().toISOString()
        }
      });
      
      toast({
        title: 'Topic Added',
        description: `${selectedTopic} has been added to your interests`,
      });
      
      // Reset form
      setSelectedTopic(null);
      setInterestLevel(5);
      setProficiencyLevel(3);
      
      // Call update callback
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error adding topic:', error);
      toast({
        title: 'Error',
        description: 'Failed to add topic',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle remove topic
  const handleRemoveTopic = async (topicId) => {
    try {
      setLoading(true);
      
      // Remove topic from user profile
      await learningProfile.removeTopic(topicId);
      
      toast({
        title: 'Topic Removed',
        description: 'Topic has been removed from your interests',
      });
      
      // Call update callback
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error removing topic:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove topic',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Get interest level text
  const getInterestLevelText = (level) => {
    switch (level) {
      case 1: return 'Very Low';
      case 2: return 'Low';
      case 3: return 'Moderate';
      case 4: return 'High';
      case 5: return 'Very High';
      default: return 'Moderate';
    }
  };
  
  // Get proficiency level text
  const getProficiencyLevelText = (level) => {
    switch (level) {
      case 1: return 'Beginner';
      case 2: return 'Novice';
      case 3: return 'Intermediate';
      case 4: return 'Advanced';
      case 5: return 'Expert';
      default: return 'Intermediate';
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Topics of Interest
        </CardTitle>
        <CardDescription>
          Add topics you're interested in learning about
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Topics */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Your Topics</h3>
          <div className="flex flex-wrap gap-2">
            {userTopics.length > 0 ? (
              userTopics.map(topic => (
                <Badge 
                  key={topic.id} 
                  variant="secondary" 
                  className="flex items-center gap-1 py-1 px-2"
                >
                  <span>{topic.topic}</span>
                  <button 
                    type="button" 
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                    onClick={() => handleRemoveTopic(topic.id)}
                    disabled={loading}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No topics added yet</p>
            )}
          </div>
        </div>
        
        {/* Add New Topic */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-medium">Add New Topic</h3>
          
          {selectedTopic ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className="text-base py-1 px-3">{selectedTopic}</Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedTopic(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Interest Level</Label>
                  <span className="text-sm text-muted-foreground">
                    {getInterestLevelText(interestLevel)}
                  </span>
                </div>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[interestLevel]}
                  onValueChange={handleInterestLevelChange}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Proficiency Level</Label>
                  <span className="text-sm text-muted-foreground">
                    {getProficiencyLevelText(proficiencyLevel)}
                  </span>
                </div>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[proficiencyLevel]}
                  onValueChange={handleProficiencyLevelChange}
                />
              </div>
              
              <Button 
                onClick={handleAddTopic} 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Topic
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Search or enter a topic..."
                  value={topicInput}
                  onChange={handleTopicInputChange}
                />
                {topicInput && (
                  <Button 
                    onClick={() => handleSelectTopic(topicInput)}
                    disabled={loading}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {suggestedTopics.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center">
                    <Sparkles className="h-4 w-4 mr-1 text-muted-foreground" />
                    Suggested Topics
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTopics.map(topic => (
                      <Badge 
                        key={topic} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-secondary"
                        onClick={() => handleSelectTopic(topic)}
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Adding topics helps us provide more relevant recommendations
        </p>
      </CardFooter>
    </Card>
  );
};

export default TopicSelector;
