import React, { useState, useEffect } from 'react';
import { useStudyItemGenerator } from '@/services/spaced-repetition';
import { useDocumentAnalysis } from '@/services/documents';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  FileText, 
  BookOpen, 
  Function, 
  List,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

/**
 * Document to Study Items Component
 * Converts document content to study items for spaced repetition
 * @param {Object} props - Component props
 * @param {string} props.documentId - Document ID
 * @param {Function} props.onComplete - Callback when generation is complete
 * @returns {React.ReactElement} Document to study items component
 */
const DocumentToStudyItems = ({ documentId, onComplete }) => {
  const { user } = useAuth();
  const studyItemGenerator = useStudyItemGenerator();
  const documentAnalysis = useDocumentAnalysis();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [generatedItems, setGeneratedItems] = useState([]);
  const [options, setOptions] = useState({
    fromStructure: true,
    fromConcepts: true,
    fromFormulas: true
  });
  
  // Load document
  useEffect(() => {
    if (!documentId || !user) return;
    
    const loadDocument = async () => {
      try {
        setLoading(true);
        
        // Get document from database
        const { data, error } = await documentAnalysis.getDocumentResults(documentId);
        
        if (error) throw error;
        
        setDocument(data);
        setError(null);
      } catch (err) {
        console.error('Error loading document:', err);
        setError(err.message || 'Failed to load document');
      } finally {
        setLoading(false);
      }
    };
    
    loadDocument();
  }, [documentId, user, documentAnalysis]);
  
  // Handle option change
  const handleOptionChange = (option) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };
  
  // Handle generate button click
  const handleGenerate = async () => {
    if (!documentId || !user || !document) return;
    
    try {
      setGenerating(true);
      setError(null);
      setSuccess(false);
      
      // Generate study items
      const items = await studyItemGenerator.generateFromDocument(documentId, user.id, options);
      
      setGeneratedItems(items);
      setSuccess(true);
      
      // Call onComplete callback if provided
      if (onComplete) {
        onComplete(items);
      }
    } catch (err) {
      console.error('Error generating study items:', err);
      setError(err.message || 'Failed to generate study items');
    } finally {
      setGenerating(false);
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-full" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }
  
  // Render error state
  if (error && !document) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription>Failed to load document</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
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
  
  // Render document not ready state
  if (document && document.status !== 'completed') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Document Not Ready</CardTitle>
          <CardDescription>
            The document is still being processed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertTitle>Processing</AlertTitle>
            <AlertDescription>
              Please wait until the document analysis is complete before generating study items.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Study Items</CardTitle>
        <CardDescription>
          Convert document content to flashcards for spaced repetition
        </CardDescription>
      </CardHeader>
      <CardContent>
        {document && (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-3 border rounded-md">
              <FileText className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-medium">{document.fileName}</h3>
                <p className="text-sm text-muted-foreground">
                  Select which parts of the document to convert to study items
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Document Structure Option */}
              {document.structure && (
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="fromStructure"
                    checked={options.fromStructure}
                    onCheckedChange={() => handleOptionChange('fromStructure')}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="fromStructure"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Document Structure
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Generate items from document sections and headings
                    </p>
                  </div>
                </div>
              )}
              
              {/* Key Concepts Option */}
              {document.analysis?.keyConcepts && (
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="fromConcepts"
                    checked={options.fromConcepts}
                    onCheckedChange={() => handleOptionChange('fromConcepts')}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="fromConcepts"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                    >
                      <List className="h-4 w-4 mr-2" />
                      Key Concepts
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Generate items from key concepts and their relationships
                    </p>
                  </div>
                </div>
              )}
              
              {/* Formulas Option */}
              {document.formulas && document.formulas.length > 0 && (
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="fromFormulas"
                    checked={options.fromFormulas}
                    onCheckedChange={() => handleOptionChange('fromFormulas')}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="fromFormulas"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                    >
                      <Function className="h-4 w-4 mr-2" />
                      Formulas
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Generate items from mathematical formulas
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Generated {generatedItems.length} study items from the document.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleGenerate}
          disabled={generating || !document}
          className="w-full"
        >
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Study Items'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentToStudyItems;
