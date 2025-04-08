import React, { useState, useEffect } from 'react';
import { useVisualRecognition } from '@/services/visual-recognition';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { 
  ArrowLeft, 
  Tag, 
  FileText, 
  Box, 
  Function, 
  BarChart, 
  Pencil,
  RefreshCw,
  AlertCircle,
  Clock,
  CheckCircle
} from 'lucide-react';

/**
 * Image Analysis Results Component
 * Displays the results of visual recognition analysis for an image
 * @param {Object} props - Component props
 * @param {Object} props.image - Image object
 * @param {Function} [props.onBack] - Callback when back button is clicked
 * @returns {React.ReactElement} Image analysis results component
 */
const ImageAnalysisResults = ({ image, onBack }) => {
  const visualRecognition = useVisualRecognition();
  const [imageDetails, setImageDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Load image details
  const loadImageDetails = async () => {
    if (!image) return;
    
    try {
      setLoading(true);
      const details = await visualRecognition.getImageDetails(image.id);
      setImageDetails(details);
      setError(null);
    } catch (err) {
      console.error('Error loading image details:', err);
      setError(err.message || 'Failed to load image details');
    } finally {
      setLoading(false);
    }
  };
  
  // Load image details on mount or when image changes
  useEffect(() => {
    loadImageDetails();
  }, [image, visualRecognition]);
  
  // Get status badge
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
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  // Render loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>
                <Skeleton className="h-6 w-48" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-32 mt-1" />
              </CardDescription>
            </div>
            {onBack && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onBack}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
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
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-destructive">Error</CardTitle>
              <CardDescription>
                Failed to load image details
              </CardDescription>
            </div>
            {onBack && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onBack}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <Button 
            onClick={loadImageDetails} 
            className="mt-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // Render if no image details
  if (!imageDetails) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>No Image Selected</CardTitle>
              <CardDescription>
                Select an image to view analysis results
              </CardDescription>
            </div>
            {onBack && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onBack}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No image details available
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{imageDetails.file_name}</CardTitle>
            <CardDescription className="flex items-center space-x-2">
              <span>Uploaded on {formatDate(imageDetails.created_at)}</span>
              <span>•</span>
              <span>{getStatusBadge(imageDetails.recognition_status)}</span>
            </CardDescription>
          </div>
          {onBack && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Image preview */}
          <div className="rounded-lg overflow-hidden border">
            <img
              src={imageDetails.file_url}
              alt={imageDetails.file_name}
              className="w-full object-contain max-h-96"
            />
          </div>
          
          {/* Analysis results tabs */}
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Text</span>
              </TabsTrigger>
              <TabsTrigger value="objects" className="flex items-center gap-2">
                <Box className="h-4 w-4" />
                <span className="hidden sm:inline">Objects</span>
              </TabsTrigger>
              <TabsTrigger value="formulas" className="flex items-center gap-2">
                <Function className="h-4 w-4" />
                <span className="hidden sm:inline">Formulas</span>
              </TabsTrigger>
              <TabsTrigger value="charts" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                <span className="hidden sm:inline">Charts</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Overview tab */}
            <TabsContent value="overview" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Tags</h3>
                {imageDetails.tags.length === 0 ? (
                  <p className="text-muted-foreground">No tags detected</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {imageDetails.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag.tag}
                        {tag.confidence && (
                          <span className="ml-1 text-xs opacity-70">
                            {Math.round(tag.confidence * 100)}%
                          </span>
                        )}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-3">
                    <p className="text-sm font-medium">Text Elements</p>
                    <p className="text-2xl">{imageDetails.text.length}</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-sm font-medium">Objects</p>
                    <p className="text-2xl">{imageDetails.objects.length}</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-sm font-medium">Formulas</p>
                    <p className="text-2xl">{imageDetails.formulas.length}</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-sm font-medium">Charts</p>
                    <p className="text-2xl">{imageDetails.charts.length}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Annotations</h3>
                {imageDetails.annotations.length === 0 ? (
                  <div className="border rounded-lg p-4 text-center">
                    <Pencil className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No annotations yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Add annotations to highlight important parts of the image
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {imageDetails.annotations.map((annotation) => (
                      <div key={annotation.id} className="border rounded-lg p-3">
                        <div className="flex justify-between">
                          <Badge>{annotation.annotation_type}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(annotation.created_at)}
                          </span>
                        </div>
                        <p className="mt-2">{annotation.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Text tab */}
            <TabsContent value="text" className="space-y-4">
              <h3 className="text-lg font-medium">Extracted Text</h3>
              {imageDetails.text.length === 0 ? (
                <div className="border rounded-lg p-4 text-center">
                  <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No text detected</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {imageDetails.text.map((text, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <p>{text.text_content}</p>
                        {text.confidence && (
                          <Badge variant="outline">
                            {Math.round(text.confidence * 100)}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* Objects tab */}
            <TabsContent value="objects" className="space-y-4">
              <h3 className="text-lg font-medium">Detected Objects</h3>
              {imageDetails.objects.length === 0 ? (
                <div className="border rounded-lg p-4 text-center">
                  <Box className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No objects detected</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {imageDetails.objects.map((object, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge className="mb-2">{object.object_class}</Badge>
                          <p className="text-xs text-muted-foreground">
                            Position: x={object.bounding_box.x}, y={object.bounding_box.y}, 
                            width={object.bounding_box.width}, height={object.bounding_box.height}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {Math.round(object.confidence * 100)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* Formulas tab */}
            <TabsContent value="formulas" className="space-y-4">
              <h3 className="text-lg font-medium">Mathematical Formulas</h3>
              {imageDetails.formulas.length === 0 ? (
                <div className="border rounded-lg p-4 text-center">
                  <Function className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No formulas detected</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {imageDetails.formulas.map((formula, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-mono bg-muted p-2 rounded mb-2">
                            {formula.latex}
                          </p>
                          {formula.rendered_image_url && (
                            <img
                              src={formula.rendered_image_url}
                              alt={formula.latex}
                              className="max-h-16"
                            />
                          )}
                        </div>
                        {formula.confidence && (
                          <Badge variant="outline">
                            {Math.round(formula.confidence * 100)}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* Charts tab */}
            <TabsContent value="charts" className="space-y-4">
              <h3 className="text-lg font-medium">Detected Charts</h3>
              {imageDetails.charts.length === 0 ? (
                <div className="border rounded-lg p-4 text-center">
                  <BarChart className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No charts detected</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {imageDetails.charts.map((chart, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge className="mb-2">{chart.chart_type} Chart</Badge>
                          <p className="text-sm">
                            {chart.chart_data.title || 'Untitled Chart'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Data: {JSON.stringify(chart.chart_data).substring(0, 100)}...
                          </p>
                        </div>
                        {chart.confidence && (
                          <Badge variant="outline">
                            {Math.round(chart.confidence * 100)}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline"
          onClick={loadImageDetails}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        
        <Button
          onClick={() => {
            // TODO: Implement annotation functionality
            toast({
              title: 'Add annotation',
              description: 'This feature is not yet implemented',
            });
          }}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Add Annotation
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImageAnalysisResults;
