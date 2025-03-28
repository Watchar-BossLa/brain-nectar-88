
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormButtonsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  frontContent: string;
  backContent: string;
}

const FormButtons: React.FC<FormButtonsProps> = ({
  isSubmitting,
  onCancel,
  frontContent,
  backContent
}) => {
  // Calculate if form can be submitted
  const canSubmit = frontContent.trim().length > 0 && backContent.trim().length > 0;
  
  return (
    <div className="flex justify-end gap-2 mt-6">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      
      <Button
        type="submit"
        disabled={isSubmitting || !canSubmit}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          'Create Flashcard'
        )}
      </Button>
    </div>
  );
};

export default FormButtons;
