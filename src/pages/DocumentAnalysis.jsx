import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { DocumentUploader, DocumentAnalysisResults, DocumentList } from '@/components/documents';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Upload, List } from 'lucide-react';

/**
 * Document Analysis Page
 * Page for uploading and analyzing documents
 * @returns {React.ReactElement} Document analysis page
 */
const DocumentAnalysis = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedDocument, setSelectedDocument] = useState(null);
  
  // Handle document upload completion
  const handleUploadComplete = (result) => {
    console.log('Upload complete:', result);
    setSelectedDocument({ job_id: result.jobId });
    setActiveTab('results');
  };
  
  // Handle document selection from list
  const handleSelectDocument = (document) => {
    setSelectedDocument(document);
    setActiveTab('results');
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-2">Document Analysis</h1>
        <p className="text-lg mb-6">
          Upload documents to extract knowledge, formulas, tables, and more
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <DocumentList onSelectDocument={handleSelectDocument} />
          </div>
          
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Document
                </TabsTrigger>
                <TabsTrigger 
                  value="results" 
                  className="flex items-center gap-2"
                  disabled={!selectedDocument}
                >
                  <FileText className="h-4 w-4" />
                  Analysis Results
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload">
                <DocumentUploader onUploadComplete={handleUploadComplete} />
              </TabsContent>
              
              <TabsContent value="results">
                {selectedDocument ? (
                  <DocumentAnalysisResults jobId={selectedDocument.job_id} />
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h2 className="text-xl font-medium mb-2">No Document Selected</h2>
                    <p className="text-muted-foreground">
                      Upload a document or select one from your list to view analysis results.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DocumentAnalysis;
