
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "@/components/ui/color-picker";

export function ColorSelector({ formData, handleChange, handleColorChange }) {
  return (
    <div className="space-y-2">
      <Label>Color</Label>
      <div className="flex items-center space-x-2">
        <ColorPicker 
          value={formData.color}
          onChange={handleColorChange}
        />
        <Input
          type="text"
          name="color"
          value={formData.color}
          onChange={handleChange}
          className="w-32"
        />
      </div>
    </div>
  );
}
