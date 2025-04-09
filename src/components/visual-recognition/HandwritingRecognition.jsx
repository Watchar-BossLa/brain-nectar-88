import React, { useState } from 'react';
import { useHandwritingRecognition } from '@/services/visual-recognition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Loader2, FileText, Edit, Check, Copy, Download } from 'lucide-react';

/**
 * Handwriting Recognition Component
 * @param {Object} props - Component props
 * @param {string} props.imageId - Image ID
 * @param {string} props.imageUrl - Image URL
 * @returns {React.ReactElement} Handwriting recognition component
 */
const HandwritingRecognition = ({ imageId, imageUrl }) => {
  const handwritingRecognition = useHandwritingRecognition();
  
  const [loading, setLoading] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const [converting, setConverting] = useState(false);
  const [results, setResults] = useState(null);
  const [digitalText, setDigitalText] = useState('');
  const [activeTab, setActiveTab] = useState('preview');
  const [corrections, setCorrections] = useState([]);
  
  // Handle recognize handwriting
  const handleRecognizeHandwriting = async () => {
    if (!imageId) return;
    
    try {
      setRecognizing(true);
      
      // Recognize handwriting
      const recognitionResults = await handwritingRecognition.recognizeHandwriting(imageId);
      
      setResults(recognitionResults);
      setActiveTab('results');
      
      toast({
        title: 'Handwriting Recognition Complete',
        description: `Recognized ${recognitionResults.textBlocks?.length || 0} text blocks`,
      });
    } catch (error) {
      console.error('Error recognizing handwriting:', error);
      toast({
        title: 'Recognition Failed',
        description: error.message || 'An error occurred during handwriting recognition',
        variant: 'destructive'
      });
    } finally {
      setRecognizing(false);
    }
  };
  
  // Handle convert to digital text
  const handleConvertToDigitalText = async () => {
    if (!imageId) return;
    
    try {
      setConverting(true);
      
      // Convert to digital text
      const conversionResults = await handwritingRecognition.convertToDigitalText(imageId);
      
      setDigitalText(conversionResults.digitalText);
      setActiveTab('digital');
      
      toast({
        title: 'Conversion Complete',
        description: 'Handwriting has been converted to digital text',
      });
    } catch (error) {
      console.error('Error converting to digital text:', error);
      toast({
        title: 'Conversion Failed',
        description: error.message || 'An error occurred during conversion',
        variant: 'destructive'
      });
    } finally {
      setConverting(false);
    }
  };
  
  // Handle text correction
  const handleTextCorrection = (textId, correctedText) => {
    // Update corrections
    const existingIndex = corrections.findIndex(c => c.textId === textId);
    
    if (existingIndex >= 0) {
      // Update existing correction
      const updatedCorrections = [...corrections];
      updatedCorrections[existingIndex].correctedText = correctedText;
      setCorrections(updatedCorrections);
    } else {
      // Add new correction
      setCorrections([...corrections, { textId, correctedText }]);
    }
  };
  
  // Handle apply corrections
  const handleApplyCorrections = async () => {
    if (!imageId || corrections.length === 0) return;
    
    try {
      setLoading(true);
      
      // Apply corrections
      const correctionResults = await handwritingRecognition.applyUserCorrections(imageId, corrections);
      
      // Update results
      setResults(prevResults => ({
        ...prevResults,
        textBlocks: correctionResults.textBlocks
      }));
      
      // Clear corrections
      setCorrections([]);
      
      toast({
        title: 'Corrections Applied',
        description: `Applied ${correctionResults.corrections} corrections`,
      });
    } catch (error) {
      console.error('Error applying corrections:', error);
      toast({
        title: 'Correction Failed',
        description: error.message || 'An error occurred while applying corrections',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle copy text
  const handleCopyText = () => {
    navigator.clipboard.writeText(digitalText).then(
      () => {
        toast({
          title: 'Copied to Clipboard',
          description: 'Digital text has been copied to clipboard',
        });
      },
      (err) => {
        console.error('Error copying text:', err);
        toast({
          title: 'Copy Failed',
          description: 'Failed to copy text to clipboard',
          variant: 'destructive'
        });
      }
    );
  };
  
  // Handle download text
  const handleDownloadText = () => {
    const blob = new Blob([digitalText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `handwriting_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Handwriting Recognition</CardTitle>
        <CardDescription>
          Convert handwritten notes to digital text
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="digital">Digital Text</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview">
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                {imageUrl && (
                  <img 
                    src={imageUrl} 
                    alt="Handwritten content" 
                    className="w-full h-auto object-contain max-h-[400px]"
                  />
                )}
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={handleRecognizeHandwriting}
                  disabled={recognizing || !imageId}
                >
                  {recognizing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Recognizing...
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Recognize Handwriting
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            {results ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-3">
                    <p className="text-sm font-medium">Confidence</p>
                    <p className="text-2xl font-bold">
                      {Math.round(results.confidence * 100)}%
                    </p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-sm font-medium">Text Blocks</p>
                    <p className="text-2xl font-bold">
                      {results.textBlocks?.length || 0}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Recognized Text</h3>
                  
                  {results.textBlocks?.map((block, index) => (
                    <div key={index} className="border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">Block {index + 1}</p>
                        <p className="text-xs text-muted-foreground">
                          Confidence: {Math.round(block.confidence * 100)}%
                        </p>
                      </div>
                      
                      <Textarea
                        value={
                          corrections.find(c => c.textId === block.id)?.correctedText || 
                          block.text
                        }
                        onChange={(e) => handleTextCorrection(block.id, e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handleRecognizeHandwriting}
                    disabled={recognizing}
                  >
                    {recognizing ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Edit className="mr-2 h-4 w-4" />
                    )}
                    Re-Recognize
                  </Button>
                  
                  <div className="space-x-2">
                    <Button
                      onClick={handleApplyCorrections}
                      disabled={loading || corrections.length === 0}
                    >
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="mr-2 h-4 w-4" />
                      )}
                      Apply Corrections
                    </Button>
                    
                    <Button
                      onClick={handleConvertToDigitalText}
                      disabled={converting}
                    >
                      {converting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <FileText className="mr-2 h-4 w-4" />
                      )}
                      Convert to Digital
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Edit className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Recognition Results</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Recognize handwriting to see results
                </p>
                <Button 
                  onClick={handleRecognizeHandwriting}
                  disabled={recognizing}
                >
                  {recognizing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Recognizing...
                    </>
                  ) : (
                    'Recognize Handwriting'
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="digital">
            <div className="space-y-4">
              <div className="border rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">Digital Text</h3>
                  <div className="space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleCopyText}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleDownloadText}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                
                <Textarea
                  value={digitalText}
                  onChange={(e) => setDigitalText(e.target.value)}
                  className="min-h-[300px]"
                />
              </div>
              
              <div className="flex justify-center">
                <Button
                  onClick={handleConvertToDigitalText}
                  disabled={converting}
                >
                  {converting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Refresh Digital Text
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          {results && (
            <>
              Processed in {results.processingTime}s
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default HandwritingRecognition;
