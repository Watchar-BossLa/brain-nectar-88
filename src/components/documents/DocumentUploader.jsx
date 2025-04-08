import React, { useState, useRef } from 'react';
import { useDocumentAnalysis } from '@/services/documents';
import { useAuth } from '@/context/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * Document Uploader Component
 * Allows users to upload documents for analysis
 * @returns {React.ReactElement} Document uploader component
 */
const DocumentUploader = ({ onUploadComplete }) => {
  const { user } = useAuth();
  const documentAnalysis = useDocumentAnalysis();
  const fileInputRef = useRef(null);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [jobId, setJobId] = useState(null);
  
  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
      setUploadSuccess(false);
    }
  };
  
  // Handle file drop
  const handleDrop = (event) => {
    event.preventDefault();
    
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
      setUploadSuccess(false);
    }
  };
  
  // Prevent default behavior for drag events
  const handleDragOver = (event) => {
    event.preventDefault();
  };
  
  // Handle upload button click
  const handleUploadClick = () => {
    if (!selectedFile) {
      fileInputRef.current.click();
    } else {
      handleUpload();
    }
  };
  
  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile || !user) return;
    
    // Check if file type is supported
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    if (!documentAnalysis.isFileTypeSupported(fileExtension)) {
      setUploadError(`Unsupported file type: ${fileExtension}`);
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setUploadSuccess(false);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      // Upload document
      const result = await documentAnalysis.uploadDocument(selectedFile, user.id, {
        generateFlashcards: true,
        extractFormulas: true,
        extractTables: true
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadSuccess(true);
      setJobId(result.jobId);
      
      // Call onUploadComplete callback if provided
      if (onUploadComplete) {
        onUploadComplete(result);
      }
      
      // Start polling for job status
      startPollingJobStatus(result.jobId);
    } catch (error) {
      console.error('Error uploading document:', error);
      setUploadError(error.message || 'Failed to upload document');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };
  
  // Poll for job status
  const startPollingJobStatus = (jobId) => {
    const pollInterval = setInterval(async () => {
      try {
        const status = documentAnalysis.getJobStatus(jobId);
        
        if (status && (status.status === 'completed' || status.status === 'error')) {
          clearInterval(pollInterval);
          
          if (status.status === 'error') {
            setUploadError(`Processing failed: ${status.error}`);
          } else {
            console.log('Document processing completed:', status);
          }
        }
      } catch (error) {
        console.error('Error polling job status:', error);
        clearInterval(pollInterval);
      }
    }, 2000);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Document Analysis
        </CardTitle>
        <CardDescription>
          Upload documents to extract knowledge, formulas, tables, and more
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            isUploading ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.docx,.txt,.md,.csv,.xlsx"
          />
          
          {!selectedFile ? (
            <div className="py-4">
              <FileText className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop a document here, or click to select
              </p>
              <p className="text-xs text-muted-foreground">
                Supported formats: PDF, DOCX, TXT, MD, CSV, XLSX
              </p>
            </div>
          ) : (
            <div className="py-2">
              <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium mb-1">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>
        
        {isUploading && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}
        
        {uploadError && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}
        
        {uploadSuccess && (
          <Alert className="mt-4 bg-green-50 text-green-800 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Document uploaded successfully and is now being processed.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUploadClick}
          disabled={isUploading}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {selectedFile ? 'Upload Document' : 'Select Document'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentUploader;
