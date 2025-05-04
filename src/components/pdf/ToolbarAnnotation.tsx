
import React from 'react';
import { Pen, Highlighter, Type, Square, MousePointer, FileSignature } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ToolbarAnnotationProps {
  currentTool: string;
  onChangeTool: (tool: string) => void;
}

export const ToolbarAnnotation: React.FC<ToolbarAnnotationProps> = ({
  currentTool,
  onChangeTool,
}) => {
  const tools = [
    {
      id: 'select',
      name: 'Select',
      icon: MousePointer,
    },
    {
      id: 'draw',
      name: 'Draw',
      icon: Pen,
    },
    {
      id: 'highlight',
      name: 'Highlight',
      icon: Highlighter,
    },
    {
      id: 'text',
      name: 'Add Text',
      icon: Type,
    },
    {
      id: 'redact',
      name: 'Redact',
      icon: Square,
    },
    {
      id: 'signature',
      name: 'Add Signature',
      icon: FileSignature,
    },
  ];

  return (
    <div className="flex flex-col items-center py-4 space-y-4">
      {tools.map((tool) => (
        <TooltipProvider key={tool.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
                  currentTool === tool.id
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:bg-secondary-100'
                }`}
                onClick={() => onChangeTool(tool.id)}
                aria-label={tool.name}
              >
                <tool.icon className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{tool.name}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};
