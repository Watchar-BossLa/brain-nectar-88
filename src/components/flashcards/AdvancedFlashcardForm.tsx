
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createNewFlashcard } from '@/services/spacedRepetition';
import FlashcardFormInputs from './FlashcardFormInputs';
import ContentTypeSelector from './form/ContentTypeSelector';
import HelpContent from './form/HelpContent';

interface AdvancedFlashcardFormProps {
  topicId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AdvancedFlashcardForm: React.FC<AdvancedFlashcardFormProps> = ({ 
  topicId,
  onSuccess,
  onCancel
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [contentTypeFront, setContentTypeFront] = useState('text');
  const [contentTypeBack, setContentTypeBack] = useState('text');
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Not authenticated.',
        description: 'You must be logged in to create flashcards.',
        variant: 'destructive',
      });
      return;
    }

    if (!front.trim() || !back.trim()) {
      toast({
        title: 'Input Error',
        description: 'Front and back cannot be empty.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await createNewFlashcard(user.id, front, back, topicId);

      toast({
        title: 'Flashcard created!',
        description: 'Your new flashcard has been successfully created.',
      });

      setFront('');
      setBack('');
      setContentTypeFront('text');
      setContentTypeBack('text');

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/flashcards');
      }
    } catch (error: any) {
      console.error('Error creating flashcard:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create flashcard. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4 p-6">
        <FlashcardFormInputs
          front={front}
          setFront={setFront}
          back={back}
          setBack={setBack}
        />

        <ContentTypeSelector
          contentTypeFront={contentTypeFront}
          setContentTypeFront={setContentTypeFront}
          contentTypeBack={contentTypeBack}
          setContentTypeBack={setContentTypeBack}
        />

        <div className="flex justify-between items-center mt-6">
          <div className="space-x-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Flashcard'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
          <Button type="button" variant="secondary" onClick={() => setShowHelp(!showHelp)}>
            {showHelp ? 'Hide Help' : 'Show Help'}
          </Button>
        </div>
      </form>

      {showHelp && (
        <HelpContent />
      )}
    </Card>
  );
};

export default AdvancedFlashcardForm;
