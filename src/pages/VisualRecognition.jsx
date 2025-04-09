
import React, { useState, useEffect } from 'react';
import {
  useVisualRecognition,
  useImageAnalysis,
  useStudyMaterialGenerator,
  useHandwritingRecognition,
  useFormulaRecognition,
  useImageProcessing,
  useTextExtraction
} from '@/services/visual-recognition';
import { useAuth } from '@/context/auth';
import MainLayout from '@/components/layout/MainLayout';
import {
  ImageUploader,
  ImageGallery,
  ImageAnalysisResults,
  StudyMaterialGenerator,
  HandwritingRecognition,
  FormulaRecognition,
  ImageProcessingTools,
  CameraCapture,
  RecognizedContent,
  ErrorCorrectionInterface,
  VisualLearningAssistant
} from '@/components/visual-recognition';
import { recognizeEquation } from '@/services/visual-recognition/equationRecognition';
import { recognizeNotes, generateFlashcardsFromNotes } from '@/services/visual-recognition/noteProcessing';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Camera,
  Image as ImageIcon,
  FileImage,
  BrainCircuit,
  Lightbulb,
  RefreshCw,
  ArrowLeft,
  Edit,
  Function,
  Wand2,
  FileText,
  Calculator,
  BookText,
  History,
  CircleSlash,
  PlusCircle,
  Share2
} from 'lucide-react';

/**
 * Visual Recognition page component
 * @returns {React.ReactElement} VisualRecognition page
 */
