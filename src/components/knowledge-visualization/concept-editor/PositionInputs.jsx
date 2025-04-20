
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function PositionInputs({ formData, handleChange }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="positionX">X Position</Label>
        <Input
          id="positionX"
          name="positionX"
          type="number"
          value={formData.positionX}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="positionY">Y Position</Label>
        <Input
          id="positionY"
          name="positionY"
          type="number"
          value={formData.positionY}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
