
import React from 'react';
import { useAuth } from '@/context/auth';

const Profile = () => {
  const { user } = useAuth();
  
  // Placeholder component - add actual implementation
  return (
    <div>
      <h1>Profile</h1>
      {user && (
        <div>
          <p>User email: {user.email}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
