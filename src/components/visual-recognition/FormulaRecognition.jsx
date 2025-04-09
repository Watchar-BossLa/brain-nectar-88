import React, { useState } from 'react';
import { useFormulaRecognition } from '@/services/visual-recognition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Calculator, Function, BookOpen, Copy, FlaskConical } from 'lucide-react';

/**
 * Formula Recognition Component
 * @param {Object} props - Component props
 * @param {string} props.imageId - Image ID
 * @param {string} props.imageUrl - Image URL
 * @returns {React.ReactElement} Formula recognition component
 */
const FormulaRecognition = ({ imageId, imageUrl }) => {
  const formulaRecognition = useFormulaRecognition();
  
  const [loading, setLoading] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const [converting, setConverting] = useState(false);
  const [solving, setSolving] = useState(false);
  const [results, setResults] = useState(null);
  const [studyMaterials, setStudyMaterials] = useState(null);
  const [activeTab, setActiveTab] = useState('preview');
  const [selectedFormula, setSelectedFormula] = useState(null);
  const [variables, setVariables] = useState({});
  const [solution, setSolution] = useState(null);
  
  // Handle recognize formulas
  const handleRecognizeFormulas = async () => {
    if (!imageId) return;
    
    try {
      setRecognizing(true);
      
      // Recognize formulas
      const recognitionResults = await formulaRecognition.recognizeFormulas(imageId);
      
      setResults(recognitionResults);
      setActiveTab('results');
      
      toast({
        title: 'Formula Recognition Complete',
        description: `Recognized ${recognitionResults.formulas?.length || 0} formulas`,
      });
    } catch (error) {
      console.error('Error recognizing formulas:', error);
      toast({
        title: 'Recognition Failed',
        description: error.message || 'An error occurred during formula recognition',
        variant: 'destructive'
      });
    } finally {
      setRecognizing(false);
    }
  };
  
  // Handle convert to study materials
  const handleConvertToStudyMaterials = async () => {
    if (!imageId) return;
    
    try {
      setConverting(true);
      
      // Convert to study materials
      const conversionResults = await formulaRecognition.convertToStudyMaterials(imageId);
      
      setStudyMaterials(conversionResults.studyMaterials);
      setActiveTab('study');
      
      toast({
        title: 'Conversion Complete',
        description: `Created ${conversionResults.count} study materials`,
      });
    } catch (error) {
      console.error('Error converting to study materials:', error);
      toast({
        title: 'Conversion Failed',
        description: error.message || 'An error occurred during conversion',
        variant: 'destructive'
      });
    } finally {
      setConverting(false);
    }
  };
  
  // Handle select formula
  const handleSelectFormula = (formula) => {
    setSelectedFormula(formula);
    setVariables({});
    setSolution(null);
  };
  
  // Handle variable change
  const handleVariableChange = (variable, value) => {
    setVariables(prev => ({
      ...prev,
      [variable]: value
    }));
  };
  
  // Handle solve formula
  const handleSolveFormula = async () => {
    if (!selectedFormula) return;
    
    try {
      setSolving(true);
      
      // Solve formula
      const solutionResult = await formulaRecognition.solveFormula(selectedFormula.latex, variables);
      
      setSolution(solutionResult);
      
      if (solutionResult.success) {
        toast({
          title: 'Formula Solved',
          description: `Result: ${solutionResult.result}`,
        });
      } else {
        toast({
          title: 'Solving Failed',
          description: solutionResult.error,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error solving formula:', error);
      toast({
        title: 'Solving Failed',
        description: error.message || 'An error occurred while solving the formula',
        variant: 'destructive'
      });
    } finally {
      setSolving(false);
    }
  };
  
  // Handle copy latex
  const handleCopyLatex = (latex) => {
    navigator.clipboard.writeText(latex).then(
      () => {
        toast({
          title: 'Copied to Clipboard',
          description: 'LaTeX formula has been copied to clipboard',
        });
      },
      (err) => {
        console.error('Error copying latex:', err);
        toast({
          title: 'Copy Failed',
          description: 'Failed to copy formula to clipboard',
          variant: 'destructive'
        });
      }
    );
  };
  
  // Extract variables from formula
  const extractVariables = (latex) => {
    if (!latex) return [];
    
    // Simple regex to extract variables (this is a simplified approach)
    const matches = latex.match(/[a-zA-Z](?![a-zA-Z])/g) || [];
    return [...new Set(matches)];
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Formula Recognition</CardTitle>
        <CardDescription>
          Recognize and process mathematical formulas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="study">Study</TabsTrigger>
            <TabsTrigger value="solve">Solve</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview">
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                {imageUrl && (
                  <img 
                    src={imageUrl} 
                    alt="Formula content" 
                    className="w-full h-auto object-contain max-h-[400px]"
                  />
                )}
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={handleRecognizeFormulas}
                  disabled={recognizing || !imageId}
                >
                  {recognizing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Recognizing...
                    </>
                  ) : (
                    <>
                      <Function className="mr-2 h-4 w-4" />
                      Recognize Formulas
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
                    <p className="text-sm font-medium">Formulas</p>
                    <p className="text-2xl font-bold">
                      {results.formulas?.length || 0}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Recognized Formulas</h3>
                  
                  {results.formulas?.map((formula, index) => (
                    <div key={index} className="border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">Formula {index + 1}</p>
                        <div className="flex items-center space-x-2">
                          <p className="text-xs text-muted-foreground">
                            Confidence: {Math.round(formula.confidence * 100)}%
                          </p>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleCopyLatex(formula.latex)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-muted p-2 rounded font-mono text-sm overflow-x-auto">
                        {formula.latex}
                      </div>
                      
                      {formula.explanation && (
                        <div className="text-sm text-muted-foreground">
                          {formula.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handleRecognizeFormulas}
                    disabled={recognizing}
                  >
                    {recognizing ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Function className="mr-2 h-4 w-4" />
                    )}
                    Re-Recognize
                  </Button>
                  
                  <Button
                    onClick={handleConvertToStudyMaterials}
                    disabled={converting}
                  >
                    {converting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <BookOpen className="mr-2 h-4 w-4" />
                    )}
                    Create Study Materials
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Function className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Recognition Results</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Recognize formulas to see results
                </p>
                <Button 
                  onClick={handleRecognizeFormulas}
                  disabled={recognizing}
                >
                  {recognizing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Recognizing...
                    </>
                  ) : (
                    'Recognize Formulas'
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="study">
            {studyMaterials ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Study Materials</h3>
                
                {studyMaterials.map((material, index) => (
                  <Card key={index}>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Formula Flashcard</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="space-y-2">
                        <div className="bg-muted p-2 rounded font-mono text-sm overflow-x-auto">
                          {material.formula}
                        </div>
                        <div className="text-sm">
                          {material.explanation}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <div className="flex justify-center">
                  <Button
                    onClick={handleConvertToStudyMaterials}
                    disabled={converting}
                  >
                    {converting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Refresh Study Materials
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Study Materials</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Convert formulas to study materials
                </p>
                <Button 
                  onClick={handleConvertToStudyMaterials}
                  disabled={converting}
                >
                  {converting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    'Create Study Materials'
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="solve">
            <div className="space-y-4">
              {results?.formulas ? (
                <>
                  <div className="space-y-2">
                    <Label>Select Formula</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {results.formulas.map((formula, index) => (
                        <Button
                          key={index}
                          variant={selectedFormula?.latex === formula.latex ? "default" : "outline"}
                          className="justify-start h-auto py-2 px-3"
                          onClick={() => handleSelectFormula(formula)}
                        >
                          <div className="text-left">
                            <div className="font-mono text-sm">{formula.latex}</div>
                            {formula.explanation && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {formula.explanation}
                              </div>
                            )}
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {selectedFormula && (
                    <>
                      <div className="border rounded-lg p-3 space-y-3">
                        <h3 className="text-base font-medium">Solve Formula</h3>
                        <div className="bg-muted p-2 rounded font-mono text-sm overflow-x-auto">
                          {selectedFormula.latex}
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Enter Variables</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {extractVariables(selectedFormula.latex).map((variable) => (
                              <div key={variable} className="space-y-1">
                                <Label htmlFor={`var-${variable}`}>{variable}</Label>
                                <Input
                                  id={`var-${variable}`}
                                  type="number"
                                  placeholder={`Value for ${variable}`}
                                  value={variables[variable] || ''}
                                  onChange={(e) => handleVariableChange(variable, e.target.value)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <Button
                          onClick={handleSolveFormula}
                          disabled={solving || Object.keys(variables).length === 0}
                          className="w-full"
                        >
                          {solving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Solving...
                            </>
                          ) : (
                            <>
                              <Calculator className="mr-2 h-4 w-4" />
                              Solve Formula
                            </>
                          )}
                        </Button>
                      </div>
                      
                      {solution && (
                        <div className="border rounded-lg p-3 space-y-2">
                          <h3 className="text-base font-medium">Solution</h3>
                          
                          {solution.success ? (
                            <>
                              <div className="bg-muted p-2 rounded text-sm">
                                <span className="font-bold">Result:</span> {solution.result}
                              </div>
                              
                              <div className="space-y-1">
                                <Label>Steps</Label>
                                <div className="space-y-1 text-sm">
                                  {solution.steps.map((step, index) => (
                                    <div key={index} className="p-2 border-l-2 border-primary">
                                      {step}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="text-destructive">
                              {solution.error}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <Calculator className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Formulas to Solve</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Recognize formulas first to solve them
                  </p>
                  <Button 
                    onClick={handleRecognizeFormulas}
                    disabled={recognizing}
                  >
                    {recognizing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Recognizing...
                      </>
                    ) : (
                      'Recognize Formulas'
                    )}
                  </Button>
                </div>
              )}
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

export default FormulaRecognition;
