
import { UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileAvatarProps {
  avatarUrl: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

const ProfileAvatar = ({ avatarUrl, firstName, lastName, email, size = 'md' }: ProfileAvatarProps) => {
  // Generate initials from name or email
  const userInitials = firstName && lastName
    ? `${firstName[0]}${lastName[0]}`
    : email?.substring(0, 2) || 'U';

  // Determine avatar size based on prop
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };
  
  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={avatarUrl || ''} alt={`${firstName} ${lastName}`} />
      <AvatarFallback className={size === 'lg' ? 'text-xl' : 'text-base'}>
        {userInitials.toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;
