
import React from 'react';
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Loader2, Save, Trash2 } from "lucide-react";

interface FormFooterProps {
  isEditing: boolean;
  loading: boolean;
  deleting: boolean;
  onCancel: () => void;
  onDelete?: () => void;
}

export function FormFooter({ isEditing, loading, deleting, onCancel, onDelete }: FormFooterProps) {
  return (
    <CardFooter className="flex justify-between">
      <div className="flex space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading || deleting}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        
        {isEditing && onDelete && (
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
            disabled={loading || deleting}
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </>
            )}
          </Button>
        )}
      </div>
      
      <Button type="submit" disabled={loading || deleting}>
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Save
          </>
        )}
      </Button>
    </CardFooter>
  );
}
