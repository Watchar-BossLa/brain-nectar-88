
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ImageUploader, RecognizedContent, VisualLearningAssistant } from '@/components/visual-recognition';
import { useMultiAgentSystem } from '@/hooks/useMultiAgentSystem';
import { TaskType } from '@/services/agents/types';

interface RecognizedData {
  type: 'equation' | 'notes';
  content: any;
}

const StudyMaterialGenerator = () => {
  const [recognizedData, setRecognizedData] = useState<RecognizedData | null>(null);
  const { toast } = useToast();
  const { submitTask, TaskTypes } = useMultiAgentSystem();

  const handleUploadComplete = async (data: any) => {
    try {
      // Submit image analysis task to multi-agent system
      const success = await submitTask(
        TaskTypes.CONTENT_ADAPTATION,
        'Analyze uploaded content and generate study materials',
        { imageData: data },
        'HIGH'
      );

      if (success) {
        toast({
          title: "Analysis started",
          description: "Your content is being analyzed...",
        });
      }
    } catch (error) {
      console.error('Error processing upload:', error);
      toast({
        title: "Error",
        description: "Failed to process the upload",
        variant: "destructive",
      });
    }
  };

  const handleCreateFlashcard = async (content: any) => {
    try {
      const success = await submitTask(
        TaskTypes.FLASHCARD_OPTIMIZATION,
        'Generate optimized flashcards from content',
        { content },
        'HIGH'
      );

      if (success) {
        toast({
          title: "Flashcard Creation Started",
          description: "Your flashcards are being generated...",
        });
      }
    } catch (error) {
      console.error('Error creating flashcard:', error);
      toast({
        title: "Error",
        description: "Failed to create flashcard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Study Material Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="space-y-6">
            <TabsList>
              <TabsTrigger value="upload">Upload Content</TabsTrigger>
              <TabsTrigger value="results" disabled={!recognizedData}>
                Analysis Results
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              <ImageUploader onUploadComplete={handleUploadComplete} />
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              {recognizedData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RecognizedContent
                    recognizedContent={recognizedData.content}
                    contentType={recognizedData.type}
                    onCreateFlashcard={handleCreateFlashcard}
                  />
                  <VisualLearningAssistant
                    recognizedContent={recognizedData.content}
                    contentType={recognizedData.type}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyMaterialGenerator;
