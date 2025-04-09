import React, { useState, useEffect } from 'react';
import { useSpacedRepetition, useAdaptiveAlgorithm } from '@/services/spaced-repetition';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Brain,
  BarChart,
  Target,
  Loader2,
  Sparkles
} from 'lucide-react';

/**
 * Adaptive Settings Component
 * Allows users to configure the adaptive spaced repetition algorithm
 * @returns {React.ReactElement} Adaptive settings component
 */
const AdaptiveSettings = () => {
  const { user } = useAuth();
  const spacedRepetition = useSpacedRepetition();
  const adaptiveAlgorithm = useAdaptiveAlgorithm();
  
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  
  // Load settings
  useEffect(() => {
    if (!user) return;
    
    const loadSettings = async () => {
      try {
        setLoading(true);
        
        // Initialize services if needed
        if (!spacedRepetition.initialized) {
          await spacedRepetition.initialize(user.id);
        }
        
        if (!adaptiveAlgorithm.initialized) {
          await adaptiveAlgorithm.initialize(user.id);
        }
        
        // Load settings
        const userSettings = await adaptiveAlgorithm.loadUserSettings();
        setSettings(userSettings);
      } catch (error) {
        console.error('Error loading settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load adaptive settings',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, [user, spacedRepetition, adaptiveAlgorithm]);
  
  // Handle settings change
  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) : value
    }));
  };
  
  // Handle nested settings change
  const handleNestedSettingsChange = (name, value) => {
    setSettings(prev => ({
      ...prev,
      settings_data: {
        ...prev.settings_data,
        [name]: value
      }
    }));
  };
  
  // Handle slider change
  const handleSliderChange = (name, value) => {
    setSettings(prev => ({
      ...prev,
      [name]: value[0]
    }));
  };
  
  // Handle nested slider change
  const handleNestedSliderChange = (name, value) => {
    setSettings(prev => ({
      ...prev,
      settings_data: {
        ...prev.settings_data,
        [name]: value[0]
      }
    }));
  };
  
  // Handle save settings
  const handleSaveSettings = async () => {
    if (!user || !settings) return;
    
    try {
      setSaving(true);
      
      // Update settings
      const updatedSettings = await adaptiveAlgorithm.updateSettings(settings);
      setSettings(updatedSettings);
      
      toast({
        title: 'Settings Saved',
        description: 'Your adaptive settings have been saved successfully',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Save Failed',
        description: error.message || 'An error occurred while saving settings',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Handle reset settings
  const handleResetSettings = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      
      // Reset to default settings
      const defaultSettings = {
        algorithm_type: 'adaptive',
        new_cards_per_day: 20,
        review_cards_per_day: 100,
        learn_ahead_time: 20,
        timezone: 'UTC',
        learn_steps: [1, 10],
        relearn_steps: [10],
        initial_ease: 250,
        easy_bonus: 1.3,
        interval_modifier: 1.0,
        maximum_interval: 36500,
        settings_data: {
          difficulty_weight: 1.0,
          retention_target: 0.9,
          adaptive_interval_scaling: true,
          time_weight: 0.5,
          error_weight: 1.5,
          pattern_recognition: true
        }
      };
      
      // Update settings
      const updatedSettings = await adaptiveAlgorithm.updateSettings(defaultSettings);
      setSettings(updatedSettings);
      
      toast({
        title: 'Settings Reset',
        description: 'Your adaptive settings have been reset to defaults',
      });
    } catch (error) {
      console.error('Error resetting settings:', error);
      toast({
        title: 'Reset Failed',
        description: error.message || 'An error occurred while resetting settings',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Handle analyze learning patterns
  const handleAnalyzeLearningPatterns = async () => {
    if (!user) return;
    
    try {
      setAnalyzing(true);
      
      // Analyze learning patterns
      const result = await adaptiveAlgorithm.applyLearningPatternAnalysis(user.id);
      
      // Update settings
      setSettings(result.settings);
      
      // Set analysis
      setAnalysis(result.analysis);
      
      toast({
        title: 'Analysis Complete',
        description: 'Your learning patterns have been analyzed and settings optimized',
      });
    } catch (error) {
      console.error('Error analyzing learning patterns:', error);
      toast({
        title: 'Analysis Failed',
        description: error.message || 'An error occurred while analyzing learning patterns',
        variant: 'destructive'
      });
    } finally {
      setAnalyzing(false);
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
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render if no settings
  if (!settings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Adaptive Settings</CardTitle>
          <CardDescription>
            Configure your adaptive spaced repetition algorithm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Unable to load settings. Please try again later.</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Adaptive Settings</CardTitle>
        <CardDescription>
          Configure your adaptive spaced repetition algorithm
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Basic</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span>Advanced</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span>Analysis</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new_cards_per_day">New Cards Per Day</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="new_cards_per_day"
                    min={1}
                    max={100}
                    step={1}
                    value={[settings.new_cards_per_day]}
                    onValueChange={(value) => handleSliderChange('new_cards_per_day', value)}
                  />
                  <span className="w-12 text-center">{settings.new_cards_per_day}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="review_cards_per_day">Review Cards Per Day</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="review_cards_per_day"
                    min={10}
                    max={500}
                    step={10}
                    value={[settings.review_cards_per_day]}
                    onValueChange={(value) => handleSliderChange('review_cards_per_day', value)}
                  />
                  <span className="w-12 text-center">{settings.review_cards_per_day}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interval_modifier">Interval Modifier (%)</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="interval_modifier"
                    min={50}
                    max={150}
                    step={5}
                    value={[settings.interval_modifier]}
                    onValueChange={(value) => handleSliderChange('interval_modifier', value)}
                  />
                  <span className="w-12 text-center">{settings.interval_modifier}%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Higher values increase intervals between reviews
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="initial_ease">Initial Ease Factor (%)</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="initial_ease"
                    min={130}
                    max={350}
                    step={10}
                    value={[settings.initial_ease]}
                    onValueChange={(value) => handleSliderChange('initial_ease', value)}
                  />
                  <span className="w-12 text-center">{settings.initial_ease}%</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="adaptive_interval_scaling"
                  checked={settings.settings_data?.adaptive_interval_scaling || false}
                  onCheckedChange={(checked) => 
                    handleNestedSettingsChange('adaptive_interval_scaling', checked)
                  }
                />
                <Label htmlFor="adaptive_interval_scaling">
                  Enable Adaptive Interval Scaling
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="pattern_recognition"
                  checked={settings.settings_data?.pattern_recognition || false}
                  onCheckedChange={(checked) => 
                    handleNestedSettingsChange('pattern_recognition', checked)
                  }
                />
                <Label htmlFor="pattern_recognition">
                  Enable Pattern Recognition
                </Label>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="retention_target">Retention Target</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="retention_target"
                    min={0.7}
                    max={0.95}
                    step={0.05}
                    value={[settings.settings_data?.retention_target || 0.9]}
                    onValueChange={(value) => handleNestedSliderChange('retention_target', value)}
                  />
                  <span className="w-12 text-center">
                    {Math.round((settings.settings_data?.retention_target || 0.9) * 100)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Target percentage of cards you want to remember
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time_weight">Time Weight</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="time_weight"
                    min={0}
                    max={1}
                    step={0.1}
                    value={[settings.settings_data?.time_weight || 0.5]}
                    onValueChange={(value) => handleNestedSliderChange('time_weight', value)}
                  />
                  <span className="w-12 text-center">
                    {settings.settings_data?.time_weight || 0.5}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  How much to adjust intervals based on answer time
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="error_weight">Error Weight</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="error_weight"
                    min={0.5}
                    max={2.5}
                    step={0.1}
                    value={[settings.settings_data?.error_weight || 1.5]}
                    onValueChange={(value) => handleNestedSliderChange('error_weight', value)}
                  />
                  <span className="w-12 text-center">
                    {settings.settings_data?.error_weight || 1.5}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  How much to penalize cards with frequent errors
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="difficulty_weight">Difficulty Weight</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="difficulty_weight"
                    min={0.5}
                    max={1.5}
                    step={0.1}
                    value={[settings.settings_data?.difficulty_weight || 1.0]}
                    onValueChange={(value) => handleNestedSliderChange('difficulty_weight', value)}
                  />
                  <span className="w-12 text-center">
                    {settings.settings_data?.difficulty_weight || 1.0}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  How much to adjust for card difficulty
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maximum_interval">Maximum Interval (days)</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="maximum_interval"
                    min={30}
                    max={365 * 10}
                    step={30}
                    value={[settings.maximum_interval]}
                    onValueChange={(value) => handleSliderChange('maximum_interval', value)}
                  />
                  <span className="w-12 text-center">
                    {settings.maximum_interval}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analysis">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Learning Pattern Analysis</h3>
                <Button
                  onClick={handleAnalyzeLearningPatterns}
                  disabled={analyzing}
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Analyze & Optimize
                    </>
                  )}
                </Button>
              </div>
              
              {analysis ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-3">
                      <p className="text-sm font-medium">Retention Rate</p>
                      <p className="text-2xl font-bold">
                        {Math.round(analysis.retentionRate * 100)}%
                      </p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <p className="text-sm font-medium">Average Ease Factor</p>
                      <p className="text-2xl font-bold">
                        {analysis.averageEaseFactor.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  {analysis.difficultTags && analysis.difficultTags.length > 0 && (
                    <div className="border rounded-lg p-3">
                      <p className="text-sm font-medium mb-2">Difficult Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.difficultTags.map((tag, index) => (
                          <div 
                            key={index}
                            className="bg-destructive/10 text-destructive px-2 py-1 rounded text-xs"
                          >
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {analysis.optimalReviewTimes && analysis.optimalReviewTimes.length > 0 && (
                    <div className="border rounded-lg p-3">
                      <p className="text-sm font-medium mb-2">Optimal Review Times</p>
                      <div className="space-y-2">
                        {analysis.optimalReviewTimes.map((time, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm">
                              {time.hour}:00
                            </span>
                            <div className="w-2/3 bg-muted h-2 rounded-full overflow-hidden">
                              <div 
                                className="bg-primary h-2" 
                                style={{ width: `${time.performance * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {Math.round(time.performance * 100)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="border rounded-lg p-3">
                    <p className="text-sm font-medium mb-2">Recommended Settings</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>New Cards Per Day:</span>
                        <span className="font-medium">{analysis.recommendedSettings.new_cards_per_day}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Interval Modifier:</span>
                        <span className="font-medium">{analysis.recommendedSettings.interval_modifier}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Retention Target:</span>
                        <span className="font-medium">
                          {Math.round(analysis.recommendedSettings.settings_data.retention_target * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 border rounded-lg">
                  <BarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Analysis Data</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Analyze your learning patterns to get personalized recommendations.
                  </p>
                  <Button 
                    onClick={handleAnalyzeLearningPatterns}
                    disabled={analyzing}
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      'Run Analysis'
                    )}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleResetSettings}
          disabled={saving}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
        <Button 
          onClick={handleSaveSettings}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdaptiveSettings;
