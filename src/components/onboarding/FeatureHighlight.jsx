import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

/**
 * Feature Highlight Component
 * Highlights a specific feature during onboarding
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Feature title
 * @param {string} props.description - Feature description
 * @param {React.ReactNode} props.icon - Feature icon
 * @param {string} props.imageSrc - Feature screenshot image source
 * @param {string} props.imageAlt - Feature screenshot image alt text
 * @param {string} props.path - Path to the feature page
 * @param {Function} props.onTryFeature - Function to call when user clicks try feature
 * @returns {React.ReactElement} Feature highlight component
 */
const FeatureHighlight = ({ 
  title, 
  description, 
  icon, 
  imageSrc, 
  imageAlt = "Feature screenshot", 
  path, 
  onTryFeature 
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex items-center">
          {icon && <div className="mr-2 text-primary">{icon}</div>}
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-6 space-y-4">
          {imageSrc && (
            <div className="rounded-md overflow-hidden border">
              <img 
                src={imageSrc} 
                alt={imageAlt} 
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Key Benefits:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              {/* These would be dynamic in a real implementation */}
              <li>Enhance your learning efficiency</li>
              <li>Save time with smart tools</li>
              <li>Improve knowledge retention</li>
            </ul>
          </div>
          
          <Button 
            onClick={() => onTryFeature(path)}
            className="w-full"
          >
            Try This Feature
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureHighlight;
