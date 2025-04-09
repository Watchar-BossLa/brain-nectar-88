import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Sparkles, ArrowRight } from 'lucide-react';

/**
 * Feature Announcement Component
 * Announces a new feature to users
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Announcement title
 * @param {string} props.description - Announcement description
 * @param {React.ReactNode} props.icon - Announcement icon
 * @param {string} props.featureId - Unique identifier for the feature
 * @param {string} props.path - Path to the feature page
 * @param {boolean} props.showOnce - Whether to show the announcement only once
 * @param {boolean} props.forceShow - Whether to force showing the announcement
 * @param {Function} props.onDismiss - Function to call when announcement is dismissed
 * @returns {React.ReactElement} Feature announcement component
 */
const FeatureAnnouncement = ({ 
  title, 
  description, 
  icon, 
  featureId, 
  path, 
  showOnce = true, 
  forceShow = false,
  onDismiss
}) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  
  // Check if the announcement has been seen before
  useEffect(() => {
    if (forceShow) {
      setShow(true);
      return;
    }
    
    if (showOnce) {
      const seenAnnouncements = JSON.parse(localStorage.getItem('seenFeatureAnnouncements') || '{}');
      if (!seenAnnouncements[featureId]) {
        setShow(true);
      }
    } else {
      setShow(true);
    }
  }, [featureId, showOnce, forceShow]);
  
  // Handle dismiss
  const handleDismiss = () => {
    setShow(false);
    
    if (showOnce) {
      const seenAnnouncements = JSON.parse(localStorage.getItem('seenFeatureAnnouncements') || '{}');
      seenAnnouncements[featureId] = true;
      localStorage.setItem('seenFeatureAnnouncements', JSON.stringify(seenAnnouncements));
    }
    
    if (onDismiss) {
      onDismiss();
    }
  };
  
  // Handle try feature
  const handleTryFeature = () => {
    handleDismiss();
    navigate(path);
  };
  
  if (!show) {
    return null;
  }
  
  return (
    <Card className="relative overflow-hidden border-primary/20 bg-primary/5">
      <div className="absolute top-3 right-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-center">
          {icon || <Sparkles className="h-5 w-5 mr-2 text-primary" />}
          <CardTitle className="text-lg">New Feature</CardTitle>
        </div>
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm">{description}</p>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleTryFeature}
          className="w-full"
        >
          Try it now
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeatureAnnouncement;
