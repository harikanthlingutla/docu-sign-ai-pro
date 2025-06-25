
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  MousePointer, 
  Type, 
  Square, 
  Signature, 
  Calendar,
  Palette,
  Settings,
  Bold,
  Italic,
  Underline
} from 'lucide-react';
import { ColorPicker } from './ColorPicker';
import { FontPicker } from './FontPicker';
import { SizePicker } from './SizePicker';

interface ProfessionalToolbarProps {
  currentTool: string;
  onChangeTool: (tool: string) => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
  selectedFont: string;
  onFontChange: (font: string) => void;
  selectedSize: number;
  onSizeChange: (size: number) => void;
  textStyle: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
  };
  onTextStyleChange: (style: { bold?: boolean; italic?: boolean; underline?: boolean }) => void;
}

export function ProfessionalToolbar({
  currentTool,
  onChangeTool,
  selectedColor,
  onColorChange,
  selectedFont,
  onFontChange,
  selectedSize,
  onSizeChange,
  textStyle,
  onTextStyleChange,
}: ProfessionalToolbarProps) {
  const tools = [
    { id: 'select', name: 'Select', icon: MousePointer },
    { id: 'signature', name: 'Add Signature', icon: Signature },
    { id: 'text', name: 'Add Text', icon: Type },
    { id: 'date', name: 'Add Date', icon: Calendar },
    { id: 'textbox', name: 'Text Box', icon: Square },
  ];

  return (
    <TooltipProvider>
      <div className="bg-white border-b border-slate-200 p-4 shadow-sm">
        <div className="flex items-center space-x-4">
          {/* Tool Selection */}
          <div className="flex items-center space-x-2">
            {tools.map((tool) => (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={currentTool === tool.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => onChangeTool(tool.id)}
                    className={`h-10 w-10 p-0 ${
                      currentTool === tool.id 
                        ? 'bg-primary text-white shadow-md' 
                        : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <tool.icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{tool.name}</TooltipContent>
              </Tooltip>
            ))}
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Text Formatting */}
          {(currentTool === 'text' || currentTool === 'textbox') && (
            <>
              <div className="flex items-center space-x-2">
                <FontPicker selectedFont={selectedFont} onFontChange={onFontChange} />
                <SizePicker selectedSize={selectedSize} onSizeChange={onSizeChange} />
              </div>

              <Separator orientation="vertical" className="h-6" />

              <div className="flex items-center space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={textStyle.bold ? "default" : "outline"}
                      size="sm"
                      onClick={() => onTextStyleChange({ bold: !textStyle.bold })}
                      className="h-8 w-8 p-0"
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Bold</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={textStyle.italic ? "default" : "outline"}
                      size="sm"
                      onClick={() => onTextStyleChange({ italic: !textStyle.italic })}
                      className="h-8 w-8 p-0"
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Italic</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={textStyle.underline ? "default" : "outline"}
                      size="sm"
                      onClick={() => onTextStyleChange({ underline: !textStyle.underline })}
                      className="h-8 w-8 p-0"
                    >
                      <Underline className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Underline</TooltipContent>
                </Tooltip>
              </div>

              <Separator orientation="vertical" className="h-6" />
            </>
          )}

          {/* Color Picker */}
          <ColorPicker selectedColor={selectedColor} onColorChange={onColorChange} />
        </div>
      </div>
    </TooltipProvider>
  );
}
