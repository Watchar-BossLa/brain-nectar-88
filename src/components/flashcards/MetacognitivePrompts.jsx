
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Lightbulb, ArrowDown, ArrowUp } from 'lucide-react';

/**
 * Metacognitive feedback system for improving learning strategies
 * 
 * @param {Object} props - Component props
 * @param {Object} props.flashcard - The flashcard being reviewed
 * @param {number} props.difficulty - The difficulty rating given (1-5)
 * @param {Function} props.onComplete - Callback when prompts are complete
 * @param {string} props.contentType - Type of flashcard content
 * @param {string} props.topicId - Topic ID of the flashcard
 */
const MetacognitivePrompts = ({ 
  flashcard, 
  difficulty, 
  onComplete, 
  contentType = 'text',
  topicId
}) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [responses, setResponses] = useState({
    mainDifficulty: '',
    learningStrategy: '',
    confidence: '',
    reflections: ''
  });
  const [suggestedStrategies, setSuggestedStrategies] = useState([]);

  // Generate appropriate prompts based on difficulty and content type
  useEffect(() => {
    generatePrompts();
  }, [difficulty, contentType]);

  const generatePrompts = () => {
    // Generate different strategies based on content type
    const strategies = {
      text: [
        'Create a mental image connecting key concepts',
        'Use spaced repetition at increasing intervals',
        'Create a mnemonic device for key terms',
        'Explain the concept to someone else',
        'Connect this information to something you already know'
      ],
      math: [
        'Practice similar problems with different values',
        'Draw diagrams to visualize the concepts',
        'Break down complex formulas into simpler steps',
        'Find real-world applications of the concept',
        'Try teaching the method to someone else'
      ],
      formula: [
        'Understand each variable in the formula',
        'Practice applying the formula to varied scenarios',
        'Create a visual representation of the formula',
        'Write down the formula repeatedly from memory',
        'Create a step-by-step approach to formula application'
      ],
      financial: [
        'Connect the concept to real financial statements',
        'Practice with numerical examples',
        'Create flowcharts for complex processes',
        'Apply the concept to a case study',
        'Review relationships between financial concepts'
      ]
    };

    // Set strategies based on content type
    const contentBasedStrategies = strategies[contentType] || strategies.text;
    
    // If difficulty is high, prioritize more intensive strategies
    if (difficulty <= 2) {
      setSuggestedStrategies([
        ...contentBasedStrategies.slice(0, 3),
        'Break down the content into smaller chunks',
        'Create practice questions to test yourself'
      ]);
    } else {
      setSuggestedStrategies(contentBasedStrategies);
    }
  };

  const handleInputChange = (field, value) => {
    setResponses(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    // In a production app, we would save these responses
    toast({
      title: "Learning Reflection Saved",
      description: "Your learning insights have been saved to help improve your study strategy."
    });

    if (onComplete) {
      onComplete(responses);
    }
  };

  const getPromptTitle = () => {
    switch (step) {
      case 1:
        return difficulty <= 2 
          ? "What made this card difficult for you?" 
          : "What helped you remember this information?";
      case 2:
        return "Which learning strategy would help you with this content?";
      case 3:
        return "Reflect on your understanding";
      default:
        return "";
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
          {getPromptTitle()}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <RadioGroup 
              value={responses.mainDifficulty} 
              onValueChange={(value) => handleInputChange('mainDifficulty', value)}
            >
              {difficulty <= 2 ? (
                // Options for difficult cards
                <>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="concept" id="concept" />
                    <Label htmlFor="concept">I don't understand the concept</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="recall" id="recall" />
                    <Label htmlFor="recall">I couldn't recall the information</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="confusion" id="confusion" />
                    <Label htmlFor="confusion">I confused it with something else</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="connections" id="connections" />
                    <Label htmlFor="connections">I can't see how it connects to other concepts</Label>
                  </div>
                </>
              ) : (
                // Options for easier cards
                <>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="previous" id="previous" />
                    <Label htmlFor="previous">I've seen this many times before</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="connections" id="connections" />
                    <Label htmlFor="connections">I connected it to things I already know</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="visualization" id="visualization" />
                    <Label htmlFor="visualization">I visualized or created a mental image</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mnemonic" id="mnemonic" />
                    <Label htmlFor="mnemonic">I used a memory technique</Label>
                  </div>
                </>
              )}
            </RadioGroup>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-2">
              Choose a strategy that might help you learn this better:
            </p>
            <RadioGroup 
              value={responses.learningStrategy} 
              onValueChange={(value) => handleInputChange('learningStrategy', value)}
            >
              {suggestedStrategies.map((strategy, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={`strategy-${index}`} id={`strategy-${index}`} />
                  <Label htmlFor={`strategy-${index}`}>{strategy}</Label>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other-strategy" />
                <Label htmlFor="other-strategy">I have my own approach</Label>
              </div>
            </RadioGroup>
            
            {responses.learningStrategy === 'other' && (
              <Textarea 
                placeholder="Describe your own learning strategy..."
                value={responses.customStrategy || ''}
                onChange={(e) => handleInputChange('customStrategy', e.target.value)}
                className="mt-2"
              />
            )}
          </div>
        )}
        
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-2">
              How confident are you that you'll remember this next time?
            </p>
            <RadioGroup 
              value={responses.confidence} 
              onValueChange={(value) => handleInputChange('confidence', value)}
              className="flex space-x-2"
            >
              <div className="flex flex-1 flex-col items-center p-2 border rounded-md hover:bg-muted/50">
                <Label htmlFor="low" className="mb-1">Low</Label>
                <RadioGroupItem value="low" id="low" className="mx-auto" />
                <ArrowDown className="h-4 w-4 text-red-500 mt-1" />
              </div>
              <div className="flex flex-1 flex-col items-center p-2 border rounded-md hover:bg-muted/50">
                <Label htmlFor="medium" className="mb-1">Medium</Label>
                <RadioGroupItem value="medium" id="medium" className="mx-auto" />
              </div>
              <div className="flex flex-1 flex-col items-center p-2 border rounded-md hover:bg-muted/50">
                <Label htmlFor="high" className="mb-1">High</Label>
                <RadioGroupItem value="high" id="high" className="mx-auto" />
                <ArrowUp className="h-4 w-4 text-green-500 mt-1" />
              </div>
            </RadioGroup>
            
            <div className="mt-4">
              <Label htmlFor="reflections" className="text-sm">
                Any additional reflections on your learning? (optional)
              </Label>
              <Textarea
                id="reflections"
                placeholder="What did you learn about your learning process?"
                value={responses.reflections}
                onChange={(e) => handleInputChange('reflections', e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {step > 1 && (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        <Button 
          onClick={handleNextStep} 
          disabled={
            (step === 1 && !responses.mainDifficulty) || 
            (step === 2 && !responses.learningStrategy) ||
            (step === 3 && !responses.confidence)
          }
          className={step === 1 && !responses.mainDifficulty ? "ml-auto" : ""}
        >
          {step < 3 ? "Next" : "Complete"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MetacognitivePrompts;
