
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Rect, Textbox } from 'fabric';
import type { TPointerEventInfo, TPointerEvent } from 'fabric';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist/types/src/display/api';
import { Loader2, Minus, Plus } from 'lucide-react';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  documentPath: string;
  currentTool: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ 
  documentPath,
  currentTool 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useRef<HTMLCanvasElement[]>([]);
  const fabricCanvasRefs = useRef<Canvas[]>([]);
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.5);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load the PDF document
  useEffect(() => {
    const loadPDF = async () => {
      if (!documentPath) return;
      
      try {
        setIsLoading(true);
        
        // In a real app, this would be the actual document path from Supabase or other source
        // For demo purposes, we'll use a sample PDF
        const pdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
        
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        
        setPdfDocument(pdf);
        setNumPages(pdf.numPages);
        setCurrentPage(1);
      } catch (error) {
        console.error('Error loading PDF:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPDF();
  }, [documentPath]);

  // Render PDF pages when the document is loaded
  useEffect(() => {
    if (!pdfDocument || !containerRef.current) return;

    const renderPages = async () => {
      // Clear any existing canvas references
      canvasRefs.current = [];
      fabricCanvasRefs.current = [];
      
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        try {
          const page = await pdfDocument.getPage(pageNum);
          
          // Create a wrapper for this page
          const pageWrapper = document.createElement('div');
          pageWrapper.className = 'pdf-page-wrapper relative mb-8';
          containerRef.current?.appendChild(pageWrapper);
          
          // Create canvas for PDF.js to render the PDF
          const pdfCanvas = document.createElement('canvas');
          pdfCanvas.className = 'pdf-canvas absolute top-0 left-0';
          pageWrapper.appendChild(pdfCanvas);
          
          // Calculate viewport dimensions
          const viewport = page.getViewport({ scale });
          pdfCanvas.width = viewport.width;
          pdfCanvas.height = viewport.height;
          
          // Set wrapper dimensions to match canvas
          pageWrapper.style.width = `${viewport.width}px`;
          pageWrapper.style.height = `${viewport.height}px`;
          
          // Render PDF page to canvas
          const renderContext = {
            canvasContext: pdfCanvas.getContext('2d')!,
            viewport: viewport,
          };
          await page.render(renderContext).promise;
          
          // Create Fabric.js canvas for annotations, with the same dimensions
          const fabricCanvas = document.createElement('canvas');
          fabricCanvas.className = 'fabric-canvas absolute top-0 left-0';
          fabricCanvas.width = viewport.width;
          fabricCanvas.height = viewport.height;
          pageWrapper.appendChild(fabricCanvas);
          
          // Initialize Fabric.js canvas
          const fCanvas = new Canvas(fabricCanvas, {
            width: viewport.width,
            height: viewport.height,
            selection: currentTool === 'select',
            backgroundColor: 'transparent',
          });
          
          // Store references to the canvas elements
          canvasRefs.current.push(pdfCanvas);
          fabricCanvasRefs.current.push(fCanvas);
          
          // Set up event listeners for this canvas
          setupFabricEvents(fCanvas, pageNum - 1);
        } catch (error) {
          console.error(`Error rendering page ${pageNum}:`, error);
        }
      }
    };

    renderPages();
  }, [pdfDocument, numPages, scale]);

  // Update canvas mode when current tool changes
  useEffect(() => {
    fabricCanvasRefs.current.forEach(canvas => {
      if (!canvas) return;
      
      // Enable/disable selection based on tool
      canvas.selection = currentTool === 'select';
      
      // Set drawing mode based on tool
      canvas.isDrawingMode = currentTool === 'draw';
      
      if (canvas.isDrawingMode && canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = 2;
        canvas.freeDrawingBrush.color = '#000000';
      }
    });
  }, [currentTool]);

  // Set up Fabric.js canvas event handlers
  const setupFabricEvents = (canvas: Canvas, pageIndex: number) => {
    canvas.on('mouse:down', (options) => {
      handleCanvasMouseDown(canvas, options, pageIndex);
    });

    // Additional event handlers can be added here
  };

  const handleCanvasMouseDown = (canvas: Canvas, options: TPointerEventInfo<TPointerEvent>, pageIndex: number) => {
    // Get the pointer position from the event
    const pointer = options.absolutePointer || canvas.getPointer(options.e);
    if (!pointer) return;

    if (currentTool === 'highlight') {
      // Create a semi-transparent yellow rectangle for highlighting
      const rect = new Rect({
        left: pointer.x,
        top: pointer.y,
        width: 100,
        height: 20,
        fill: 'rgba(255, 255, 0, 0.3)',
        selectable: true,
        evented: true,
      });
      canvas.add(rect);
      canvas.renderAll();
    } else if (currentTool === 'redact') {
      // Create a black rectangle for redaction
      const rect = new Rect({
        left: pointer.x,
        top: pointer.y,
        width: 100,
        height: 20,
        fill: 'black',
        selectable: true,
        evented: true,
      });
      canvas.add(rect);
      canvas.renderAll();
    } else if (currentTool === 'text') {
      // Create a text box
      const text = new Textbox('Add text here', {
        left: pointer.x,
        top: pointer.y,
        fontFamily: 'Arial',
        fontSize: 16,
        fill: '#000000',
        width: 200,
        selectable: true,
        evented: true,
      });
      canvas.add(text);
      canvas.renderAll();
    }
  };

  // Handle zoom in/out
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  return (
    <div className="h-full flex flex-col bg-neutral-100">
      {/* Zoom controls */}
      <div className="bg-white border-b border-gray-200 p-2 flex items-center justify-end space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleZoomOut}
          disabled={scale <= 0.5}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="text-xs font-medium">{Math.round(scale * 100)}%</span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleZoomIn}
          disabled={scale >= 3}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {/* PDF viewer area */}
      <div className="flex-1 overflow-auto p-6 flex justify-center">
        {isLoading ? (
          <div className="flex items-center justify-center w-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div ref={containerRef} className="pdf-container"></div>
        )}
      </div>
    </div>
  );
};

// Simple Button component
const Button = ({ 
  children, 
  variant = 'default', 
  size = 'default', 
  onClick, 
  disabled 
}: { 
  children: React.ReactNode;
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm';
  onClick?: () => void;
  disabled?: boolean;
}) => {
  let className = 'inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none';
  
  if (variant === 'default') {
    className += ' bg-primary text-white hover:bg-primary-600';
  } else if (variant === 'outline') {
    className += ' border border-input bg-background hover:bg-accent hover:text-accent-foreground';
  }
  
  if (size === 'default') {
    className += ' h-10 py-2 px-4 text-sm';
  } else if (size === 'sm') {
    className += ' h-8 px-2 text-xs';
  }
  
  return (
    <button 
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
