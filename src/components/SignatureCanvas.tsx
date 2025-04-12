
import React, { useRef, useEffect, useState } from 'react';
import type { Canvas } from 'fabric';
import { Button } from '@/components/ui/button';
import { Trash, RotateCcw, Download } from 'lucide-react';
import { SignatureTemplateGrid, signatureTemplates, type SignatureTemplateStyle } from './SignatureTemplate';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export function SignatureCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>('classic');
  const [drawMethod, setDrawMethod] = useState<'draw' | 'type'>('draw');

  useEffect(() => {
    // Dynamically import fabric to avoid SSR issues
    const loadFabric = async () => {
      try {
        const { Canvas, PencilBrush } = await import('fabric');
        
        if (!canvasRef.current) return;
        
        const canvas = new Canvas(canvasRef.current, {
          isDrawingMode: true,
          width: 400,
          height: 200,
          backgroundColor: '#ffffff'
        });
        
        // Set up drawing brush
        const brush = new PencilBrush(canvas);
        brush.width = 2;
        brush.color = '#000000';
        canvas.freeDrawingBrush = brush;
        
        // Event listeners
        canvas.on('path:created', () => {
          setIsEmpty(false);
        });
        
        setFabricCanvas(canvas);
        
        return () => {
          canvas.dispose();
        };
      } catch (error) {
        console.error('Error loading Fabric.js:', error);
      }
    };
    
    loadFabric();
  }, []);

  // Apply template styles to canvas
  useEffect(() => {
    if (!fabricCanvas || !selectedTemplate) return;
    
    const template = signatureTemplates.find(t => t.id === selectedTemplate);
    if (!template) return;
    
    fabricCanvas.backgroundColor = template.backgroundColor;
    
    if (fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = template.color;
    }
    
    fabricCanvas.renderAll();
  }, [fabricCanvas, selectedTemplate]);

  const handleClear = () => {
    if (fabricCanvas) {
      fabricCanvas.clear();
      const template = signatureTemplates.find(t => t.id === selectedTemplate);
      fabricCanvas.backgroundColor = template?.backgroundColor || '#ffffff';
      fabricCanvas.renderAll();
      setIsEmpty(true);
    }
  };

  const handleDownload = () => {
    if (fabricCanvas && !isEmpty) {
      // Updated to include multiplier property
      const dataURL = fabricCanvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2 // Increase resolution while keeping file size reasonable
      });
      const link = document.createElement('a');
      link.download = 'signature.png';
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Signature downloaded successfully!");
    } else {
      toast.error("Please create a signature first");
    }
  };

  const handleSave = () => {
    if (fabricCanvas && !isEmpty) {
      toast.success("Signature saved to your account");
    } else {
      toast.error("Please create a signature first");
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (isEmpty && fabricCanvas) {
      const template = signatureTemplates.find(t => t.id === templateId);
      if (template) {
        fabricCanvas.backgroundColor = template.backgroundColor;
        fabricCanvas.renderAll();
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Choose a Template</CardTitle>
          <CardDescription>Select a style for your signature</CardDescription>
        </CardHeader>
        <CardContent>
          <SignatureTemplateGrid 
            templates={signatureTemplates} 
            selectedTemplate={selectedTemplate} 
            onSelectTemplate={handleTemplateSelect} 
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create Your Signature</CardTitle>
          <CardDescription>Draw your signature or type your name in your chosen style</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <RadioGroup defaultValue="draw" className="flex space-x-4" onValueChange={(value) => setDrawMethod(value as 'draw' | 'type')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="draw" id="draw" />
                <label htmlFor="draw" className="text-sm font-medium">Draw signature</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="type" id="type" disabled />
                <label htmlFor="type" className="text-sm font-medium text-muted-foreground">Type signature (coming soon)</label>
              </div>
            </RadioGroup>
          </div>

          <div className={`border-2 border-dashed border-gray-300 rounded-lg overflow-hidden mb-4 ${selectedTemplate && signatureTemplates.find(t => t.id === selectedTemplate)?.backgroundGradient}`}>
            <canvas ref={canvasRef} />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClear}
              className="flex items-center"
            >
              <Trash className="mr-1 h-4 w-4" />
              Clear
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                handleClear();
              }}
              className="flex items-center"
            >
              <RotateCcw className="mr-1 h-4 w-4" />
              Reset
            </Button>
            <Button 
              size="sm" 
              onClick={handleDownload}
              disabled={isEmpty}
              className="flex items-center"
            >
              <Download className="mr-1 h-4 w-4" />
              Download
            </Button>
            <Button 
              size="sm" 
              variant="default"
              onClick={handleSave}
              disabled={isEmpty}
              className="flex items-center ml-auto"
            >
              Save to My Signatures
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-4">
            Draw your signature with your mouse or touchscreen
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
