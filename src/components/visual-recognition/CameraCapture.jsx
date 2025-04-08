
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { toast } from 'react-toastify';
import { Camera, X, CropIcon, Image, ZoomIn, ZoomOut, Check, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

/**
 * Camera capture component for taking photos of handwritten content
 * @returns {React.ReactElement} Camera capture interface
 */
const CameraCapture = ({ onCapture, onCancel }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [cropStart, setCropStart] = useState({ x: 0, y: 0 });
  const [cropEnd, setCropEnd] = useState({ x: 0, y: 0 });
  const [capturedImage, setCapturedImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [cameraError, setCameraError] = useState(null);
  const [isFrontCamera, setIsFrontCamera] = useState(true);

  // Initialize camera when component mounts or when camera is toggled
  useEffect(() => {
    if (isCameraOpen) {
      initCamera();
    } else {
      stopCamera();
    }
    
    return () => stopCamera();
  }, [isCameraOpen, isFrontCamera]);

  /**
   * Initialize camera and request permissions
   */
  const initCamera = async () => {
    try {
      setCameraError(null);
      
      const constraints = {
        video: { 
          facingMode: isFrontCamera ? "user" : "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraReady(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError(`Camera access error: ${error.message}`);
      toast.error('Could not access camera. Please check permissions.');
    }
  };

  /**
   * Stop camera stream and release resources
   */
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraReady(false);
  };

  /**
   * Toggle between front and back camera
   */
  const toggleCamera = () => {
    stopCamera();
    setIsFrontCamera(!isFrontCamera);
  };

  /**
   * Open the camera interface
   */
  const openCamera = () => {
    setIsCameraOpen(true);
  };

  /**
   * Close the camera interface
   */
  const closeCamera = () => {
    stopCamera();
    setIsCameraOpen(false);
    setCapturedImage(null);
    setIsCropping(false);
    if (onCancel) onCancel();
  };

  /**
   * Capture current frame from video stream
   */
  const captureImage = () => {
    if (!videoRef.current || !isCameraReady) return;
    
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    // Apply zoom if needed
    if (zoomLevel !== 1) {
      const scaleFactor = zoomLevel;
      const centerX = video.videoWidth / 2;
      const centerY = video.videoHeight / 2;
      const cropWidth = video.videoWidth / scaleFactor;
      const cropHeight = video.videoHeight / scaleFactor;
      
      ctx.drawImage(
        video,
        centerX - cropWidth / 2, centerY - cropHeight / 2, cropWidth, cropHeight,
        0, 0, canvas.width, canvas.height
      );
    } else {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
    
    const imageDataURL = canvas.toDataURL('image/png');
    setCapturedImage(imageDataURL);
    stopCamera();
  };

  /**
   * Reset camera for another capture
   */
  const retakeImage = () => {
    setCapturedImage(null);
    initCamera();
  };

  /**
   * Start cropping the captured image
   */
  const startCropping = () => {
    setIsCropping(true);
  };

  /**
   * Handle mouse down event for cropping
   */
  const handleCropStart = (e) => {
    if (!isCropping) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCropStart({ x, y });
  };

  /**
   * Handle mouse move event for cropping
   */
  const handleCropMove = (e) => {
    if (!isCropping) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCropEnd({ x, y });
  };

  /**
   * Handle mouse up event for cropping
   */
  const handleCropEnd = () => {
    if (!isCropping || !capturedImage) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Calculate crop dimensions
    const startX = Math.min(cropStart.x, cropEnd.x);
    const startY = Math.min(cropStart.y, cropEnd.y);
    const width = Math.abs(cropEnd.x - cropStart.x);
    const height = Math.abs(cropEnd.y - cropStart.y);
    
    if (width < 10 || height < 10) {
      toast.error('Selection too small. Please try again.');
      return;
    }
    
    // Apply crop
    const img = new Image();
    img.onload = () => {
      // Create new canvas for cropped image
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = width;
      croppedCanvas.height = height;
      const croppedCtx = croppedCanvas.getContext('2d');
      
      // Calculate real image coordinates based on canvas scaling
      const scaleX = img.width / canvas.width;
      const scaleY = img.height / canvas.height;
      
      croppedCtx.drawImage(
        img,
        startX * scaleX, startY * scaleY, width * scaleX, height * scaleY,
        0, 0, width, height
      );
      
      const croppedImageDataURL = croppedCanvas.toDataURL('image/png');
      setCapturedImage(croppedImageDataURL);
      setIsCropping(false);
    };
    img.src = capturedImage;
  };

  /**
   * Confirm captured image and send to parent component
   */
  const confirmImage = () => {
    if (capturedImage && onCapture) {
      onCapture(capturedImage);
      closeCamera();
    }
  };

  // Render camera capture interface
  return (
    <>
      <Button variant="outline" onClick={openCamera} className="flex items-center gap-2">
        <Camera size={18} />
        Capture Image
      </Button>
      
      <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Capture Handwritten Content</DialogTitle>
          </DialogHeader>
          
          {cameraError ? (
            <div className="p-4 text-center bg-destructive/10 text-destructive rounded-md">
              <p>{cameraError}</p>
              <Button variant="outline" onClick={initCamera} className="mt-2">
                Retry
              </Button>
            </div>
          ) : capturedImage ? (
            <div className="relative">
              <canvas
                ref={canvasRef}
                className={`w-full border ${isCropping ? 'cursor-crosshair' : ''}`}
                style={{ aspectRatio: '4/3' }}
                onMouseDown={handleCropStart}
                onMouseMove={handleCropMove}
                onMouseUp={handleCropEnd}
                onMouseLeave={isCropping ? handleCropEnd : undefined}
              />
              
              <img
                src={capturedImage}
                alt="Captured"
                className="hidden"
                onLoad={(e) => {
                  const canvas = canvasRef.current;
                  const ctx = canvas.getContext('2d');
                  
                  // Maintain aspect ratio
                  canvas.width = canvas.clientWidth;
                  canvas.height = canvas.clientHeight;
                  
                  // Draw image to fit canvas
                  ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);
                }}
              />
              
              {isCropping && (
                <div
                  className="absolute border-2 border-primary bg-primary/20 pointer-events-none"
                  style={{
                    left: Math.min(cropStart.x, cropEnd.x),
                    top: Math.min(cropStart.y, cropEnd.y),
                    width: Math.abs(cropEnd.x - cropStart.x),
                    height: Math.abs(cropEnd.y - cropStart.y)
                  }}
                />
              )}
              
              <div className="flex gap-2 justify-center mt-4">
                <Button variant="outline" onClick={retakeImage}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retake
                </Button>
                
                {!isCropping ? (
                  <Button variant="outline" onClick={startCropping}>
                    <CropIcon className="mr-2 h-4 w-4" />
                    Crop
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => setIsCropping(false)}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel Crop
                  </Button>
                )}
                
                <Button onClick={confirmImage} disabled={isCropping}>
                  <Check className="mr-2 h-4 w-4" />
                  Confirm
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="relative w-full overflow-hidden rounded-lg border">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full"
                  style={{ aspectRatio: '4/3' }}
                />
                
                {!isCameraReady && !cameraError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-primary"></div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Zoom: {Math.round(zoomLevel * 100)}%</span>
                  <div className="flex items-center gap-2">
                    <ZoomOut size={16} />
                    <Slider
                      value={[zoomLevel * 100]}
                      min={100}
                      max={300}
                      step={10}
                      className="w-28 md:w-40"
                      onValueChange={(value) => setZoomLevel(value[0] / 100)}
                    />
                    <ZoomIn size={16} />
                  </div>
                </div>
                
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={toggleCamera}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Switch Camera
                  </Button>
                  
                  <Button 
                    onClick={captureImage} 
                    disabled={!isCameraReady}
                    className="flex-1"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Capture
                  </Button>
                  
                  <Button variant="outline" onClick={closeCamera}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CameraCapture;
