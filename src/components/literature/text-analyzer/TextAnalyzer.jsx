import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Search, Sparkles, BarChart, Lightbulb, Download } from 'lucide-react';

/**
 * Enhanced TextAnalyzer component for analyzing literary texts
 * @returns {React.ReactElement} TextAnalyzer component
 */
const TextAnalyzer = () => {
  const [text, setText] = useState('');
  const [analysisType, setAnalysisType] = useState('literary-devices');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [analysisDepth, setAnalysisDepth] = useState('standard');
  const [outputFormat, setOutputFormat] = useState('detailed');

  // Sample literary works for quick analysis
  const sampleTexts = [
    {
      title: "To Kill a Mockingbird (excerpt)",
      author: "Harper Lee",
      text: "Maycomb was an old town, but it was a tired old town when I first knew it. In rainy weather the streets turned to red slop; grass grew on the sidewalks, the courthouse sagged in the square. Somehow, it was hotter then: a black dog suffered on a summer's day; bony mules hitched to Hoover carts flicked flies in the sweltering shade of the live oaks on the square. Men's stiff collars wilted by nine in the morning. Ladies bathed before noon, after their three-o'clock naps, and by nightfall were like soft teacakes with frostings of sweat and sweet talcum."
    },
    {
      title: "The Great Gatsby (excerpt)",
      author: "F. Scott Fitzgerald",
      text: "In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since. 'Whenever you feel like criticizing anyone,' he told me, 'just remember that all the people in this world haven't had the advantages that you've had.'"
    },
    {
      title: "Sonnet 18",
      author: "William Shakespeare",
      text: "Shall I compare thee to a summer's day?\nThou art more lovely and more temperate:\nRough winds do shake the darling buds of May,\nAnd summer's lease hath all too short a date;\nSometime too hot the eye of heaven shines,\nAnd often is his gold complexion dimm'd;\nAnd every fair from fair sometime declines,\nBy chance or nature's changing course untrimm'd;\nBut thy eternal summer shall not fade,\nNor lose possession of that fair thou ow'st;\nNor shall death brag thou wander'st in his shade,\nWhen in eternal lines to time thou grow'st:\nSo long as men can breathe or eyes can see,\nSo long lives this, and this gives life to thee."
    }
  ];

  // Handle text input change
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // Load sample text
  const loadSampleText = (index) => {
    setText(sampleTexts[index].text);
  };

  // Analyze text
  const analyzeText = () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);

    // Simulate analysis with a timeout
    setTimeout(() => {
      // Generate mock analysis results based on the analysis type
      let results;

      switch (analysisType) {
        case 'literary-devices':
          results = generateLiteraryDevicesAnalysis(text);
          break;
        case 'theme-analysis':
          results = generateThemeAnalysis(text);
          break;
        case 'style-metrics':
          results = generateStyleMetrics(text);
          break;
        case 'character-analysis':
          results = generateCharacterAnalysis(text);
          break;
        default:
          results = generateLiteraryDevicesAnalysis(text);
      }

      setAnalysisResults(results);
      setIsAnalyzing(false);
    }, 1500);
  };

  // Mock analysis generators
  const generateLiteraryDevicesAnalysis = (text) => {
    // In a real implementation, this would use NLP to identify literary devices
    const depth = analysisDepth === 'deep' ? 1.5 : analysisDepth === 'basic' ? 0.5 : 1;

    return {
      devices: [
        {
          type: 'Metaphor',
          instances: [
            { text: 'it was a tired old town', explanation: 'Personification of the town as being tired', confidence: 0.9 * depth },
            { text: 'were like soft teacakes', explanation: 'Comparing ladies to teacakes', confidence: 0.85 * depth }
          ]
        },
        {
          type: 'Imagery',
          instances: [
            { text: 'streets turned to red slop', explanation: 'Visual imagery of muddy streets', confidence: 0.95 * depth },
            { text: 'bony mules hitched to Hoover carts', explanation: 'Visual imagery of poor conditions', confidence: 0.9 * depth },
            { text: 'frostings of sweat and sweet talcum', explanation: 'Tactile and olfactory imagery', confidence: 0.88 * depth }
          ]
        },
        {
          type: 'Alliteration',
          instances: [
            { text: 'suffered on a summer\'s', explanation: 'Repetition of "s" sound', confidence: 0.8 * depth },
            { text: 'sweet sweat', explanation: 'Repetition of "sw" sound', confidence: 0.75 * depth }
          ]
        },
        {
          type: 'Symbolism',
          instances: [
            { text: 'courthouse sagged in the square', explanation: 'Symbol of declining justice or authority', confidence: 0.7 * depth }
          ]
        }
      ],
      summary: 'The text employs rich imagery and metaphor to establish setting and atmosphere. The personification of the town as "tired" sets a languid mood, while sensory details about heat and weather create a vivid picture of the southern setting.',
      tone: 'Nostalgic, observational, slightly melancholic',
      recommendations: [
        'Consider how the imagery contributes to the overall mood of the passage',
        'Analyze how the personification of the town reflects the narrator\'s perspective',
        'Explore how the sensory details establish the setting'
      ]
    };
  };

  const generateThemeAnalysis = (text) => {
    const depth = analysisDepth === 'deep' ? 1.5 : analysisDepth === 'basic' ? 0.5 : 1;

    return {
      themes: [
        {
          name: 'Time and Change',
          evidence: 'References to the old town, weather changes, and the passage of time suggest themes of impermanence and nostalgia.',
          strength: 'Strong',
          relevance: 0.9 * depth
        },
        {
          name: 'Social Class',
          evidence: 'Mentions of "ladies" with leisure time for naps contrasted with working animals suggests class distinctions.',
          strength: 'Moderate',
          relevance: 0.7 * depth
        },
        {
          name: 'Environment and Human Condition',
          evidence: 'The oppressive heat affects all living things, suggesting the environment\'s impact on the human condition.',
          strength: 'Strong',
          relevance: 0.85 * depth
        },
        {
          name: 'Decay and Deterioration',
          evidence: 'Descriptions of the sagging courthouse, tired town, and wilting collars suggest decline.',
          strength: 'Moderate',
          relevance: 0.75 * depth
        }
      ],
      summary: 'The passage primarily explores themes of time, social structure, and the relationship between environment and human experience. The languid atmosphere created by the heat serves as both setting and metaphor for the social conditions of the town.',
      connections: [
        { theme: 'Time and Change', work: 'The Great Gatsby', description: 'Similar themes of nostalgia and the passage of time' },
        { theme: 'Social Class', work: 'Pride and Prejudice', description: 'Exploration of social hierarchies and their effects' },
        { theme: 'Environment and Human Condition', work: 'The Grapes of Wrath', description: 'How environmental conditions shape human experience' }
      ],
      recommendations: [
        'Explore how the themes of time and change relate to the historical context of the work',
        'Consider how the environmental descriptions reflect the social conditions',
        'Analyze how the theme of decay might foreshadow later developments in the narrative'
      ]
    };
  };

  const generateStyleMetrics = (text) => {
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.length > 0);
    const paragraphs = text.split(/\n\n+/).filter(paragraph => paragraph.length > 0);

    // Calculate additional metrics based on analysis depth
    const uniqueWords = new Set(words.map(word => word.toLowerCase().replace(/[^a-z]/g, '')));
    const longWords = words.filter(word => word.length > 6).length;
    const shortSentences = sentences.filter(s => s.split(/\s+/).length < 10).length;
    const longSentences = sentences.filter(s => s.split(/\s+/).length > 20).length;

    return {
      metrics: {
        wordCount: words.length,
        sentenceCount: sentences.length,
        paragraphCount: paragraphs.length,
        averageWordLength: (words.join('').length / words.length).toFixed(1),
        averageWordsPerSentence: (words.length / sentences.length).toFixed(1),
        readabilityScore: 'Grade 8-9 (Moderate)',
        uniqueWords: uniqueWords.size,
        lexicalDensity: ((uniqueWords.size / words.length) * 100).toFixed(1) + '%',
        longWordPercentage: ((longWords / words.length) * 100).toFixed(1) + '%'
      },
      vocabulary: {
        uncommonWords: ['slop', 'sagged', 'sweltering', 'wilted', 'teacakes', 'frostings', 'talcum'],
        dominantTones: ['Descriptive', 'Nostalgic', 'Atmospheric'],
        wordFrequency: [
          { word: 'town', count: 2 },
          { word: 'old', count: 2 },
          { word: 'the', count: 5 }
        ],
        wordCategories: {
          descriptive: ['tired', 'old', 'red', 'sweltering', 'stiff'],
          action: ['turned', 'grew', 'sagged', 'suffered', 'flicked', 'wilted', 'bathed'],
          time: ['morning', 'noon', 'nightfall']
        }
      },
      sentenceStructure: {
        simple: '40%',
        compound: '30%',
        complex: '30%',
        varietyScore: 'High',
        patterns: [
          { pattern: 'Subject-Verb-Object', frequency: 'Common' },
          { pattern: 'Compound Sentences', frequency: 'Moderate' },
          { pattern: 'Descriptive Phrases', frequency: 'Very Common' }
        ]
      },
      stylistic: {
        pacing: 'Moderate to slow',
        clarity: 'High',
        formality: 'Moderate',
        voice: 'First-person, observational',
        distinctive: 'Rich sensory details, southern vernacular elements'
      }
    };
  };

  const generateCharacterAnalysis = (text) => {
    const depth = analysisDepth === 'deep' ? 1.5 : analysisDepth === 'basic' ? 0.5 : 1;

    return {
      characters: [
        {
          name: 'Narrator',
          traits: ['Observant', 'Reflective', 'Detail-oriented'],
          role: 'First-person narrator providing perspective on the town',
          development: 'Not enough text to determine character arc',
          confidence: 0.9 * depth
        },
        {
          name: 'Townspeople',
          traits: ['Affected by heat', 'Following routines', 'Class-conscious'],
          role: 'Background characters establishing setting and social context',
          development: 'Static in this excerpt',
          confidence: 0.7 * depth
        },
        {
          name: 'Ladies',
          traits: ['Leisure class', 'Following social customs'],
          role: 'Represent social structure and customs of the town',
          development: 'Not enough text to determine character arc',
          confidence: 0.8 * depth
        }
      ],
      relationships: [
        {
          between: ['Narrator', 'Town'],
          nature: 'The narrator has a complex relationship with the town, viewing it with both familiarity and critical distance.',
          dynamics: 'Observer to observed',
          significance: 'Establishes narrative perspective'
        },
        {
          between: ['Ladies', 'Men'],
          nature: 'Implied gender roles and separate spheres of activity',
          dynamics: 'Social division',
          significance: 'Reflects social structure of the time period'
        }
      ],
      perspective: 'First-person retrospective narration, suggesting the narrator is recalling memories from a distance of time.',
      characterization: {
        method: 'Primarily indirect characterization through observations and descriptions',
        effectiveness: 'Creates a strong sense of place and social context',
        techniques: ['Environmental description', 'Social observation', 'Implied backstory']
      },
      recommendations: [
        'Consider how the narrator\'s perspective shapes our understanding of the town',
        'Analyze how the brief mentions of townspeople establish social context',
        'Explore how character descriptions reflect themes of the work'
      ]
    };
  };

  // Render function
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Text Input */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Text Input</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setText('')}
                    disabled={!text}
                  >
                    Clear
                  </Button>
                  <Select
                    value="sample"
                    onValueChange={(value) => {
                      if (value !== 'sample') {
                        loadSampleText(parseInt(value));
                      }
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Load sample text" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sample">Load sample text</SelectItem>
                      {sampleTexts.map((sample, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {sample.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter or paste text to analyze..."
                className="min-h-[300px] font-mono text-sm"
                value={text}
                onChange={handleTextChange}
              />

              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  {text ? `${text.split(/\s+/).filter(word => word.length > 0).length} words` : 'No text entered'}
                </div>
                <Button
                  onClick={analyzeText}
                  disabled={!text.trim() || isAnalyzing}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Text'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Options */}
        <div>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle>Analysis Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Analysis Type</Label>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant={analysisType === 'literary-devices' ? 'default' : 'outline'}
                    className="justify-start"
                    onClick={() => setAnalysisType('literary-devices')}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Literary Devices
                  </Button>
                  <Button
                    variant={analysisType === 'theme-analysis' ? 'default' : 'outline'}
                    className="justify-start"
                    onClick={() => setAnalysisType('theme-analysis')}
                  >
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Theme Analysis
                  </Button>
                  <Button
                    variant={analysisType === 'style-metrics' ? 'default' : 'outline'}
                    className="justify-start"
                    onClick={() => setAnalysisType('style-metrics')}
                  >
                    <BarChart className="mr-2 h-4 w-4" />
                    Style Metrics
                  </Button>
                  <Button
                    variant={analysisType === 'character-analysis' ? 'default' : 'outline'}
                    className="justify-start"
                    onClick={() => setAnalysisType('character-analysis')}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Character Analysis
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Advanced Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="depth" className="text-sm">Analysis Depth</Label>
                    <Select value={analysisDepth} onValueChange={setAnalysisDepth}>
                      <SelectTrigger id="depth" className="w-[120px]">
                        <SelectValue placeholder="Standard" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="deep">Deep</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="format" className="text-sm">Output Format</Label>
                    <Select value={outputFormat} onValueChange={setOutputFormat}>
                      <SelectTrigger id="format" className="w-[120px]">
                        <SelectValue placeholder="Detailed" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="summary">Summary</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <div className="bg-muted p-3 rounded-md">
                  <h4 className="text-sm font-medium mb-2">Analysis Tips</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• For best results, use passages with at least 100 words</li>
                    <li>• Literary device detection works best with fiction and poetry</li>
                    <li>• Theme analysis requires context-rich passages</li>
                    <li>• Character analysis works best with narrative text</li>
                    <li>• Deep analysis provides more detailed results but may take longer</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analysis Results */}
      {analysisResults && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Analysis Results</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="results">
              <TabsList>
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="visualization">Visualization</TabsTrigger>
                <TabsTrigger value="annotations">Annotations</TabsTrigger>
              </TabsList>

              <TabsContent value="results" className="pt-4">
                {analysisType === 'literary-devices' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Literary Devices</h3>
                      <div className="space-y-4">
                        {analysisResults.devices.map((device, index) => (
                          <div key={index} className="space-y-2">
                            <h4 className="font-medium">{device.type}</h4>
                            <ul className="space-y-2">
                              {device.instances.map((instance, i) => (
                                <li key={i} className="bg-muted p-2 rounded-md">
                                  <div className="font-mono text-sm">"{instance.text}"</div>
                                  <div className="flex justify-between items-center mt-1">
                                    <span className="text-sm text-muted-foreground">{instance.explanation}</span>
                                    {analysisDepth !== 'basic' && (
                                      <Badge variant={instance.confidence > 0.8 ? 'default' : 'outline'}>
                                        {Math.round(instance.confidence * 100)}% confidence
                                      </Badge>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-lg font-medium mb-2">Summary</h3>
                      <p className="text-muted-foreground">{analysisResults.summary}</p>

                      {analysisDepth !== 'basic' && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Tone</h4>
                          <p className="text-muted-foreground">{analysisResults.tone}</p>
                        </div>
                      )}

                      {analysisDepth === 'deep' && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Recommendations</h4>
                          <ul className="space-y-1 text-muted-foreground">
                            {analysisResults.recommendations.map((rec, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {analysisType === 'theme-analysis' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Themes</h3>
                      <div className="space-y-4">
                        {analysisResults.themes.map((theme, index) => (
                          <div key={index} className="border rounded-md p-3">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{theme.name}</h4>
                              <Badge variant={
                                theme.strength === 'Strong' ? 'default' :
                                theme.strength === 'Moderate' ? 'secondary' : 'outline'
                              }>
                                {theme.strength}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">{theme.evidence}</p>

                            {analysisDepth !== 'basic' && (
                              <div className="mt-2 flex justify-end">
                                <Badge variant="outline">
                                  Relevance: {Math.round(theme.relevance * 100)}%
                                </Badge>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-lg font-medium mb-2">Thematic Analysis</h3>
                      <p className="text-muted-foreground">{analysisResults.summary}</p>
                    </div>

                    {analysisDepth !== 'basic' && (
                      <div className="border-t pt-4">
                        <h3 className="text-lg font-medium mb-2">Literary Connections</h3>
                        <div className="space-y-2">
                          {analysisResults.connections.map((connection, i) => (
                            <div key={i} className="bg-muted p-2 rounded-md">
                              <div className="flex items-center gap-2">
                                <Badge>{connection.theme}</Badge>
                                <span className="text-sm font-medium">{connection.work}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{connection.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysisDepth === 'deep' && (
                      <div className="border-t pt-4">
                        <h3 className="text-lg font-medium mb-2">Recommendations</h3>
                        <ul className="space-y-1 text-muted-foreground">
                          {analysisResults.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-primary">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {analysisType === 'style-metrics' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h3 className="text-lg font-medium">Text Metrics</h3>
                        <div className="space-y-2">
                          {Object.entries(analysisResults.metrics).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-muted-foreground">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                              <span className="font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-lg font-medium">Vocabulary</h3>
                        <div>
                          <h4 className="text-sm font-medium">Uncommon Words</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {analysisResults.vocabulary.uncommonWords.map((word, i) => (
                              <Badge key={i} variant="outline">{word}</Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium">Dominant Tones</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {analysisResults.vocabulary.dominantTones.map((tone, i) => (
                              <Badge key={i}>{tone}</Badge>
                            ))}
                          </div>
                        </div>

                        {analysisDepth !== 'basic' && (
                          <div>
                            <h4 className="text-sm font-medium mt-2">Word Frequency</h4>
                            <div className="space-y-1 mt-1">
                              {analysisResults.vocabulary.wordFrequency.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                  <span>"{item.word}"</span>
                                  <span className="text-muted-foreground">{item.count} occurrences</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-lg font-medium mb-2">Sentence Structure</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{analysisResults.sentenceStructure.simple}</div>
                          <div className="text-sm text-muted-foreground">Simple</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{analysisResults.sentenceStructure.compound}</div>
                          <div className="text-sm text-muted-foreground">Compound</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{analysisResults.sentenceStructure.complex}</div>
                          <div className="text-sm text-muted-foreground">Complex</div>
                        </div>
                      </div>
                      <div className="mt-2 text-center">
                        <span className="text-sm text-muted-foreground">Variety Score: </span>
                        <span className="text-sm font-medium">{analysisResults.sentenceStructure.varietyScore}</span>
                      </div>
                    </div>

                    {analysisDepth === 'deep' && (
                      <div className="border-t pt-4">
                        <h3 className="text-lg font-medium mb-2">Stylistic Features</h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          {Object.entries(analysisResults.stylistic).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-muted-foreground">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                              <span className="font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {analysisType === 'character-analysis' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Characters</h3>
                      <div className="space-y-4">
                        {analysisResults.characters.map((character, index) => (
                          <div key={index} className="border rounded-md p-3">
                            <h4 className="font-medium">{character.name}</h4>
                            <div className="mt-2">
                              <span className="text-sm text-muted-foreground">Traits: </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {character.traits.map((trait, i) => (
                                  <Badge key={i} variant="outline">{trait}</Badge>
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">{character.role}</p>

                            {analysisDepth !== 'basic' && (
                              <div className="mt-2">
                                <span className="text-sm text-muted-foreground">Development: </span>
                                <span className="text-sm">{character.development}</span>
                              </div>
                            )}

                            {analysisDepth === 'deep' && (
                              <div className="mt-2 flex justify-end">
                                <Badge variant="outline">
                                  Confidence: {Math.round(character.confidence * 100)}%
                                </Badge>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-lg font-medium mb-2">Relationships</h3>
                      <div className="space-y-3">
                        {analysisResults.relationships.map((relationship, index) => (
                          <div key={index} className="bg-muted p-3 rounded-md">
                            <div className="flex gap-2 items-center">
                              <span className="font-medium">{relationship.between[0]}</span>
                              <span>↔</span>
                              <span className="font-medium">{relationship.between[1]}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">{relationship.nature}</p>

                            {analysisDepth !== 'basic' && (
                              <div className="flex justify-between mt-2">
                                <span className="text-sm">Dynamics: <span className="text-muted-foreground">{relationship.dynamics}</span></span>
                                <span className="text-sm">Significance: <span className="text-muted-foreground">{relationship.significance}</span></span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-lg font-medium mb-2">Narrative Perspective</h3>
                      <p className="text-muted-foreground">{analysisResults.perspective}</p>
                    </div>

                    {analysisDepth === 'deep' && (
                      <div className="border-t pt-4">
                        <h3 className="text-lg font-medium mb-2">Characterization Techniques</h3>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium">Method: </span>
                            <span className="text-sm text-muted-foreground">{analysisResults.characterization.method}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Effectiveness: </span>
                            <span className="text-sm text-muted-foreground">{analysisResults.characterization.effectiveness}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Techniques: </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {analysisResults.characterization.techniques.map((technique, i) => (
                                <Badge key={i} variant="outline">{technique}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="visualization" className="pt-4">
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart className="h-12 w-12 mx-auto mb-4" />
                  <p>Enhanced visualizations are now available!</p>
                  <div className="mt-4 max-w-md mx-auto">
                    {analysisType === 'literary-devices' && (
                      <div className="bg-muted p-4 rounded-md">
                        <h4 className="font-medium mb-2">Device Distribution</h4>
                        <div className="space-y-2">
                          {analysisResults.devices.map((device, i) => (
                            <div key={i} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{device.type}</span>
                                <span>{device.instances.length} instances</span>
                              </div>
                              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-primary h-full rounded-full"
                                  style={{ width: `${(device.instances.length / analysisResults.devices.reduce((acc, d) => acc + d.instances.length, 0)) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysisType === 'theme-analysis' && (
                      <div className="bg-muted p-4 rounded-md">
                        <h4 className="font-medium mb-2">Theme Relevance</h4>
                        <div className="space-y-2">
                          {analysisResults.themes.map((theme, i) => (
                            <div key={i} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{theme.name}</span>
                                <span>{Math.round(theme.relevance * 100)}%</span>
                              </div>
                              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-primary h-full rounded-full"
                                  style={{ width: `${theme.relevance * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysisType === 'style-metrics' && (
                      <div className="bg-muted p-4 rounded-md">
                        <h4 className="font-medium mb-2">Sentence Structure</h4>
                        <div className="flex h-40 items-end justify-center gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className="w-16 bg-blue-500 rounded-t-md"
                              style={{ height: `${parseInt(analysisResults.sentenceStructure.simple) * 2}px` }}
                            ></div>
                            <span className="text-xs mt-1">Simple</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div
                              className="w-16 bg-green-500 rounded-t-md"
                              style={{ height: `${parseInt(analysisResults.sentenceStructure.compound) * 2}px` }}
                            ></div>
                            <span className="text-xs mt-1">Compound</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div
                              className="w-16 bg-purple-500 rounded-t-md"
                              style={{ height: `${parseInt(analysisResults.sentenceStructure.complex) * 2}px` }}
                            ></div>
                            <span className="text-xs mt-1">Complex</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {analysisType === 'character-analysis' && (
                      <div className="bg-muted p-4 rounded-md">
                        <h4 className="font-medium mb-2">Character Confidence</h4>
                        <div className="space-y-2">
                          {analysisResults.characters.map((character, i) => (
                            <div key={i} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{character.name}</span>
                                <span>{Math.round(character.confidence * 100)}%</span>
                              </div>
                              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-primary h-full rounded-full"
                                  style={{ width: `${character.confidence * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="annotations" className="pt-4">
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4" />
                  <p>Enhanced text annotations are now available!</p>
                  <div className="mt-4 max-w-md mx-auto bg-muted p-4 rounded-md">
                    <h4 className="font-medium mb-2">Annotated Text</h4>
                    <div className="text-left font-mono text-sm whitespace-pre-wrap">
                      {text.split(/\n/).map((paragraph, i) => (
                        <p key={i} className="mb-2">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    <div className="mt-4 text-left">
                      <h5 className="text-sm font-medium mb-2">Annotation Legend</h5>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-blue-500">Metaphor</Badge>
                        <Badge className="bg-green-500">Imagery</Badge>
                        <Badge className="bg-purple-500">Alliteration</Badge>
                        <Badge className="bg-amber-500">Symbolism</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TextAnalyzer;
