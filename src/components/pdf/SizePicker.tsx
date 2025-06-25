
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SizePickerProps {
  selectedSize: number;
  onSizeChange: (size: number) => void;
}

const sizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64];

export function SizePicker({ selectedSize, onSizeChange }: SizePickerProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <Select value={selectedSize.toString()} onValueChange={(value) => onSizeChange(parseInt(value))}>
            <SelectTrigger className="w-20 h-10 border-slate-300">
              <SelectValue placeholder={selectedSize.toString()} />
            </SelectTrigger>
            <SelectContent>
              {sizes.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}px
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </TooltipTrigger>
      <TooltipContent>Font Size</TooltipContent>
    </Tooltip>
  );
}
