
import { Button } from '@/components/ui/button';
import { Loader2, PencilIcon, CheckIcon, XIcon } from 'lucide-react';

interface ProfileActionsProps {
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const ProfileActions = ({ isEditing, isSaving, onEdit, onSave, onCancel }: ProfileActionsProps) => {
  if (isEditing) {
    return (
      <>
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          <XIcon className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CheckIcon className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </>
    );
  }

  return (
    <Button onClick={onEdit}>
      <PencilIcon className="h-4 w-4 mr-2" />
      Edit Profile
    </Button>
  );
};

export default ProfileActions;
