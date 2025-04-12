
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SignatureTemplateStyle = {
  id: string;
  name: string;
  backgroundColor: string;
  fontFamily: string;
  color: string;
  borderStyle?: string;
  backgroundGradient?: string;
};

export const signatureTemplates: SignatureTemplateStyle[] = [
  {
    id: 'classic',
    name: 'Classic',
    backgroundColor: '#ffffff',
    fontFamily: 'cursive',
    color: '#000000',
  },
  {
    id: 'formal',
    name: 'Formal',
    backgroundColor: '#f8fafc',
    fontFamily: 'serif',
    color: '#1E293B',
    borderStyle: 'border-b-2 border-secondary-300',
  },
  {
    id: 'modern',
    name: 'Modern',
    backgroundColor: '#ffffff',
    fontFamily: 'sans-serif',
    color: '#3B82F6',
    borderStyle: 'border-l-4 border-primary',
  },
  {
    id: 'elegant',
    name: 'Elegant',
    backgroundColor: '#f1f5f9',
    fontFamily: 'cursive',
    color: '#64748B',
    borderStyle: 'border-b border-secondary-200',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    backgroundColor: '#ffffff',
    fontFamily: 'sans-serif',
    color: '#000000',
  },
  {
    id: 'professional',
    name: 'Professional',
    backgroundColor: '#ffffff',
    fontFamily: 'serif',
    color: '#1E293B',
    borderStyle: 'border-b-2 border-primary-400',
  },
  {
    id: 'colorful',
    name: 'Colorful',
    backgroundColor: '#EFF6FF',
    fontFamily: 'cursive',
    color: '#3B82F6',
    backgroundGradient: 'bg-gradient-to-r from-primary-100 to-secondary-100',
  },
  {
    id: 'creative',
    name: 'Creative',
    backgroundGradient: 'bg-gradient-to-r from-primary-200 to-secondary-200',
    backgroundColor: '#DBEAFE',
    fontFamily: 'cursive',
    color: '#1D4ED8',
  },
];

interface SignatureTemplateProps {
  template: SignatureTemplateStyle;
  isSelected: boolean;
  onClick: () => void;
}

export function SignatureTemplate({ template, isSelected, onClick }: SignatureTemplateProps) {
  return (
    <div 
      className={cn(
        "relative w-full h-32 rounded-lg overflow-hidden border-2 cursor-pointer transition-all hover:shadow-md",
        isSelected ? "border-primary ring-2 ring-primary-200" : "border-gray-200",
        template.backgroundGradient
      )}
      style={{ backgroundColor: template.backgroundColor }}
      onClick={onClick}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span 
          className="text-2xl px-4"
          style={{ 
            fontFamily: template.fontFamily, 
            color: template.color 
          }}
        >
          John Doe
        </span>
      </div>
      
      {template.borderStyle && (
        <div className={cn("absolute bottom-0 left-4 right-4", template.borderStyle)}></div>
      )}
      
      {isSelected && (
        <div className="absolute top-2 right-2 h-6 w-6 bg-primary rounded-full flex items-center justify-center">
          <Check className="h-4 w-4 text-white" />
        </div>
      )}
      
      <div className="absolute bottom-2 left-2 bg-white/80 backdrop-blur-sm text-xs px-2 py-1 rounded">
        {template.name}
      </div>
    </div>
  );
}

export function SignatureTemplateGrid({ 
  templates, 
  selectedTemplate, 
  onSelectTemplate 
}: { 
  templates: SignatureTemplateStyle[]; 
  selectedTemplate: string | null; 
  onSelectTemplate: (templateId: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {templates.map((template) => (
        <SignatureTemplate
          key={template.id}
          template={template}
          isSelected={selectedTemplate === template.id}
          onClick={() => onSelectTemplate(template.id)}
        />
      ))}
    </div>
  );
}
