import React, { useState } from 'react';
import { useImageProcessing } from '@/services/visual-recognition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { 
  Loader2, 
  ImageIcon, 
  Crop, 
  RotateCw, 
  Sliders, 
  Wand2,
  Maximize,
  Minimize,
  Contrast,
  FileText
} from 'lucide-react';

/**
 * Image Processing Tools Component
 * @param {Object} props - Component props
 * @param {string} props.imageId - Image ID
 * @param {string} props.imageUrl - Image URL
 * @param {Function} props.onProcessedImage - Callback when image is processed
 * @returns {React.ReactElement} Image processing tools component
 */
const ImageProcessingTools = ({ imageId, imageUrl, onProcessedImage }) => {
  const imageProcessing = useImageProcessing();
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('enhance');
  
  // Enhance state
  const [enhanceOptions, setEnhanceOptions] = useState({
    type: 'auto',
    brightness: 0,
    contrast: 0,
    sharpness: 0
  });
  
  // Crop state
  const [cropRegion, setCropRegion] = useState({
    x: 0,
    y: 0,
    width: 100,
    height: 100
  });
  
  // Rotate state
  const [rotateDegrees, setRotateDegrees] = useState(0);
  
  // Filter state
  const [filterType, setFilterType] = useState('grayscale');
  
  // Optimize state
  const [optimizationType, setOptimizationType] = useState('text');
  
  // Handle enhance image
  const handleEnhanceImage = async () => {
    if (!imageId) return;
    
    try {
      setLoading(true);
      
      // Enhance image
      const result = await imageProcessing.enhanceImage(imageId, enhanceOptions);
      
      if (onProcessedImage) {
        onProcessedImage(result.enhancedImage);
      }
      
      toast({
        title: 'Image Enhanced',
        description: 'Image has been enhanced successfully',
      });
    } catch (error) {
      console.error('Error enhancing image:', error);
      toast({
        title: 'Enhancement Failed',
        description: error.message || 'An error occurred during image enhancement',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle crop image
  const handleCropImage = async () => {
    if (!imageId) return;
    
    try {
      setLoading(true);
      
      // Crop image
      const result = await imageProcessing.cropImage(imageId, cropRegion);
      
      if (onProcessedImage) {
        onProcessedImage(result.croppedImage);
      }
      
      toast({
        title: 'Image Cropped',
        description: 'Image has been cropped successfully',
      });
    } catch (error) {
      console.error('Error cropping image:', error);
      toast({
        title: 'Cropping Failed',
        description: error.message || 'An error occurred during image cropping',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle rotate image
  const handleRotateImage = async () => {
    if (!imageId) return;
    
    try {
      setLoading(true);
      
      // Rotate image
      const result = await imageProcessing.rotateImage(imageId, rotateDegrees);
      
      if (onProcessedImage) {
        onProcessedImage(result.rotatedImage);
      }
      
      toast({
        title: 'Image Rotated',
        description: `Image has been rotated by ${rotateDegrees} degrees`,
      });
    } catch (error) {
      console.error('Error rotating image:', error);
      toast({
        title: 'Rotation Failed',
        description: error.message || 'An error occurred during image rotation',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle apply filter
  const handleApplyFilter = async () => {
    if (!imageId) return;
    
    try {
      setLoading(true);
      
      // Apply filter
      const result = await imageProcessing.applyFilter(imageId, filterType);
      
      if (onProcessedImage) {
        onProcessedImage(result.filteredImage);
      }
      
      toast({
        title: 'Filter Applied',
        description: `${filterType} filter has been applied successfully`,
      });
    } catch (error) {
      console.error('Error applying filter:', error);
      toast({
        title: 'Filter Failed',
        description: error.message || 'An error occurred while applying the filter',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle optimize for recognition
  const handleOptimizeForRecognition = async () => {
    if (!imageId) return;
    
    try {
      setLoading(true);
      
      // Optimize for recognition
      const result = await imageProcessing.optimizeForRecognition(imageId, optimizationType);
      
      if (onProcessedImage) {
        onProcessedImage(result.optimizedImage);
      }
      
      toast({
        title: 'Image Optimized',
        description: `Image has been optimized for ${optimizationType} recognition`,
      });
    } catch (error) {
      console.error('Error optimizing image:', error);
      toast({
        title: 'Optimization Failed',
        description: error.message || 'An error occurred during image optimization',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Image Processing Tools</CardTitle>
        <CardDescription>
          Enhance and optimize images for better recognition
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="enhance">Enhance</TabsTrigger>
            <TabsTrigger value="crop">Crop</TabsTrigger>
            <TabsTrigger value="rotate">Rotate</TabsTrigger>
            <TabsTrigger value="filter">Filter</TabsTrigger>
            <TabsTrigger value="optimize">Optimize</TabsTrigger>
          </TabsList>
          
          <TabsContent value="enhance">
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                {imageUrl && (
                  <img 
                    src={imageUrl} 
                    alt="Image to enhance" 
                    className="w-full h-auto object-contain max-h-[300px]"
                  />
                )}
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Enhancement Type</Label>
                  <RadioGroup
                    value={enhanceOptions.type}
                    onValueChange={(value) => setEnhanceOptions(prev => ({ ...prev, type: value }))}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="auto" id="auto" />
                      <Label htmlFor="auto">Auto Enhance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="custom" id="custom" />
                      <Label htmlFor="custom">Custom Settings</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {enhanceOptions.type === 'custom' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="brightness">Brightness</Label>
                        <span className="text-sm text-muted-foreground">{enhanceOptions.brightness}</span>
                      </div>
                      <Slider
                        id="brightness"
                        min={-100}
                        max={100}
                        step={1}
                        value={[enhanceOptions.brightness]}
                        onValueChange={(value) => setEnhanceOptions(prev => ({ ...prev, brightness: value[0] }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="contrast">Contrast</Label>
                        <span className="text-sm text-muted-foreground">{enhanceOptions.contrast}</span>
                      </div>
                      <Slider
                        id="contrast"
                        min={-100}
                        max={100}
                        step={1}
                        value={[enhanceOptions.contrast]}
                        onValueChange={(value) => setEnhanceOptions(prev => ({ ...prev, contrast: value[0] }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="sharpness">Sharpness</Label>
                        <span className="text-sm text-muted-foreground">{enhanceOptions.sharpness}</span>
                      </div>
                      <Slider
                        id="sharpness"
                        min={-100}
                        max={100}
                        step={1}
                        value={[enhanceOptions.sharpness]}
                        onValueChange={(value) => setEnhanceOptions(prev => ({ ...prev, sharpness: value[0] }))}
                      />
                    </div>
                  </div>
                )}
                
                <Button
                  onClick={handleEnhanceImage}
                  disabled={loading || !imageId}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Enhance Image
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="crop">
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                {imageUrl && (
                  <img 
                    src={imageUrl} 
                    alt="Image to crop" 
                    className="w-full h-auto object-contain max-h-[300px]"
                  />
                )}
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="crop-x">X Position</Label>
                    <Input
                      id="crop-x"
                      type="number"
                      min="0"
                      value={cropRegion.x}
                      onChange={(e) => setCropRegion(prev => ({ ...prev, x: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crop-y">Y Position</Label>
                    <Input
                      id="crop-y"
                      type="number"
                      min="0"
                      value={cropRegion.y}
                      onChange={(e) => setCropRegion(prev => ({ ...prev, y: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crop-width">Width</Label>
                    <Input
                      id="crop-width"
                      type="number"
                      min="1"
                      value={cropRegion.width}
                      onChange={(e) => setCropRegion(prev => ({ ...prev, width: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crop-height">Height</Label>
                    <Input
                      id="crop-height"
                      type="number"
                      min="1"
                      value={cropRegion.height}
                      onChange={(e) => setCropRegion(prev => ({ ...prev, height: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                </div>
                
                <Button
                  onClick={handleCropImage}
                  disabled={loading || !imageId}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cropping...
                    </>
                  ) : (
                    <>
                      <Crop className="mr-2 h-4 w-4" />
                      Crop Image
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="rotate">
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                {imageUrl && (
                  <img 
                    src={imageUrl} 
                    alt="Image to rotate" 
                    className="w-full h-auto object-contain max-h-[300px]"
                  />
                )}
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="rotate-degrees">Rotation Angle (degrees)</Label>
                    <span className="text-sm text-muted-foreground">{rotateDegrees}°</span>
                  </div>
                  <Slider
                    id="rotate-degrees"
                    min={0}
                    max={360}
                    step={90}
                    value={[rotateDegrees]}
                    onValueChange={(value) => setRotateDegrees(value[0])}
                  />
                </div>
                
                <div className="flex justify-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setRotateDegrees(prev => (prev + 270) % 360)}
                  >
                    <RotateCw className="h-4 w-4 mr-2" />
                    -90°
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setRotateDegrees(prev => (prev + 90) % 360)}
                  >
                    <RotateCw className="h-4 w-4 mr-2" />
                    +90°
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setRotateDegrees(prev => (prev + 180) % 360)}
                  >
                    <RotateCw className="h-4 w-4 mr-2" />
                    180°
                  </Button>
                </div>
                
                <Button
                  onClick={handleRotateImage}
                  disabled={loading || !imageId}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Rotating...
                    </>
                  ) : (
                    <>
                      <RotateCw className="mr-2 h-4 w-4" />
                      Rotate Image
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="filter">
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                {imageUrl && (
                  <img 
                    src={imageUrl} 
                    alt="Image to filter" 
                    className="w-full h-auto object-contain max-h-[300px]"
                  />
                )}
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Filter Type</Label>
                  <RadioGroup
                    value={filterType}
                    onValueChange={setFilterType}
                    className="grid grid-cols-2 gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="grayscale" id="grayscale" />
                      <Label htmlFor="grayscale">Grayscale</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="binarize" id="binarize" />
                      <Label htmlFor="binarize">Binarize</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sharpen" id="sharpen" />
                      <Label htmlFor="sharpen">Sharpen</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="contrast" id="contrast" />
                      <Label htmlFor="contrast">Contrast</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="document" id="document" />
                      <Label htmlFor="document">Document</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Button
                  onClick={handleApplyFilter}
                  disabled={loading || !imageId}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Applying Filter...
                    </>
                  ) : (
                    <>
                      <Sliders className="mr-2 h-4 w-4" />
                      Apply Filter
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="optimize">
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                {imageUrl && (
                  <img 
                    src={imageUrl} 
                    alt="Image to optimize" 
                    className="w-full h-auto object-contain max-h-[300px]"
                  />
                )}
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Optimize For</Label>
                  <RadioGroup
                    value={optimizationType}
                    onValueChange={setOptimizationType}
                    className="grid grid-cols-2 gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="text" id="text" />
                      <Label htmlFor="text">Text Recognition</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="handwriting" id="handwriting" />
                      <Label htmlFor="handwriting">Handwriting</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="formula" id="formula" />
                      <Label htmlFor="formula">Formulas</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="chart" id="chart" />
                      <Label htmlFor="chart">Charts</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="document" id="document" />
                      <Label htmlFor="document">Document</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Button
                  onClick={handleOptimizeForRecognition}
                  disabled={loading || !imageId}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Optimize for {optimizationType}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Process images to improve recognition accuracy
        </div>
      </CardFooter>
    </Card>
  );
};

export default ImageProcessingTools;
