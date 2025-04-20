
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface FormHeaderProps {
  isEditing: boolean;
}

export function FormHeader({ isEditing }: FormHeaderProps) {
  return (
    <CardHeader>
      <CardTitle>{isEditing ? 'Edit Concept' : 'Add Concept'}</CardTitle>
      <CardDescription>
        {isEditing ? 'Update concept details' : 'Create a new concept'}
      </CardDescription>
    </CardHeader>
  );
}
