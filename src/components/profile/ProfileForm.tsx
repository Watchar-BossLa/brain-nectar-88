
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProfileFormProps {
  firstName: string;
  lastName: string;
  email?: string | null;
  isEditing: boolean;
  onChange: {
    firstName: (value: string) => void;
    lastName: (value: string) => void;
  };
}

const ProfileForm = ({ firstName, lastName, email, isEditing, onChange }: ProfileFormProps) => {
  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => onChange.firstName(e.target.value)}
            placeholder="Enter your first name"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => onChange.lastName(e.target.value)}
            placeholder="Enter your last name"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">First Name</h3>
          <p className="text-base">{firstName || '–'}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Last Name</h3>
          <p className="text-base">{lastName || '–'}</p>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
        <p className="text-base">{email || '–'}</p>
      </div>
    </div>
  );
};

export default ProfileForm;
