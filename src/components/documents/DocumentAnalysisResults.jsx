import React, { useState, useEffect } from 'react';
import { useDocumentAnalysis } from '@/services/documents';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Table, 
  Function, 
  BookOpen, 
  List, 
  Clock, 
  Download,
  ExternalLink,
  Copy
} from 'lucide-react';

/**
 * Document Analysis Results Component
 * Displays the results of document analysis
 * @param {Object} props - Component props
 * @param {string} props.jobId - Document processing job ID
 * @returns {React.ReactElement} Document analysis results component
 */
const DocumentAnalysisResults = ({ jobId }) => {
  const documentAnalysis = useDocumentAnalysis();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  
  // Fetch document results
  useEffect(() => {
    if (!jobId) return;
    
    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await documentAnalysis.getDocumentResults(jobId);
        setResults(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching document results:', err);
        setError(err.message || 'Failed to fetch document results');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
    
    // Poll for results if processing is not complete
    const pollInterval = setInterval(async () => {
      try {
        const data = await documentAnalysis.getDocumentResults(jobId);
        
        if (data && data.status !== 'processing' && data.status !== 'uploaded') {
          setResults(data);
          clearInterval(pollInterval);
        }
      } catch (err) {
        console.error('Error polling document results:', err);
        clearInterval(pollInterval);
      }
    }, 3000);
    
    return () => clearInterval(pollInterval);
  }, [jobId, documentAnalysis]);
  
  // Handle copy to clipboard
  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };
  
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
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription>Failed to load document analysis results</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!results) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Results</CardTitle>
          <CardDescription>No analysis results available</CardDescription>
        </CardHeader>
        <CardContent>
          <p>The document may still be processing or has not been uploaded.</p>
        </CardContent>
      </Card>
    );
  }
  
  if (results.status === 'processing' || results.status === 'uploaded') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Processing Document</CardTitle>
          <CardDescription>Your document is being analyzed</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-2">Analyzing: {results.fileName}</p>
          <p>This may take a few minutes depending on the document size and complexity.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {results.fileName}
            </CardTitle>
            <CardDescription>
              Document Analysis Results
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {results.publicUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={results.publicUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </a>
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="summary" className="flex items-center gap-1">
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Summary</span>
            </TabsTrigger>
            <TabsTrigger value="structure" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Structure</span>
            </TabsTrigger>
            <TabsTrigger value="tables" className="flex items-center gap-1">
              <Table className="h-4 w-4" />
              <span className="hidden sm:inline">Tables</span>
            </TabsTrigger>
            <TabsTrigger value="formulas" className="flex items-center gap-1">
              <Function className="h-4 w-4" />
              <span className="hidden sm:inline">Formulas</span>
            </TabsTrigger>
            <TabsTrigger value="references" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">References</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-4">
            {results.analysis && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Document Summary</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {results.analysis.summary}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Estimated reading time: {results.analysis.estimatedReadingTime} minutes
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Reading level: {results.analysis.readingLevel}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Key Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {results.analysis.keyTopics.map((topic, index) => (
                      <Badge key={index} variant="secondary">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Key Concepts</h3>
                  <div className="space-y-2">
                    {results.analysis.keyConcepts.map((concept, index) => (
                      <div key={index} className="p-3 border rounded-md">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{concept.name}</h4>
                          <Badge variant="outline">
                            {concept.occurrences} occurrences
                          </Badge>
                        </div>
                        {concept.relatedConcepts.length > 0 && (
                          <div className="mt-2">
                            <span className="text-sm text-muted-foreground">Related: </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {concept.relatedConcepts.map((related, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {related}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </TabsContent>
          
          {/* Structure Tab */}
          <TabsContent value="structure" className="space-y-4">
            {results.structure && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Document Structure</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {results.structure.title} ({results.structure.pageCount} pages)
                  </p>
                </div>
                
                <div className="space-y-2">
                  {results.structure.sections.map((section, index) => (
                    <div key={index} className="border rounded-md overflow-hidden">
                      <div className="p-3 bg-muted/50">
                        <h4 className="font-medium">
                          {section.title}
                          <Badge variant="outline" className="ml-2">
                            Page {section.startPage}
                          </Badge>
                        </h4>
                      </div>
                      <div className="p-3">
                        <p className="text-sm text-muted-foreground">
                          {section.content}
                        </p>
                        
                        {section.subsections && section.subsections.length > 0 && (
                          <div className="mt-3 space-y-2 pl-4 border-l">
                            {section.subsections.map((subsection, idx) => (
                              <div key={idx} className="border rounded-md">
                                <div className="p-2 bg-muted/30">
                                  <h5 className="text-sm font-medium">
                                    {subsection.title}
                                    <Badge variant="outline" className="ml-2 text-xs">
                                      Page {subsection.startPage}
                                    </Badge>
                                  </h5>
                                </div>
                                <div className="p-2">
                                  <p className="text-xs text-muted-foreground">
                                    {subsection.content}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </TabsContent>
          
          {/* Tables Tab */}
          <TabsContent value="tables" className="space-y-4">
            {results.tables && results.tables.length > 0 ? (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Extracted Tables</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {results.tables.length} tables found in the document
                  </p>
                </div>
                
                <div className="space-y-6">
                  {results.tables.map((table, index) => (
                    <div key={index} className="border rounded-md overflow-hidden">
                      <div className="p-3 bg-muted/50 flex justify-between items-center">
                        <h4 className="font-medium">{table.caption}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            Page {table.page}
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleCopyToClipboard(
                              JSON.stringify(table.rows, null, 2)
                            )}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-3 overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr>
                              {table.headers.map((header, idx) => (
                                <th key={idx} className="border p-2 text-left bg-muted/30">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {table.rows.map((row, rowIdx) => (
                              <tr key={rowIdx}>
                                {row.map((cell, cellIdx) => (
                                  <td key={cellIdx} className="border p-2">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Table className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Tables Found</h3>
                <p className="text-sm text-muted-foreground">
                  No tables were detected in this document.
                </p>
              </div>
            )}
          </TabsContent>
          
          {/* Formulas Tab */}
          <TabsContent value="formulas" className="space-y-4">
            {results.formulas && results.formulas.length > 0 ? (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Extracted Formulas</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {results.formulas.length} formulas found in the document
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.formulas.map((formula, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant="outline">
                          Page {formula.page}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleCopyToClipboard(formula.latex)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-md mb-2 font-mono text-center">
                        {formula.latex}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formula.description}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Function className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Formulas Found</h3>
                <p className="text-sm text-muted-foreground">
                  No mathematical formulas were detected in this document.
                </p>
              </div>
            )}
          </TabsContent>
          
          {/* References Tab */}
          <TabsContent value="references" className="space-y-4">
            {results.references && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Citations and References</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {results.references.citations?.length || 0} citations and {results.references.bibliography?.length || 0} references found
                  </p>
                </div>
                
                {results.references.citations && results.references.citations.length > 0 && (
                  <div>
                    <h4 className="text-md font-medium mb-2">Citations</h4>
                    <div className="space-y-2">
                      {results.references.citations.map((citation, index) => (
                        <div key={index} className="border rounded-md p-3 flex justify-between items-center">
                          <div>
                            <p className="font-medium">{citation.text}</p>
                            <p className="text-sm text-muted-foreground">
                              References: {citation.referenceId}
                            </p>
                          </div>
                          <Badge variant="outline">
                            Page {citation.page}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {results.references.bibliography && results.references.bibliography.length > 0 && (
                  <div>
                    <h4 className="text-md font-medium mb-2">Bibliography</h4>
                    <div className="space-y-3">
                      {results.references.bibliography.map((reference, index) => (
                        <div key={index} className="border rounded-md p-3">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium">{reference.id}</h5>
                            <Badge>
                              {reference.type}
                            </Badge>
                          </div>
                          <p className="mb-1">
                            <span className="font-medium">Title:</span> {reference.title}
                          </p>
                          <p className="mb-1">
                            <span className="font-medium">Authors:</span> {reference.authors.join(', ')}
                          </p>
                          <p className="mb-1">
                            <span className="font-medium">Year:</span> {reference.year}
                          </p>
                          {reference.journal && (
                            <p className="mb-1">
                              <span className="font-medium">Journal:</span> {reference.journal}
                            </p>
                          )}
                          {reference.publisher && (
                            <p className="mb-1">
                              <span className="font-medium">Publisher:</span> {reference.publisher}
                            </p>
                          )}
                          {reference.volume && (
                            <p className="mb-1">
                              <span className="font-medium">Volume:</span> {reference.volume}
                            </p>
                          )}
                          {reference.pages && (
                            <p className="mb-1">
                              <span className="font-medium">Pages:</span> {reference.pages}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {(!results.references.citations || results.references.citations.length === 0) && 
                 (!results.references.bibliography || results.references.bibliography.length === 0) && (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No References Found</h3>
                    <p className="text-sm text-muted-foreground">
                      No citations or references were detected in this document.
                    </p>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DocumentAnalysisResults;
