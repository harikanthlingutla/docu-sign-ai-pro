
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface FontPickerProps {
  selectedFont: string;
  onFontChange: (font: string) => void;
}

const fonts = [
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Helvetica', value: 'Helvetica, sans-serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Courier New', value: 'Courier New, monospace' },
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans, sans-serif' },
];

export function FontPicker({ selectedFont, onFontChange }: FontPickerProps) {
  const currentFont = fonts.find(font => font.value === selectedFont);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <Select value={selectedFont} onValueChange={onFontChange}>
            <SelectTrigger className="w-40 h-10 border-slate-300">
              <SelectValue placeholder={currentFont?.name || 'Font'} />
            </SelectTrigger>
            <SelectContent>
              {fonts.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  <span style={{ fontFamily: font.value }}>{font.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </TooltipTrigger>
      <TooltipContent>Font Family</TooltipContent>
    </Tooltip>
  );
}
