
import React, { useRef, useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, X, FlipHorizontal, Video, Image } from 'lucide-react';
import { CameraCaptureProps } from '../../types/platform-types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const CameraCapture: React.FC<CameraCaptureProps> = ({ 
  onImageCaptured, 
  onVideoCaptured,
  allowVideo = true,
  onClose 
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'photo' | 'video'>('photo');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<BlobPart[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      if (streamRef.current) {
        stopCamera();
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: activeTab === 'video'
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      toast.error('Unable to access camera. Please check permissions.');
      closeDialog();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame on the canvas
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to data URL and pass it to the callback
      const imageData = canvas.toDataURL('image/jpeg');
      onImageCaptured(imageData);
      
      closeDialog();
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    
    setRecordedChunks([]);
    setIsRecording(true);
    
    const recorder = new MediaRecorder(streamRef.current);
    setMediaRecorder(recorder);
    
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks(prev => [...prev, event.data]);
      }
    };
    
    recorder.onstop = () => {
      if (recordedChunks.length > 0 && onVideoCaptured) {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        onVideoCaptured(blob);
        closeDialog();
      }
    };
    
    // Start recording with 1s chunks
    recorder.start(1000);
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const closeDialog = () => {
    if (isRecording && mediaRecorder) {
      mediaRecorder.stop();
    }
    stopCamera();
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleTabChange = (value: string) => {
    if (value === 'photo' || value === 'video') {
      setActiveTab(value);
      // Restart camera with new audio constraints
      startCamera();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={isOpen => {
      if (!isOpen) closeDialog();
    }}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="p-4 mb-0">
          <div className="flex items-center justify-between">
            <DialogTitle>Capture {activeTab === 'photo' ? 'Photo' : 'Video'}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={closeDialog} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Take a {activeTab === 'photo' ? 'photo' : 'video'} of your equation or question
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative bg-black aspect-video">
          <video 
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          ></video>
          <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
        
        <div className="p-4">
          {allowVideo && (
            <Tabs defaultValue="photo" value={activeTab} onValueChange={handleTabChange} className="mb-4">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="photo" className="flex items-center gap-2">
                  <Image className="h-4 w-4" /> Photo
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center gap-2">
                  <Video className="h-4 w-4" /> Video
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
          
          <div className="flex justify-center gap-3 mt-2">
            <Button variant="outline" size="icon" onClick={switchCamera}>
              <FlipHorizontal className="h-4 w-4" />
            </Button>
            
            {activeTab === 'photo' ? (
              <Button onClick={capturePhoto} className="flex-1">
                <Camera className="h-4 w-4 mr-2" /> Capture Photo
              </Button>
            ) : (
              isRecording ? (
                <Button variant="destructive" onClick={stopRecording} className="flex-1">
                  <span className="h-2 w-2 bg-red-500 rounded-full mr-2 animate-pulse"></span> Stop Recording
                </Button>
              ) : (
                <Button onClick={startRecording} className="flex-1">
                  <Video className="h-4 w-4 mr-2" /> Start Recording
                </Button>
              )
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CameraCapture;
