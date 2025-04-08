import React, { useState, useEffect } from 'react';
import { useVisualRecognition } from '@/services/visual-recognition';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { 
  Image as ImageIcon, 
  Trash2, 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';

/**
 * Image Gallery Component
 * Displays a gallery of uploaded images for visual recognition
 * @param {Object} props - Component props
 * @param {Function} [props.onSelectImage] - Callback when an image is selected
 * @param {boolean} [props.autoRefresh=false] - Whether to auto-refresh the gallery
 * @returns {React.ReactElement} Image gallery component
 */
const ImageGallery = ({ onSelectImage, autoRefresh = false }) => {
  const visualRecognition = useVisualRecognition();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load images
  const loadImages = async () => {
    try {
      setLoading(true);
      const userImages = await visualRecognition.getUserImages();
      setImages(userImages);
      setError(null);
    } catch (err) {
      console.error('Error loading images:', err);
      setError(err.message || 'Failed to load images');
    } finally {
      setLoading(false);
    }
  };
  
  // Load images on mount
  useEffect(() => {
    loadImages();
    
    // Set up auto-refresh if enabled
    let refreshInterval;
    if (autoRefresh) {
      refreshInterval = setInterval(() => {
        loadImages();
      }, 10000); // Refresh every 10 seconds
    }
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [autoRefresh, visualRecognition]);
  
  // Handle image selection
  const handleSelectImage = (image) => {
    if (onSelectImage) {
      onSelectImage(image);
    }
  };
  
  // Handle image deletion
  const handleDeleteImage = async (e, imageId) => {
    e.stopPropagation(); // Prevent triggering the card click
    
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }
    
    try {
      await visualRecognition.deleteImage(imageId);
      
      // Remove image from state
      setImages(images.filter(img => img.id !== imageId));
      
      toast({
        title: 'Image deleted',
        description: 'The image has been deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting image:', err);
      
      toast({
        title: 'Deletion failed',
        description: err.message || 'An error occurred while deleting the image',
        variant: 'destructive'
      });
    }
  };
  
  // Get status badge for an image
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="outline" className="flex items-center">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            Processing
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="flex items-center text-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="flex items-center text-destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  // Render loading state
  if (loading && images.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Images</CardTitle>
          <CardDescription>
            Loading your uploaded images...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-40 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription>
            Failed to load your images
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <Button 
            onClick={loadImages} 
            className="mt-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Your Images</CardTitle>
            <CardDescription>
              {images.length === 0
                ? 'Upload your first image for visual recognition'
                : `You have ${images.length} uploaded image${images.length === 1 ? '' : 's'}`
              }
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={loadImages}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {images.length === 0 ? (
          <div className="text-center py-8">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Images</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload your first image to start using visual recognition
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleSelectImage(image)}
              >
                <div className="aspect-video relative">
                  <img
                    src={image.file_url}
                    alt={image.file_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(image.recognition_status)}
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-start">
                    <div className="truncate">
                      <h3 className="font-medium truncate">{image.file_name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(image.file_size)} • {formatDate(image.created_at)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={(e) => handleDeleteImage(e, image.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          {loading && 'Refreshing...'}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ImageGallery;
