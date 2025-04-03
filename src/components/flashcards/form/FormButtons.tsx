
import React from 'react';
import { Button } from '@/components/ui/button';

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
        disabled={isSubmitting || !frontContent || !backContent}
      >
        {isSubmitting ? 'Creating...' : 'Create Flashcard'}
      </Button>
    </div>
  );
};

export default FormButtons;
