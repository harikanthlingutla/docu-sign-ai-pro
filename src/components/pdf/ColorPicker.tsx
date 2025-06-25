
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const colors = [
  '#000000', '#1E293B', '#374151', '#6B7280', '#9CA3AF',
  '#DC2626', '#EA580C', '#D97706', '#EAB308', '#65A30D',
  '#059669', '#0891B2', '#0284C7', '#2563EB', '#4F46E5',
  '#7C3AED', '#C026D3', '#DB2777', '#E11D48', '#FFFFFF'
];

export function ColorPicker({ selectedColor, onColorChange }: ColorPickerProps) {
  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-10 w-10 p-0 border-slate-300"
            >
              <div className="flex items-center space-x-1">
                <Palette className="h-4 w-4 text-slate-600" />
                <div 
                  className="w-3 h-3 rounded-sm border border-slate-300" 
                  style={{ backgroundColor: selectedColor }}
                />
              </div>
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Text Color</TooltipContent>
      </Tooltip>
      
      <PopoverContent className="w-64 p-4">
        <div className="grid grid-cols-5 gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => onColorChange(color)}
              className={`w-8 h-8 rounded-md border-2 transition-all hover:scale-110 ${
                selectedColor === color ? 'border-primary ring-2 ring-primary/20' : 'border-slate-300'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Custom Color
          </label>
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-full h-10 rounded-md border border-slate-300 cursor-pointer"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
