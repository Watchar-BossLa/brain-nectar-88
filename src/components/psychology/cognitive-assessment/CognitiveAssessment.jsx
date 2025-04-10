import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Clock, Zap, Target, BarChart, Download } from 'lucide-react';

/**
 * CognitiveAssessment component for assessing cognitive functions
 * @returns {React.ReactElement} CognitiveAssessment component
 */
const CognitiveAssessment = () => {
  const [activeTest, setActiveTest] = useState(null);
  const [testState, setTestState] = useState('intro'); // intro, running, completed
  const [testResults, setTestResults] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState([]);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  
  // Test definitions
  const tests = {
    memory: {
      title: 'Memory Assessment',
      description: 'Tests your ability to recall information after short and long delays',
      icon: <Brain className="h-5 w-5" />,
      duration: '5-7 minutes',
      skills: ['Short-term memory', 'Working memory', 'Visual memory', 'Verbal memory'],
      questions: [
        {
          type: 'memorize',
          prompt: 'Memorize these words. You will be asked to recall them later.',
          content: ['Apple', 'House', 'Cat', 'Book', 'River', 'Clock', 'Mountain', 'Key'],
          duration: 30,
          response: null
        },
        {
          type: 'distractor',
          prompt: 'Count backwards from 100 by 7s',
          content: 'Enter the numbers as you count: 100, 93, 86...',
          duration: 20,
          response: null
        },
        {
          type: 'recall',
          prompt: 'Recall as many words as you can from the list you memorized',
          content: 'Type each word separated by a comma',
          originalItems: ['Apple', 'House', 'Cat', 'Book', 'River', 'Clock', 'Mountain', 'Key'],
          response: null
        },
        {
          type: 'memorize',
          prompt: 'Memorize this pattern',
          content: [
            [1, 0, 1],
            [0, 1, 0],
            [1, 0, 1]
          ],
          duration: 15,
          response: null
        },
        {
          type: 'recall',
          prompt: 'Recreate the pattern you just saw',
          content: 'Click on the cells to toggle them on/off',
          originalItems: [
            [1, 0, 1],
            [0, 1, 0],
            [1, 0, 1]
          ],
          response: null
        }
      ]
    },
    attention: {
      title: 'Attention Assessment',
      description: 'Measures your ability to focus and sustain attention',
      icon: <Target className="h-5 w-5" />,
      duration: '4-6 minutes',
      skills: ['Sustained attention', 'Selective attention', 'Divided attention', 'Attention switching'],
      questions: [
        {
          type: 'cpt',
          prompt: 'Press the spacebar whenever you see the letter X',
          content: 'You will see a series of letters. Press the spacebar only when you see the letter X.',
          duration: 60,
          targetStimulus: 'X',
          stimuli: ['A', 'B', 'X', 'C', 'D', 'X', 'E', 'F', 'G', 'X', 'H', 'I', 'J', 'X', 'K', 'L', 'M', 'X'],
          response: null
        },
        {
          type: 'stroop',
          prompt: 'Name the color of the text, not the word',
          content: 'You will see color words (like "RED") displayed in different colors. Select the color of the text, not the word itself.',
          items: [
            { word: 'RED', color: 'blue' },
            { word: 'GREEN', color: 'red' },
            { word: 'BLUE', color: 'green' },
            { word: 'RED', color: 'green' },
            { word: 'GREEN', color: 'blue' },
            { word: 'BLUE', color: 'red' }
          ],
          response: null
        }
      ]
    },
    processing: {
      title: 'Processing Speed',
      description: 'Evaluates how quickly you can process information and respond',
      icon: <Zap className="h-5 w-5" />,
      duration: '3-5 minutes',
      skills: ['Visual processing', 'Reaction time', 'Decision speed', 'Cognitive efficiency'],
      questions: [
        {
          type: 'reaction',
          prompt: 'Click as quickly as possible when the circle turns green',
          content: 'Wait for the circle to change from red to green, then click as quickly as possible.',
          trials: 5,
          response: null
        },
        {
          type: 'digit-symbol',
          prompt: 'Match the symbols to their corresponding numbers as quickly as possible',
          content: 'You will see a key showing which symbol corresponds to each number. Then you will need to fill in the correct symbols for a series of numbers.',
          key: {
            '1': '✓',
            '2': '✗',
            '3': '△',
            '4': '○',
            '5': '□',
            '6': '★',
            '7': '♦',
            '8': '♣',
            '9': '♠'
          },
          items: [1, 5, 2, 8, 4, 9, 3, 7, 6, 2, 5, 1, 9, 4, 8, 3, 7, 6],
          response: null
        }
      ]
    }
  };
  
  // Start a test
  const startTest = (testId) => {
    setActiveTest(testId);
    setTestState('intro');
    setCurrentQuestion(0);
    setResponses([]);
    setTimer(0);
    
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };
  
  // Begin the actual test after intro
  const beginTest = () => {
    setTestState('running');
    
    // Start timer
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    
    setTimerInterval(interval);
  };
  
  // Handle response to a question
  const handleResponse = (response) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = response;
    setResponses(newResponses);
    
    // Move to next question or complete test
    if (currentQuestion < tests[activeTest].questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeTest(newResponses);
    }
  };
  
  // Complete the test and calculate results
  const completeTest = (finalResponses) => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    // Calculate results (simplified for this example)
    const results = {
      testId: activeTest,
      title: tests[activeTest].title,
      completionTime: timer,
      score: calculateScore(activeTest, finalResponses),
      percentile: Math.floor(Math.random() * 100), // Placeholder for actual percentile calculation
      strengths: [],
      weaknesses: [],
      recommendations: []
    };
    
    // Determine strengths and weaknesses based on the test
    if (activeTest === 'memory') {
      if (results.score > 70) {
        results.strengths.push('Strong recall ability', 'Good working memory');
        results.recommendations.push('Challenge yourself with more complex memory tasks', 'Try dual-task memory exercises');
      } else {
        results.weaknesses.push('Difficulty with recall', 'Limited working memory capacity');
        results.recommendations.push('Practice memory techniques like chunking', 'Use visualization strategies for better recall');
      }
    } else if (activeTest === 'attention') {
      if (results.score > 70) {
        results.strengths.push('Sustained focus', 'Good selective attention');
        results.recommendations.push('Practice divided attention tasks', 'Try more complex attention-switching exercises');
      } else {
        results.weaknesses.push('Attention lapses', 'Difficulty filtering distractions');
        results.recommendations.push('Practice mindfulness to improve focus', 'Work in shorter, focused sessions with breaks');
      }
    } else if (activeTest === 'processing') {
      if (results.score > 70) {
        results.strengths.push('Quick reaction time', 'Efficient information processing');
        results.recommendations.push('Challenge yourself with time-pressure tasks', 'Try complex decision-making under time constraints');
      } else {
        results.weaknesses.push('Slower processing speed', 'Delayed reaction time');
        results.recommendations.push('Practice speed-based cognitive games', 'Focus on one task at a time to build processing efficiency');
      }
    }
    
    // Update results and change state
    setTestResults({
      ...testResults,
      [activeTest]: results
    });
    
    setTestState('completed');
  };
  
  // Calculate score based on test type and responses
  const calculateScore = (testId, testResponses) => {
    // This would be a more complex calculation in a real implementation
    // For this example, we'll return a random score between 50-90
    return Math.floor(Math.random() * 40) + 50;
  };
  
  // Format time from seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Reset the current test
  const resetTest = () => {
    setTestState('intro');
    setCurrentQuestion(0);
    setResponses([]);
    setTimer(0);
    
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };
  
  // Return to test selection
  const backToTests = () => {
    setActiveTest(null);
    setTestState('intro');
    setCurrentQuestion(0);
    setResponses([]);
    setTimer(0);
    
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };
  
  // Render the current question
  const renderQuestion = () => {
    if (!activeTest || testState !== 'running') return null;
    
    const question = tests[activeTest].questions[currentQuestion];
    
    switch (question.type) {
      case 'memorize':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{question.prompt}</h3>
            <div className="bg-muted p-4 rounded-md">
              {Array.isArray(question.content[0]) ? (
                // Render grid pattern
                <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                  {question.content.map((row, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <div 
                          key={`${rowIndex}-${cellIndex}`}
                          className={`w-12 h-12 rounded-md ${cell ? 'bg-primary' : 'bg-secondary'}`}
                        ></div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                // Render word list
                <div className="flex flex-wrap gap-3 justify-center">
                  {question.content.map((item, index) => (
                    <div key={index} className="px-3 py-2 bg-background rounded-md shadow-sm">
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Memorize for {question.duration} seconds
              </div>
              <Button onClick={() => handleResponse(true)}>
                Next
              </Button>
            </div>
          </div>
        );
        
      case 'recall':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{question.prompt}</h3>
            {Array.isArray(question.originalItems[0]) ? (
              // Render grid for pattern recall
              <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                {Array(3).fill().map((_, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    {Array(3).fill().map((_, cellIndex) => (
                      <div 
                        key={`${rowIndex}-${cellIndex}`}
                        className="w-12 h-12 rounded-md bg-secondary cursor-pointer hover:bg-secondary/80"
                        onClick={() => {
                          // In a real implementation, this would toggle cells in a state
                          console.log(`Toggled cell ${rowIndex}-${cellIndex}`);
                        }}
                      ></div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              // Render input for word recall
              <textarea 
                className="w-full h-24 p-2 border rounded-md"
                placeholder={question.content}
                onChange={(e) => {
                  // In a real implementation, this would update a state
                  console.log(`Input: ${e.target.value}`);
                }}
              ></textarea>
            )}
            <div className="flex justify-end">
              <Button onClick={() => handleResponse(true)}>
                Submit
              </Button>
            </div>
          </div>
        );
        
      case 'distractor':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{question.prompt}</h3>
            <div className="bg-muted p-4 rounded-md">
              <p>{question.content}</p>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Continue for {question.duration} seconds
              </div>
              <Button onClick={() => handleResponse(true)}>
                Next
              </Button>
            </div>
          </div>
        );
        
      case 'cpt':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{question.prompt}</h3>
            <div className="bg-muted p-8 rounded-md flex items-center justify-center">
              <div className="text-6xl font-bold">
                {/* In a real implementation, this would cycle through stimuli */}
                {question.stimuli[0]}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Test will run for {question.duration} seconds
              </div>
              <Button onClick={() => handleResponse(true)}>
                Start Test
              </Button>
            </div>
          </div>
        );
        
      case 'stroop':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{question.prompt}</h3>
            <div className="bg-muted p-8 rounded-md flex items-center justify-center">
              <div 
                className="text-4xl font-bold"
                style={{ color: question.items[0].color }}
              >
                {question.items[0].word}
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <Button 
                className="bg-red-500 hover:bg-red-600"
                onClick={() => handleResponse('red')}
              >
                Red
              </Button>
              <Button 
                className="bg-green-500 hover:bg-green-600"
                onClick={() => handleResponse('green')}
              >
                Green
              </Button>
              <Button 
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => handleResponse('blue')}
              >
                Blue
              </Button>
            </div>
          </div>
        );
        
      case 'reaction':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{question.prompt}</h3>
            <div 
              className="bg-red-500 hover:bg-red-600 w-32 h-32 rounded-full mx-auto cursor-pointer"
              onClick={() => handleResponse(true)}
            ></div>
            <div className="text-center text-sm text-muted-foreground">
              Wait for the circle to turn green, then click as quickly as possible
            </div>
          </div>
        );
        
      case 'digit-symbol':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{question.prompt}</h3>
            <div className="bg-muted p-4 rounded-md">
              <div className="flex justify-center gap-2 mb-4">
                {Object.entries(question.key).map(([digit, symbol]) => (
                  <div key={digit} className="flex flex-col items-center">
                    <div className="text-sm font-medium">{digit}</div>
                    <div className="w-8 h-8 flex items-center justify-center border rounded-md">
                      {symbol}
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-9 gap-2">
                {question.items.map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="text-sm font-medium">{item}</div>
                    <div className="w-8 h-8 flex items-center justify-center border rounded-md bg-background">
                      {/* In a real implementation, this would be an input field */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => handleResponse(true)}>
                Submit
              </Button>
            </div>
          </div>
        );
        
      default:
        return <div>Unknown question type</div>;
    }
  };
  
  // Render test results
  const renderResults = () => {
    if (!activeTest || testState !== 'completed') return null;
    
    const result = testResults[activeTest];
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-medium">{result.title} Results</h3>
            <p className="text-sm text-muted-foreground">
              Completed in {formatTime(result.completionTime)}
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Results
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{result.score}</div>
                <p className="text-sm text-muted-foreground">Overall Score</p>
              </div>
              <div className="mt-4">
                <Progress value={result.score} className="h-2" />
              </div>
              <div className="mt-2 text-center">
                <span className="text-sm">
                  {result.score < 60 ? 'Below Average' : 
                   result.score < 75 ? 'Average' : 
                   result.score < 90 ? 'Above Average' : 'Excellent'}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{result.percentile}<sup>th</sup></div>
                <p className="text-sm text-muted-foreground">Percentile</p>
              </div>
              <div className="mt-4 text-center text-sm">
                You performed better than {result.percentile}% of people in your age group
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{formatTime(result.completionTime)}</div>
                <p className="text-sm text-muted-foreground">Completion Time</p>
              </div>
              <div className="mt-4 text-center text-sm">
                {result.completionTime < 120 ? 'Fast completion' : 
                 result.completionTime < 240 ? 'Average completion time' : 
                 'Longer than average completion time'}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Strengths</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="text-green-500 mt-0.5">•</div>
                    <div>{strength}</div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Areas for Improvement</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="text-amber-500 mt-0.5">•</div>
                    <div>{weakness}</div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="text-primary mt-0.5">•</div>
                  <div>{recommendation}</div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={resetTest}>
            Retake Test
          </Button>
          <Button onClick={backToTests}>
            Back to Tests
          </Button>
        </div>
      </div>
    );
  };
  
  // Main render function
  return (
    <div className="space-y-6">
      {!activeTest ? (
        // Test selection screen
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(tests).map(([testId, test]) => (
            <Card key={testId} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => startTest(testId)}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    {test.icon}
                  </div>
                  <CardTitle>{test.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{test.description}</p>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{test.duration}</span>
                  </div>
                  {testResults[testId] && (
                    <Badge variant="outline">
                      Score: {testResults[testId].score}
                    </Badge>
                  )}
                </div>
                <div className="mt-3">
                  <div className="text-xs text-muted-foreground mb-1">Skills Assessed:</div>
                  <div className="flex flex-wrap gap-1">
                    {test.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Active test screen
        <div>
          {testState === 'intro' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={backToTests} className="p-2">
                  ←
                </Button>
                <h2 className="text-2xl font-bold">{tests[activeTest].title}</h2>
              </div>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p>{tests[activeTest].description}</p>
                    
                    <div className="bg-muted p-4 rounded-md">
                      <h3 className="font-medium mb-2">Instructions</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <div className="text-primary mt-0.5">•</div>
                          <div>This test will take approximately {tests[activeTest].duration} to complete.</div>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="text-primary mt-0.5">•</div>
                          <div>Find a quiet place without distractions.</div>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="text-primary mt-0.5">•</div>
                          <div>Read each instruction carefully before responding.</div>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="text-primary mt-0.5">•</div>
                          <div>Work as quickly and accurately as you can.</div>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="text-primary mt-0.5">•</div>
                          <div>Once you begin, try to complete the entire test without interruption.</div>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Skills Assessed</h3>
                      <div className="flex flex-wrap gap-2">
                        {tests[activeTest].skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={beginTest}>
                        Begin Test
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {testState === 'running' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{tests[activeTest].title}</h2>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{formatTime(timer)}</span>
                </div>
              </div>
              
              <Progress 
                value={(currentQuestion / tests[activeTest].questions.length) * 100} 
                className="h-2"
              />
              
              <Card>
                <CardContent className="pt-6">
                  {renderQuestion()}
                </CardContent>
              </Card>
            </div>
          )}
          
          {testState === 'completed' && renderResults()}
        </div>
      )}
    </div>
  );
};

export default CognitiveAssessment;
