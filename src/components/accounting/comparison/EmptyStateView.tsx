
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateViewProps {
  onClose: () => void;
}

export const EmptyStateView: React.FC<EmptyStateViewProps> = ({ onClose }) => {
  return (
    <div className="p-6 text-center">
      <p>Please select at least one standard to compare.</p>
      <Button onClick={onClose} className="mt-4">Close</Button>
    </div>
  );
};
