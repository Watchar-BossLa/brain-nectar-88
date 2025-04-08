import React, { useState } from 'react';
import { useStudyMaterialGenerator } from '@/services/visual-recognition';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { 
  FileText, 
  FlaskConical, 
  BrainCircuit, 
  Network, 
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

/**
 * Study Material Generator Component
 * Generates study materials from visual content
 * @param {Object} props - Component props
 * @param {Object} props.image - Image object
 * @returns {React.ReactElement} Study material generator component
 */
const StudyMaterialGenerator = ({ image }) => {
  const studyMaterialGenerator = useStudyMaterialGenerator();
  const [activeTab, setActiveTab] = useState('notes');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedNotes, setGeneratedNotes] = useState(null);
  const [generatedFlashcards, setGeneratedFlashcards] = useState(null);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [knowledgeNode, setKnowledgeNode] = useState(null);
  
  // Generate study notes
  const handleGenerateNotes = async () => {
    if (!image) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await studyMaterialGenerator.generateStudyNotes(image.id);
      setGeneratedNotes(result);
      
      toast({
        title: 'Study notes generated',
        description: 'Your study notes have been created successfully',
      });
    } catch (err) {
      console.error('Error generating study notes:', err);
      setError(err.message || 'Failed to generate study notes');
      
      toast({
        title: 'Generation failed',
        description: err.message || 'An error occurred while generating study notes',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Generate flashcards
  const handleGenerateFlashcards = async () => {
    if (!image) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const flashcards = await studyMaterialGenerator.generateFlashcards(image.id);
      setGeneratedFlashcards(flashcards);
      
      toast({
        title: 'Flashcards generated',
        description: `${flashcards.length} flashcards have been created successfully`,
      });
    } catch (err) {
      console.error('Error generating flashcards:', err);
      setError(err.message || 'Failed to generate flashcards');
      
      toast({
        title: 'Generation failed',
        description: err.message || 'An error occurred while generating flashcards',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Generate quiz questions
  const handleGenerateQuiz = async () => {
    if (!image) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const quizQuestions = await studyMaterialGenerator.generateQuizQuestions(image.id);
      setGeneratedQuiz(quizQuestions);
      
      toast({
        title: 'Quiz questions generated',
        description: `${quizQuestions.length} quiz questions have been created successfully`,
      });
    } catch (err) {
      console.error('Error generating quiz questions:', err);
      setError(err.message || 'Failed to generate quiz questions');
      
      toast({
        title: 'Generation failed',
        description: err.message || 'An error occurred while generating quiz questions',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Add to knowledge graph
  const handleAddToKnowledgeGraph = async () => {
    if (!image) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const node = await studyMaterialGenerator.addToKnowledgeGraph(image.id);
      setKnowledgeNode(node);
      
      toast({
        title: 'Added to knowledge graph',
        description: 'The image has been added to your knowledge graph',
      });
    } catch (err) {
      console.error('Error adding to knowledge graph:', err);
      setError(err.message || 'Failed to add to knowledge graph');
      
      toast({
        title: 'Operation failed',
        description: err.message || 'An error occurred while adding to knowledge graph',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Render if no image
  if (!image) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Study Material Generator</CardTitle>
          <CardDescription>
            Select an image to generate study materials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No image selected
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Material Generator</CardTitle>
        <CardDescription>
          Generate study materials from your image
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="notes" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Notes</span>
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4" />
              <span className="hidden sm:inline">Flashcards</span>
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4" />
              <span className="hidden sm:inline">Quiz</span>
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              <span className="hidden sm:inline">Knowledge</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Notes tab */}
          <TabsContent value="notes" className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Study Notes</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Generate comprehensive study notes from the visual content in your image.
                The notes will include key points, summaries, and extracted information.
              </p>
              
              {loading && activeTab === 'notes' ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : generatedNotes ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="font-medium">Notes generated successfully!</p>
                  </div>
                  <p className="text-sm">
                    Title: {generatedNotes.studyNotes.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Document ID: {generatedNotes.document.id}
                  </p>
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // TODO: Implement navigation to document
                        toast({
                          title: 'View document',
                          description: 'This feature is not yet implemented',
                        });
                      }}
                    >
                      View Document
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleGenerateNotes}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Study Notes
                    </>
                  )}
                </Button>
              )}
            </div>
            
            {error && activeTab === 'notes' && (
              <div className="border border-destructive rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <p className="font-medium text-destructive">Error</p>
                </div>
                <p className="text-sm text-destructive mt-2">{error}</p>
              </div>
            )}
          </TabsContent>
          
          {/* Flashcards tab */}
          <TabsContent value="flashcards" className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Flashcards</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Generate flashcards from the content in your image.
                These can be used for spaced repetition and active recall practice.
              </p>
              
              {loading && activeTab === 'flashcards' ? (
                <div className="space-y-2">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : generatedFlashcards ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="font-medium">
                      {generatedFlashcards.length} flashcards generated!
                    </p>
                  </div>
                  
                  <div className="mt-2 space-y-2">
                    {generatedFlashcards.slice(0, 2).map((card, index) => (
                      <div key={index} className="border rounded p-3">
                        <p className="font-medium">{card.front}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {card.back.substring(0, 100)}
                          {card.back.length > 100 ? '...' : ''}
                        </p>
                      </div>
                    ))}
                    
                    {generatedFlashcards.length > 2 && (
                      <p className="text-sm text-muted-foreground">
                        And {generatedFlashcards.length - 2} more flashcards...
                      </p>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // TODO: Implement adding to flashcard deck
                        toast({
                          title: 'Add to flashcard deck',
                          description: 'This feature is not yet implemented',
                        });
                      }}
                    >
                      Add to Flashcard Deck
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleGenerateFlashcards}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FlaskConical className="h-4 w-4 mr-2" />
                      Generate Flashcards
                    </>
                  )}
                </Button>
              )}
            </div>
            
            {error && activeTab === 'flashcards' && (
              <div className="border border-destructive rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <p className="font-medium text-destructive">Error</p>
                </div>
                <p className="text-sm text-destructive mt-2">{error}</p>
              </div>
            )}
          </TabsContent>
          
          {/* Quiz tab */}
          <TabsContent value="quiz" className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Quiz Questions</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Generate quiz questions based on the content in your image.
                Test your knowledge with multiple-choice questions.
              </p>
              
              {loading && activeTab === 'quiz' ? (
                <div className="space-y-2">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : generatedQuiz ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="font-medium">
                      {generatedQuiz.length} quiz questions generated!
                    </p>
                  </div>
                  
                  <div className="mt-2 space-y-2">
                    {generatedQuiz.slice(0, 1).map((question, index) => (
                      <div key={index} className="border rounded p-3">
                        <p className="font-medium">{question.question}</p>
                        <div className="mt-2 space-y-1">
                          {question.options.map((option, optIndex) => (
                            <div 
                              key={optIndex} 
                              className={`p-2 rounded text-sm ${
                                optIndex === question.correctOptionIndex 
                                  ? 'bg-green-100 dark:bg-green-900/20' 
                                  : 'bg-muted'
                              }`}
                            >
                              {option}
                              {optIndex === question.correctOptionIndex && (
                                <Badge className="ml-2" variant="outline">Correct</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    {generatedQuiz.length > 1 && (
                      <p className="text-sm text-muted-foreground">
                        And {generatedQuiz.length - 1} more questions...
                      </p>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // TODO: Implement creating quiz
                        toast({
                          title: 'Create quiz',
                          description: 'This feature is not yet implemented',
                        });
                      }}
                    >
                      Create Quiz
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleGenerateQuiz}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <BrainCircuit className="h-4 w-4 mr-2" />
                      Generate Quiz Questions
                    </>
                  )}
                </Button>
              )}
            </div>
            
            {error && activeTab === 'quiz' && (
              <div className="border border-destructive rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <p className="font-medium text-destructive">Error</p>
                </div>
                <p className="text-sm text-destructive mt-2">{error}</p>
              </div>
            )}
          </TabsContent>
          
          {/* Knowledge Graph tab */}
          <TabsContent value="knowledge" className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Knowledge Graph</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add this image and its content to your knowledge graph.
                Connect it with related concepts and build your learning network.
              </p>
              
              {loading && activeTab === 'knowledge' ? (
                <div className="space-y-2">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-8 w-3/4" />
                </div>
              ) : knowledgeNode ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="font-medium">Added to knowledge graph!</p>
                  </div>
                  
                  <div className="border rounded p-3 mt-2">
                    <p className="font-medium">{knowledgeNode.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {knowledgeNode.content}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {knowledgeNode.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // TODO: Implement viewing in knowledge graph
                      toast({
                        title: 'View in knowledge graph',
                        description: 'This feature is not yet implemented',
                      });
                    }}
                  >
                    View in Knowledge Graph
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleAddToKnowledgeGraph}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Network className="h-4 w-4 mr-2" />
                      Add to Knowledge Graph
                    </>
                  )}
                </Button>
              )}
            </div>
            
            {error && activeTab === 'knowledge' && (
              <div className="border border-destructive rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <p className="font-medium text-destructive">Error</p>
                </div>
                <p className="text-sm text-destructive mt-2">{error}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Study materials are generated using AI and may require review for accuracy.
        </p>
      </CardFooter>
    </Card>
  );
};

export default StudyMaterialGenerator;
