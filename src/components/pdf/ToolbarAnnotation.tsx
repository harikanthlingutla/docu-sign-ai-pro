
import React from 'react';
import { MousePointer, Highlighter, Pen, Square, Type, Download, Undo, Redo } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ToolbarAnnotationProps {
  currentTool: string;
  onChangeTool: (tool: string) => void;
}

interface Tool {
  id: string;
  name: string;
  icon: React.ElementType;
  shortcut?: string;
}

export const ToolbarAnnotation: React.FC<ToolbarAnnotationProps> = ({ 
  currentTool,
  onChangeTool
}) => {
  const tools: Tool[] = [
    { id: 'select', name: 'Select', icon: MousePointer, shortcut: 'V' },
    { id: 'text', name: 'Add Text', icon: Type, shortcut: 'T' },
    { id: 'highlight', name: 'Highlight', icon: Highlighter, shortcut: 'H' },
    { id: 'draw', name: 'Draw', icon: Pen, shortcut: 'D' },
    { id: 'redact', name: 'Redact', icon: Square, shortcut: 'R' }
  ];
  
  const actions = [
    { id: 'undo', name: 'Undo', icon: Undo, shortcut: '⌘Z' },
    { id: 'redo', name: 'Redo', icon: Redo, shortcut: '⌘Y' },
    { id: 'download', name: 'Download PDF', icon: Download }
  ];

  // Handle tool selection
  const handleToolClick = (toolId: string) => {
    onChangeTool(toolId);
  };

  // Handle action buttons
  const handleActionClick = (actionId: string) => {
    switch (actionId) {
      case 'undo':
        // Handle undo logic
        break;
      case 'redo':
        // Handle redo logic
        break;
      case 'download':
        // Handle download logic
        break;
      default:
        break;
    }
  };

  return (
    <div className="h-full flex flex-col py-2">
      <div className="flex-1 space-y-2">
        {tools.map((tool) => (
          <TooltipProvider key={tool.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={`w-full flex justify-center py-3 ${
                    currentTool === tool.id 
                      ? 'bg-primary/10 text-primary border-l-2 border-primary' 
                      : 'text-tertiary hover:bg-secondary-100'
                  }`}
                  onClick={() => handleToolClick(tool.id)}
                >
                  <tool.icon className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <div>
                  <span>{tool.name}</span>
                  {tool.shortcut && (
                    <span className="ml-2 text-xs opacity-70">[{tool.shortcut}]</span>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-2 mt-2 space-y-2">
        {actions.map((action) => (
          <TooltipProvider key={action.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="w-full flex justify-center py-3 text-tertiary hover:bg-secondary-100"
                  onClick={() => handleActionClick(action.id)}
                >
                  <action.icon className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <div>
                  <span>{action.name}</span>
                  {action.shortcut && (
                    <span className="ml-2 text-xs opacity-70">[{action.shortcut}]</span>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};
