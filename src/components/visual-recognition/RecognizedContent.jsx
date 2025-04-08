
import React, { useState, useEffect } from 'react';
import { LatexRenderer } from '@/components/math/LatexRendererWrapper';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { validateLatex } from '@/services/visual-recognition/equationRecognition';
import { toast } from 'react-toastify';
import { Check, Copy, Edit, FileText, Save } from 'lucide-react';

/**
 * Component for displaying and editing recognized content from images
 * 
 * @param {Object} props - Component props
 * @param {Object} props.recognizedContent - The recognized content (equations or notes)
 * @param {string} props.contentType - Type of content ('equation' or 'notes')
 * @param {Function} props.onSave - Callback when content is saved
 * @param {Function} props.onCreateFlashcard - Callback to create flashcard from content
 * @returns {React.ReactElement} RecognizedContent component
 */
const RecognizedContent = ({
  recognizedContent,
  contentType,
  onSave,
  onCreateFlashcard
}) => {
  const [content, setContent] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [selectedTab, setSelectedTab] = useState('preview');
  
  // Initialize content when recognizedContent changes
  useEffect(() => {
    if (recognizedContent) {
      setContent(recognizedContent);
      setEditedContent(contentType === 'equation' ? recognizedContent.latex : recognizedContent.text);
    }
  }, [recognizedContent, contentType]);
  
  // Handle editing of recognized content
  const handleEditContent = () => {
    setIsEditing(true);
    setSelectedTab('edit');
  };
  
  // Handle saving edited content
  const handleSaveContent = () => {
    try {
      let updatedContent;
      
      if (contentType === 'equation') {
        const validatedLatex = validateLatex(editedContent);
        updatedContent = {
          ...content,
          latex: validatedLatex
        };
      } else {
        updatedContent = {
          ...content,
          text: editedContent
        };
      }
      
      setContent(updatedContent);
      setIsEditing(false);
      setSelectedTab('preview');
      
      if (onSave) {
        onSave(updatedContent);
      }
      
      toast.success('Content updated successfully');
    } catch (error) {
      toast.error(`Failed to save: ${error.message}`);
    }
  };
  
  // Handle flashcard creation
  const handleCreateFlashcard = () => {
    if (onCreateFlashcard) {
      onCreateFlashcard(content);
    }
  };
  
  // Copy content to clipboard
  const handleCopyContent = () => {
    const textToCopy = contentType === 'equation' ? content.latex : content.text;
    navigator.clipboard.writeText(textToCopy);
    toast.success('Copied to clipboard');
  };
  
  // Render equation content
  const renderEquationContent = () => {
    const { latex, confidence, alternatives } = content;
    
    return (
      <div className="space-y-4">
        <div className="p-4 bg-muted rounded-md overflow-x-auto">
          <LatexRenderer 
            latex={latex || ''} 
            display={true}
            size="large"
          />
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>Confidence score: {Math.round((confidence || 0) * 100)}%</p>
        </div>
        
        {alternatives && alternatives.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Alternative interpretations</h4>
            <div className="space-y-2">
              {alternatives.map((alt, index) => (
                <div 
                  key={index}
                  className="p-2 border rounded-md cursor-pointer hover:bg-accent"
                  onClick={() => {
                    setContent({...content, latex: alt.latex});
                    setEditedContent(alt.latex);
                  }}
                >
                  <LatexRenderer latex={alt.latex} />
                  <p className="text-xs text-muted-foreground mt-1">
                    Confidence: {Math.round(alt.confidence * 100)}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Render note content
  const renderNoteContent = () => {
    const { text, structure, confidence } = content;
    
    return (
      <div className="space-y-4">
        <div className="p-4 bg-muted rounded-md whitespace-pre-line">
          {text || ''}
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>Confidence score: {Math.round((confidence || 0) * 100)}%</p>
        </div>
        
        {structure && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Detected structure</h4>
            <div className="space-y-2">
              {structure.title && (
                <div className="p-2 border rounded-md">
                  <p className="text-sm font-medium">Title: {structure.title}</p>
                </div>
              )}
              
              {structure.bullets && structure.bullets.length > 0 && (
                <div className="p-2 border rounded-md">
                  <p className="text-sm font-medium mb-1">Bullet points:</p>
                  <ul className="list-disc pl-5 text-sm">
                    {structure.bullets.map((bullet, index) => (
                      <li key={index}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {structure.numbered && structure.numbered.length > 0 && (
                <div className="p-2 border rounded-md">
                  <p className="text-sm font-medium mb-1">Numbered items:</p>
                  <ol className="list-decimal pl-5 text-sm">
                    {structure.numbered.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Render edit content
  const renderEditContent = () => {
    return contentType === 'equation' ? (
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="latex-editor" className="text-sm font-medium">
            LaTeX Content
          </label>
          <Textarea
            id="latex-editor"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows={5}
            className="font-mono text-sm"
            placeholder="Enter LaTeX equation..."
          />
        </div>
        
        <div className="p-4 bg-muted rounded-md overflow-x-auto">
          <p className="text-sm font-medium mb-2">Preview:</p>
          <LatexRenderer 
            latex={editedContent || ''} 
            display={true}
          />
        </div>
      </div>
    ) : (
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="text-editor" className="text-sm font-medium">
            Text Content
          </label>
          <Textarea
            id="text-editor"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows={10}
            className="font-mono text-sm"
            placeholder="Enter text..."
          />
        </div>
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {contentType === 'equation' ? 'Recognized Equation' : 'Recognized Notes'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="edit" disabled={!isEditing}>Edit</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="space-y-4">
            {contentType === 'equation' ? renderEquationContent() : renderNoteContent()}
          </TabsContent>
          
          <TabsContent value="edit" className="space-y-4">
            {renderEditContent()}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <Button variant="outline" size="sm" onClick={handleCopyContent} className="mr-2">
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
          
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={handleEditContent}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleSaveContent}>
              <Check className="mr-2 h-4 w-4" />
              Save
            </Button>
          )}
        </div>
        
        <Button onClick={handleCreateFlashcard}>
          <FileText className="mr-2 h-4 w-4" />
          Create Flashcard
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecognizedContent;
