
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-toastify';
import { AlertCircle, Check, Lightbulb, Edit, Save } from 'lucide-react';

/**
 * Component for correcting errors in recognized content
 * 
 * @param {Object} props - Component props
 * @param {Object} props.originalContent - The original recognized content
 * @param {string} props.contentType - Type of content ('equation' or 'notes')
 * @param {Function} props.onCorrectionSubmit - Callback when correction is submitted
 * @param {Array<Object>} [props.suggestionHistory] - Previous correction suggestions
 * @returns {React.ReactElement} ErrorCorrectionInterface component
 */
const ErrorCorrectionInterface = ({
  originalContent,
  contentType,
  onCorrectionSubmit,
  suggestionHistory = []
}) => {
  const [correction, setCorrection] = useState('');
  const [errorDescription, setErrorDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [correctionType, setCorrectionType] = useState('full');
  const [selectedText, setSelectedText] = useState('');
  
  // Initialize correction text based on content type
  const initializeCorrection = () => {
    if (contentType === 'equation') {
      setCorrection(originalContent.latex || '');
    } else {
      setCorrection(originalContent.text || '');
    }
  };
  
  // Handle selecting text for partial correction
  const handleTextSelection = () => {
    if (correction) {
      const selection = window.getSelection().toString();
      if (selection) {
        setSelectedText(selection);
      }
    }
  };
  
  // Handle submitting the correction
  const handleSubmitCorrection = () => {
    if (!correction) {
      toast.error('Please provide a correction');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const correctionData = {
        original: contentType === 'equation' ? originalContent.latex : originalContent.text,
        corrected: correction,
        type: contentType,
        description: errorDescription,
        errorType: correctionType
      };
      
      // Submit the correction
      if (onCorrectionSubmit) {
        onCorrectionSubmit(correctionData);
      }
      
      toast.success('Correction submitted successfully');
      setErrorDescription('');
    } catch (error) {
      toast.error(`Error submitting correction: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Generate suggestions based on common error patterns
  const generateSuggestions = () => {
    if (contentType === 'equation') {
      const latex = originalContent.latex || '';
      
      // Look for common LaTeX errors
      if (latex.includes('\\frac') && !latex.includes('{')) {
        return "Add curly braces to fractions: \\frac{numerator}{denominator}";
      } else if ((latex.match(/\{/g) || []).length !== (latex.match(/\}/g) || []).length) {
        return "Check for mismatched curly braces { }";
      } else if (latex.includes('^') && !latex.includes('{') && latex.length > 10) {
        return "For multi-character exponents, use curly braces: x^{exponent}";
      }
      
      return "Double-check special characters and spacing in the equation";
    } else {
      const text = originalContent.text || '';
      
      if (text.length > 100) {
        // For longer texts, offer structure suggestions
        if (!text.includes('\n\n')) {
          return "Consider adding paragraph breaks for better readability";
        } else if (!text.match(/•|-|\*/)) {
          return "Use bullet points (•) to organize list items";
        }
      }
      
      return "Review punctuation and sentence structure";
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Edit className="mr-2 h-5 w-5" />
          Correction Interface
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="correction-type">Correction Type</Label>
          <div className="flex space-x-2">
            <Button
              variant={correctionType === 'full' ? 'default' : 'outline'}
              onClick={() => {
                setCorrectionType('full');
                initializeCorrection();
              }}
              size="sm"
            >
              Full Correction
            </Button>
            <Button
              variant={correctionType === 'partial' ? 'default' : 'outline'}
              onClick={() => {
                setCorrectionType('partial');
                initializeCorrection();
              }}
              size="sm"
            >
              Partial Correction
            </Button>
          </div>
        </div>
        
        {correctionType === 'partial' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Select text to edit specific parts of the content
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="correction-content">Corrected Content</Label>
          <Textarea
            id="correction-content"
            rows={contentType === 'notes' ? 6 : 3}
            value={correction}
            onChange={(e) => setCorrection(e.target.value)}
            onMouseUp={correctionType === 'partial' ? handleTextSelection : undefined}
            className={contentType === 'equation' ? 'font-mono' : ''}
            placeholder={contentType === 'equation' 
              ? 'Correct the LaTeX equation...' 
              : 'Correct the recognized text...'}
          />
        </div>
        
        {selectedText && (
          <div className="text-sm">
            <span className="font-medium">Selected:</span> {selectedText}
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="error-description">
            Error Description <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="error-description"
            value={errorDescription}
            onChange={(e) => setErrorDescription(e.target.value)}
            placeholder="Describe what was incorrect..."
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary" />
            <Label className="text-sm font-medium">Suggestion</Label>
          </div>
          <div className="p-3 text-sm bg-muted rounded-md">
            {generateSuggestions()}
          </div>
        </div>
        
        {suggestionHistory.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Previous Corrections</Label>
            <div className="space-y-2">
              {suggestionHistory.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-xs p-2 border rounded-md">
                  <Badge variant="outline" className="shrink-0">
                    {item.type}
                  </Badge>
                  <p className="line-clamp-1">{item.description || 'No description'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button 
          onClick={handleSubmitCorrection}
          disabled={isSubmitting || !correction}
        >
          <Check className="mr-2 h-4 w-4" />
          Submit Correction
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ErrorCorrectionInterface;