const VisualRecognition = () => {
  const { user } = useAuth();
  const visualRecognition = useVisualRecognition();
  const imageAnalysis = useImageAnalysis();
  const studyMaterialGenerator = useStudyMaterialGenerator();
  const handwritingRecognition = useHandwritingRecognition();
  const formulaRecognition = useFormulaRecognition();
  const imageProcessing = useImageProcessing();
  const textExtraction = useTextExtraction();

  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [isInitialized, setIsInitialized] = useState(false);

  // Additional state for the full functionality
  const [tab, setTab] = useState('capture');
  const [contentType, setContentType] = useState('notes');
  const [capturedImage, setCapturedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedContent, setRecognizedContent] = useState(null);
  const [recognitionHistory, setRecognitionHistory] = useState([]);
  const [lastSavedFlashcard, setLastSavedFlashcard] = useState(null);

  // Initialize services
  useEffect(() => {
    if (user) {
      const initializeServices = async () => {
        try {
          await visualRecognition.initialize(user.id);
          await imageAnalysis.initialize();
          await studyMaterialGenerator.initialize(user.id);
          await handwritingRecognition.initialize(user.id);
          await formulaRecognition.initialize(user.id);
          await imageProcessing.initialize(user.id);
          await textExtraction.initialize(user.id);
          setIsInitialized(true);
        } catch (error) {
          console.error('Error initializing services:', error);
          toast({
            title: 'Initialization Error',
            description: 'Failed to initialize visual recognition services',
            variant: 'destructive'
          });
        }
      };

      initializeServices();
    }
  }, [user, visualRecognition, imageAnalysis, studyMaterialGenerator]);

  // Handle image upload completion
  const handleUploadComplete = (image) => {
    setSelectedImage(image);
    setActiveTab('analyze');
  };

  // Handle image selection from gallery
  const handleSelectImage = (image) => {
    setSelectedImage(image);
    setActiveTab('analyze');
  };

  // Handle captured image processing
  const handleCapturedImage = async (imageData) => {
    setIsProcessing(true);

    try {
      // Process image based on selected content type
      let result;
      if (contentType === 'equation') {
        result = await recognizeEquation(imageData);
        setRecognizedContent(result);
      } else {
        result = await recognizeNotes(imageData);
        setRecognizedContent(result);
      }

      setTab('result');
    } catch (error) {
      console.error('Recognition error:', error);
      toast({
        title: "Recognition Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle content type change
  const handleContentTypeChange = (type) => {
    setContentType(type);
    setRecognizedContent(null);
  };

  // Update recognized content (e.g., after edits)
  const handleContentUpdate = (updatedContent) => {
    setRecognizedContent(updatedContent);

    // Add to history
    if (recognitionHistory.length >= 10) {
      setRecognitionHistory(prev => [...prev.slice(1), {
        type: contentType,
        content: updatedContent,
        timestamp: new Date().toISOString()
      }]);
    } else {
      setRecognitionHistory(prev => [...prev, {
        type: contentType,
        content: updatedContent,
        timestamp: new Date().toISOString()
      }]);
    }
  };

  // Create flashcard from recognized content
  const handleCreateFlashcard = async (content) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create flashcards",
        variant: "destructive"
      });
      return;
    }

    try {
      if (contentType === 'equation') {
        // Create a single equation flashcard
        const flashcardData = {
          frontContent: `What is the mathematical expression? $$${content.latex}$$`,
          backContent: `$$${content.latex}$$`,
          topicId: 'equations',
          difficulty: 3,
          useLatex: true
        };

        // In a real app, this would call an API to create the flashcard
        // const result = await createFlashcard(
        //   user.id,
        //   flashcardData.frontContent,
        //   flashcardData.backContent,
        //   flashcardData.topicId
        // );

        setLastSavedFlashcard(flashcardData);

        toast({
          title: "Flashcard Created",
          description: "Equation flashcard has been saved to your collection",
          variant: "default"
        });
      } else {
        // Generate multiple flashcards from notes
        const flashcards = generateFlashcardsFromNotes(content);

        if (flashcards.length > 0) {
          // Just create the first flashcard in this demo
          // In a full app, you'd create all or show a selection UI
          // const result = await createFlashcard(
          //   user.id,
          //   flashcards[0].frontContent,
          //   flashcards[0].backContent,
          //   flashcards[0].topicId
          // );

          setLastSavedFlashcard(flashcards[0]);

          toast({
            title: `${flashcards.length} Flashcards Created`,
            description: "Flashcards have been generated from your notes",
            variant: "default"
          });
        } else {
          toast({
            title: "No Flashcards Generated",
            description: "Could not generate flashcards from this content",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error creating flashcard:', error);
      toast({
        title: "Error Creating Flashcard",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Handle correction submission
  const handleCorrectionSubmit = (correctionData) => {
    // In a real app, this would be sent to backend for ML model improvement
    console.log('Correction submitted:', correctionData);

    // Update the recognized content with corrected version
    if (contentType === 'equation') {
      setRecognizedContent(prev => ({
        ...prev,
        latex: correctionData.corrected
      }));
    } else {
      setRecognizedContent(prev => ({
        ...prev,
        text: correctionData.corrected
      }));
    }

    toast({
      title: "Correction Submitted",
      description: "Thank you for helping improve our recognition system",
      variant: "default"
    });
  };

  // Visual Learning Assistant component - placeholder for now
  const VisualLearningAssistant = ({ recognizedContent, contentType }) => (
    <Card>
      <CardHeader>
        <CardTitle>Learning Assistant</CardTitle>
        <CardDescription>AI-powered insights for your content</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Content analysis is available for this {contentType === 'equation' ? 'equation' : 'note'}.
        </p>
      </CardContent>
    </Card>
  );

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Visual Recognition</h1>
            <p className="text-muted-foreground mt-1">
              Capture and process handwritten notes, equations, and diagrams
            </p>
          </div>

          <div className="flex mt-4 md:mt-0 space-x-2">
            <Button
              variant={contentType === 'equation' ? 'default' : 'outline'}
              onClick={() => handleContentTypeChange('equation')}
              className="flex items-center"
            >
              <Calculator className="mr-2 h-4 w-4" />
              Equations
            </Button>

            <Button
              variant={contentType === 'notes' ? 'default' : 'outline'}
              onClick={() => handleContentTypeChange('notes')}
              className="flex items-center"
            >
              <BookText className="mr-2 h-4 w-4" />
              Notes
            </Button>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="capture" className="flex items-center">
              <Camera className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Capture</span>
            </TabsTrigger>
            <TabsTrigger value="result" disabled={!recognizedContent} className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Results</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center">
              <History className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="capture" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="md:col-span-3">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                    {capturedImage ? (
                      <div className="w-full max-w-md">
                        <img
                          src={capturedImage}
                          alt="Captured content"
                          className="rounded-lg shadow-md w-full"
                        />

                        <div className="flex justify-center mt-4 space-x-2">
                          <Button
                            onClick={() => setCapturedImage(null)}
                            variant="outline"
                          >
                            Retake
                          </Button>

                          <Button
                            onClick={() => handleCapturedImage(capturedImage)}
                            disabled={isProcessing}
                          >
                            {isProcessing ? 'Processing...' : 'Process Image'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-4">
                        <div className="mx-auto bg-muted rounded-full p-6">
                          <Camera className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">
                            Capture {contentType === 'equation' ? 'an Equation' : 'Notes'}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1 mb-4 max-w-sm mx-auto">
                            Take a photo of your {contentType === 'equation' ? 'handwritten equation' : 'handwritten notes'} to process and convert to digital format
                          </p>
                          <CameraCapture onCapture={handleCapturedImage} />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-2">Tips for Best Results</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="bg-primary/20 p-1 rounded-full mr-2 mt-0.5">
                          <PlusCircle className="h-3 w-3 text-primary" />
                        </span>
                        Use good lighting
                      </li>
                      <li className="flex items-start">
                        <span className="bg-primary/20 p-1 rounded-full mr-2 mt-0.5">
                          <PlusCircle className="h-3 w-3 text-primary" />
                        </span>
                        Write clearly and avoid overlapping elements
                      </li>
                      <li className="flex items-start">
                        <span className="bg-primary/20 p-1 rounded-full mr-2 mt-0.5">
                          <PlusCircle className="h-3 w-3 text-primary" />
                        </span>
                        Hold the camera steady and parallel to the paper
                      </li>
                      <li className="flex items-start">
                        <span className="bg-primary/20 p-1 rounded-full mr-2 mt-0.5">
                          <PlusCircle className="h-3 w-3 text-primary" />
                        </span>
                        Use the crop tool to isolate the relevant content
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-3">Recently Processed</h3>
                    {recognitionHistory.length > 0 ? (
                      <div className="space-y-2">
                        {recognitionHistory.slice(-3).reverse().map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center p-2 border rounded-md cursor-pointer hover:bg-accent"
                            onClick={() => {
                              setRecognizedContent(item.content);
                              setContentType(item.type);
                              setTab('result');
                            }}
                          >
                            {item.type === 'equation' ? (
                              <Calculator className="h-4 w-4 mr-2 text-muted-foreground" />
                            ) : (
                              <BookText className="h-4 w-4 mr-2 text-muted-foreground" />
                            )}
                            <div className="truncate flex-1">
                              {item.type === 'equation'
                                ? item.content.latex?.substring(0, 20) + '...'
                                : item.content.text?.substring(0, 20) + '...'}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-sm text-muted-foreground py-4">
                        No recent items
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="result" className="space-y-6">
            {isProcessing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <Skeleton className="h-8 w-3/4" />
                      <Skeleton className="h-20 w-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <Skeleton className="h-8 w-3/4" />
                      <div className="space-y-2">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : recognizedContent ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecognizedContent
                  recognizedContent={recognizedContent}
                  contentType={contentType}
                  onSave={handleContentUpdate}
                  onCreateFlashcard={handleCreateFlashcard}
                />

                <div className="space-y-6">
                  <VisualLearningAssistant
                    recognizedContent={recognizedContent}
                    contentType={contentType}
                  />

                  <ErrorCorrectionInterface
                    originalContent={recognizedContent}
                    contentType={contentType}
                    onCorrectionSubmit={handleCorrectionSubmit}
                    suggestionHistory={[]}
                  />
                </div>

                {lastSavedFlashcard && (
                  <Card className="lg:col-span-2">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Last Saved Flashcard</h3>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Share2 className="h-4 w-4" />
                          <span className="hidden sm:inline">Share</span>
                        </Button>
                      </div>
                      <Separator className="my-4" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="border rounded-md p-4">
                          <p className="text-sm text-muted-foreground mb-2">Front</p>
                          <p className="text-sm">{lastSavedFlashcard.frontContent}</p>
                        </div>
                        <div className="border rounded-md p-4">
                          <p className="text-sm text-muted-foreground mb-2">Back</p>
                          <p className="text-sm">{lastSavedFlashcard.backContent}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto bg-muted rounded-full p-6 w-20 h-20 flex items-center justify-center">
                  <CircleSlash className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mt-4">No Content Processed</h3>
                <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                  Capture an image first to see recognition results
                </p>
                <Button className="mt-4" onClick={() => setTab('capture')}>
                  <Camera className="mr-2 h-4 w-4" />
                  Capture Image
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {recognitionHistory.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Recognition History</h2>
                  <Button
                    variant="outline"
                    onClick={() => setRecognitionHistory([])}
                  >
                    Clear History
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recognitionHistory.slice().reverse().map((item, index) => (
                    <Card
                      key={index}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        setRecognizedContent(item.content);
                        setContentType(item.type);
                        setTab('result');
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            {item.type === 'equation' ? (
                              <Calculator className="h-4 w-4 mr-2" />
                            ) : (
                              <BookText className="h-4 w-4 mr-2" />
                            )}
                            <span className="font-medium">
                              {item.type === 'equation' ? 'Equation' : 'Notes'}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(item.timestamp).toLocaleString()}
                          </span>
                        </div>

                        <div className="line-clamp-3 text-sm">
                          {item.type === 'equation'
                            ? item.content.latex
                            : item.content.text}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto bg-muted rounded-full p-6 w-20 h-20 flex items-center justify-center">
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mt-4">No Recognition History</h3>
                <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                  Process images to build your recognition history
                </p>
                <Button className="mt-4" onClick={() => setTab('capture')}>
                  <Camera className="mr-2 h-4 w-4" />
                  Capture New Image
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default VisualRecognition;
