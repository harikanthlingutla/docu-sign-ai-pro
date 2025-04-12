
import React, { useRef, useEffect, useState } from 'react';
import type { Canvas } from 'fabric';
import { Button } from '@/components/ui/button';
import { Trash, RotateCcw, Download } from 'lucide-react';

export function SignatureCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);

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

  const handleClear = () => {
    if (fabricCanvas) {
      fabricCanvas.clear();
      fabricCanvas.backgroundColor = '#ffffff';
      fabricCanvas.renderAll();
      setIsEmpty(true);
    }
  };

  const handleDownload = () => {
    if (fabricCanvas && !isEmpty) {
      // Using proper options object format instead of string
      const dataURL = fabricCanvas.toDataURL({
        format: 'png',
        quality: 1
      });
      const link = document.createElement('a');
      link.download = 'signature.png';
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-white mb-4">
        <canvas ref={canvasRef} />
      </div>
      <div className="flex space-x-3">
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
          Save
        </Button>
      </div>
      <p className="text-xs text-tertiary mt-2">
        Draw your signature with your mouse or touchscreen
      </p>
    </div>
  );
}
