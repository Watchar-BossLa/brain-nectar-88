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
 * TextAnalyzer component for analyzing literary texts
 * @returns {React.ReactElement} TextAnalyzer component
 */
const TextAnalyzer = () => {
  const [text, setText] = useState('');
  const [analysisType, setAnalysisType] = useState('literary-devices');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  
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
    return {
      devices: [
        { 
          type: 'Metaphor', 
          instances: [
            { text: 'it was a tired old town', explanation: 'Personification of the town as being tired' },
            { text: 'were like soft teacakes', explanation: 'Comparing ladies to teacakes' }
          ] 
        },
        { 
          type: 'Imagery', 
          instances: [
            { text: 'streets turned to red slop', explanation: 'Visual imagery of muddy streets' },
            { text: 'bony mules hitched to Hoover carts', explanation: 'Visual imagery of poor conditions' }
          ] 
        },
        { 
          type: 'Alliteration', 
          instances: [
            { text: 'suffered on a summer\'s', explanation: 'Repetition of "s" sound' }
          ] 
        }
      ],
      summary: 'The text employs rich imagery and metaphor to establish setting and atmosphere. The personification of the town as "tired" sets a languid mood, while sensory details about heat and weather create a vivid picture of the southern setting.'
    };
  };
  
  const generateThemeAnalysis = (text) => {
    return {
      themes: [
        { 
          name: 'Time and Change', 
          evidence: 'References to the old town, weather changes, and the passage of time suggest themes of impermanence and nostalgia.',
          strength: 'Strong'
        },
        { 
          name: 'Social Class', 
          evidence: 'Mentions of "ladies" with leisure time for naps contrasted with working animals suggests class distinctions.',
          strength: 'Moderate'
        },
        { 
          name: 'Environment and Human Condition', 
          evidence: 'The oppressive heat affects all living things, suggesting the environment\'s impact on the human condition.',
          strength: 'Strong'
        }
      ],
      summary: 'The passage primarily explores themes of time, social structure, and the relationship between environment and human experience. The languid atmosphere created by the heat serves as both setting and metaphor for the social conditions of the town.'
    };
  };
  
  const generateStyleMetrics = (text) => {
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.length > 0);
    const paragraphs = text.split(/\n\n+/).filter(paragraph => paragraph.length > 0);
    
    return {
      metrics: {
        wordCount: words.length,
        sentenceCount: sentences.length,
        paragraphCount: paragraphs.length,
        averageWordLength: (words.join('').length / words.length).toFixed(1),
        averageWordsPerSentence: (words.length / sentences.length).toFixed(1),
        readabilityScore: 'Grade 8-9 (Moderate)',
        uniqueWords: new Set(words.map(word => word.toLowerCase().replace(/[^a-z]/g, ''))).size
      },
      vocabulary: {
        uncommonWords: ['slop', 'sagged', 'sweltering', 'wilted', 'teacakes', 'frostings', 'talcum'],
        dominantTones: ['Descriptive', 'Nostalgic', 'Atmospheric']
      },
      sentenceStructure: {
        simple: '40%',
        compound: '30%',
        complex: '30%',
        varietyScore: 'High'
      }
    };
  };
  
  const generateCharacterAnalysis = (text) => {
    return {
      characters: [
        {
          name: 'Narrator',
          traits: ['Observant', 'Reflective'],
          role: 'First-person narrator providing perspective on the town'
        },
        {
          name: 'Townspeople',
          traits: ['Affected by heat', 'Following routines'],
          role: 'Background characters establishing setting and social context'
        }
      ],
      relationships: [
        {
          between: ['Narrator', 'Town'],
          nature: 'The narrator has a complex relationship with the town, viewing it with both familiarity and critical distance.'
        }
      ],
      perspective: 'First-person retrospective narration, suggesting the narrator is recalling memories from a distance of time.'
    };
  };
  
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
                    <Select defaultValue="standard">
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
                    <Select defaultValue="detailed">
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
                                  <div className="text-sm text-muted-foreground mt-1">{instance.explanation}</div>
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
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="text-lg font-medium mb-2">Thematic Analysis</h3>
                      <p className="text-muted-foreground">{analysisResults.summary}</p>
                    </div>
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
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="text-lg font-medium mb-2">Narrative Perspective</h3>
                      <p className="text-muted-foreground">{analysisResults.perspective}</p>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="visualization" className="pt-4">
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart className="h-12 w-12 mx-auto mb-4" />
                  <p>Visualizations will be available in a future update.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="annotations" className="pt-4">
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4" />
                  <p>Text annotations will be available in a future update.</p>
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
