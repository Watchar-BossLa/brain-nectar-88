
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TypeIconSelectProps } from './types';

export const TypeIconSelect: React.FC<TypeIconSelectProps> = ({ formData, handleSelectChange }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="conceptType">Type</Label>
        <Select
          value={formData.conceptType}
          onValueChange={(value) => handleSelectChange("conceptType", value)}
        >
          <SelectTrigger id="conceptType">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="concept">Concept</SelectItem>
            <SelectItem value="topic">Topic</SelectItem>
            <SelectItem value="fact">Fact</SelectItem>
            <SelectItem value="principle">Principle</SelectItem>
            <SelectItem value="process">Process</SelectItem>
            <SelectItem value="example">Example</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="icon">Icon</Label>
        <Select
          value={formData.icon}
          onValueChange={(value) => handleSelectChange("icon", value)}
        >
          <SelectTrigger id="icon">
            <SelectValue placeholder="Select icon" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="circle">Circle</SelectItem>
            <SelectItem value="square">Square</SelectItem>
            <SelectItem value="triangle">Triangle</SelectItem>
            <SelectItem value="diamond">Diamond</SelectItem>
            <SelectItem value="star">Star</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
