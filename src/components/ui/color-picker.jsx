
import React from 'react';
import { useCallback } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Color Picker component with enhanced accessibility and keyboard navigation
 * 
 * @param {Object} props
 * @param {string} props.value - Currently selected color (hex format)
 * @param {function} props.onChange - Function called when color is changed
 * @param {string} [props.className] - Additional CSS classes
 * @returns {React.ReactElement} ColorPicker component
 */
export function ColorPicker({ value = "#000000", onChange, className }) {
  // Predefined color palette
  const colorPalette = [
    "#000000", "#ffffff", "#f44336", "#e91e63", 
    "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", 
    "#03a9f4", "#00bcd4", "#009688", "#4caf50", 
    "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", 
    "#ff9800", "#ff5722", "#795548", "#607d8b",
    "#4f46e5", "#8b5cf6", "#d946ef", "#f97316",
    "#0ea5e9", "#10b981", "#1c64f2", "#7C3AED",
  ];

  const handleColorChange = useCallback((color) => {
    if (onChange) {
      onChange(color);
    }
  }, [onChange]);

  const handleKeyDown = useCallback((event, color) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleColorChange(color);
    }
  }, [handleColorChange]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-10 h-10 p-0 border-2", className)}
          style={{ backgroundColor: value }}
          aria-label={`Current color: ${value}`}
          role="button"
        />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" id="color-picker-label">Select color</span>
            <div 
              className="h-6 w-12 rounded" 
              style={{ backgroundColor: value }}
              role="status"
              aria-label={`Selected color: ${value}`}
            />
          </div>
          <div 
            className="grid grid-cols-8 gap-1 mt-2" 
            role="grid"
            aria-labelledby="color-picker-label"
          >
            {colorPalette.map((color) => (
              <button
                key={color}
                type="button"
                className={cn(
                  "w-6 h-6 rounded-md border border-gray-200 transition-all",
                  "hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
                  color === value && "ring-2 ring-offset-2 ring-primary"
                )}
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
                onKeyDown={(e) => handleKeyDown(e, color)}
                aria-label={`Color: ${color}`}
                aria-selected={color === value}
                role="gridcell"
                tabIndex={0}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
