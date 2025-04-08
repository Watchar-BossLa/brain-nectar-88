import React, { useState, useRef } from 'react';
import { useVisualRecognition } from '@/services/visual-recognition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import { Upload, Image as ImageIcon, FileX, Camera } from 'lucide-react';

/**
 * Image Uploader Component
 * Allows users to upload images for visual recognition
 * @param {Object} props - Component props
 * @param {Function} [props.onUploadComplete] - Callback when upload is complete
 * @returns {React.ReactElement} Image uploader component
 */
const ImageUploader = ({ onUploadComplete }) => {
  const visualRecognition = useVisualRecognition();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  
  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };
  
  // Handle file selection
  const handleFileSelection = (file) => {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file (JPEG, PNG, etc.)',
        variant: 'destructive'
      });
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 10MB',
        variant: 'destructive'
      });
      return;
    }
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setSelectedFile(file);
  };
  
  // Handle file input change
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelection(file);
    }
  };
  
  // Handle click on upload area
  const handleUploadAreaClick = () => {
    fileInputRef.current.click();
  };
  
  // Handle upload button click
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      setIsUploading(true);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return newProgress;
        });
      }, 300);
      
      // Upload image
      const uploadedImage = await visualRecognition.uploadImage(selectedFile);
      
      // Clear interval and set progress to 100%
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Show success toast
      toast({
        title: 'Image uploaded successfully',
        description: 'Your image is now being processed for visual recognition',
      });
      
      // Reset state after a delay
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setPreviewUrl(null);
        setSelectedFile(null);
        
        // Call onUploadComplete callback if provided
        if (onUploadComplete) {
          onUploadComplete(uploadedImage);
        }
      }, 1000);
    } catch (error) {
      console.error('Error uploading image:', error);
      
      toast({
        title: 'Upload failed',
        description: error.message || 'An error occurred while uploading the image',
        variant: 'destructive'
      });
      
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  // Handle cancel button click
  const handleCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Image</CardTitle>
        <CardDescription>
          Upload an image to analyze with visual recognition
        </CardDescription>
      </CardHeader>
      <CardContent>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileInputChange}
        />
        
        {!previewUrl ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUploadAreaClick}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <Upload className="h-12 w-12 text-muted-foreground" />
              <div>
                <p className="text-lg font-medium">Drag and drop an image here</p>
                <p className="text-sm text-muted-foreground">
                  or click to browse your files
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Supported formats: JPEG, PNG, GIF, BMP
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden border">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>
            
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {previewUrl && (
          <>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isUploading}
            >
              <FileX className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-pulse" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </>
        )}
        
        {!previewUrl && (
          <div className="flex w-full justify-center space-x-4">
            <Button
              variant="outline"
              onClick={handleUploadAreaClick}
              className="flex-1"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Browse Files
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                // TODO: Implement camera capture functionality
                toast({
                  title: 'Camera capture',
                  description: 'This feature is not yet implemented',
                });
              }}
            >
              <Camera className="h-4 w-4 mr-2" />
              Use Camera
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ImageUploader;
