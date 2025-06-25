import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Rect, Textbox, Image as FabricImage, type TPointerEventInfo, type TPointerEvent } from 'fabric';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';
import { Loader2, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SignatureDialog } from './SignatureDialog';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface TextFormatting {
  color: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
}

interface PDFViewerProps {
  documentPath: string;
  currentTool: string;
  textFormatting?: TextFormatting;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ 
  documentPath,
  currentTool,
  textFormatting = {
    color: '#000000',
    fontFamily: 'Arial, sans-serif',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
  }
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useRef<HTMLCanvasElement[]>([]);
  const fabricCanvasRefs = useRef<Canvas[]>([]);
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.5);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [signatureDialogOpen, setSignatureDialogOpen] = useState<boolean>(false);
  const [activeCanvas, setActiveCanvas] = useState<{canvas: Canvas, pageIndex: number} | null>(null);

  // Load the PDF document
  useEffect(() => {
    const loadPDF = async () => {
      if (!documentPath) return;
      
      try {
        setIsLoading(true);
        const pdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        
        setPdfDocument(pdf);
        setNumPages(pdf.numPages);
      } catch (error) {
        console.error('Error loading PDF:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPDF();
  }, [documentPath]);

  // Render PDF pages
  useEffect(() => {
    if (!pdfDocument || !containerRef.current) return;

    const renderPages = async () => {
      canvasRefs.current = [];
      fabricCanvasRefs.current = [];
      
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        try {
          const page = await pdfDocument.getPage(pageNum);
          
          const pageWrapper = document.createElement('div');
          pageWrapper.className = 'pdf-page-wrapper relative mb-8 shadow-lg rounded-lg overflow-hidden border border-slate-200';
          containerRef.current?.appendChild(pageWrapper);
          
          const pdfCanvas = document.createElement('canvas');
          pdfCanvas.className = 'pdf-canvas absolute top-0 left-0';
          pageWrapper.appendChild(pdfCanvas);
          
          const viewport = page.getViewport({ scale });
          pdfCanvas.width = viewport.width;
          pdfCanvas.height = viewport.height;
          
          pageWrapper.style.width = `${viewport.width}px`;
          pageWrapper.style.height = `${viewport.height}px`;
          
          const renderContext = {
            canvasContext: pdfCanvas.getContext('2d')!,
            viewport: viewport,
          };
          await page.render(renderContext).promise;
          
          const fabricCanvas = document.createElement('canvas');
          fabricCanvas.className = 'fabric-canvas absolute top-0 left-0';
          fabricCanvas.width = viewport.width;
          fabricCanvas.height = viewport.height;
          pageWrapper.appendChild(fabricCanvas);
          
          const fCanvas = new Canvas(fabricCanvas, {
            width: viewport.width,
            height: viewport.height,
            selection: currentTool === 'select',
            backgroundColor: 'transparent',
          });
          
          canvasRefs.current.push(pdfCanvas);
          fabricCanvasRefs.current.push(fCanvas);
          
          setupFabricEvents(fCanvas, pageNum - 1);
        } catch (error) {
          console.error(`Error rendering page ${pageNum}:`, error);
        }
      }
    };

    renderPages();
  }, [pdfDocument, numPages, scale]);

  // Update canvas mode when tool changes
  useEffect(() => {
    fabricCanvasRefs.current.forEach(canvas => {
      if (!canvas) return;
      canvas.selection = currentTool === 'select';
    });
  }, [currentTool]);

  const setupFabricEvents = (canvas: Canvas, pageIndex: number) => {
    canvas.on('mouse:down', (options: TPointerEventInfo<TPointerEvent>) => {
      handleCanvasMouseDown(canvas, options, pageIndex);
    });
  };

  const handleCanvasMouseDown = (canvas: Canvas, options: TPointerEventInfo<TPointerEvent>, pageIndex: number) => {
    const pointer = options.absolutePointer || canvas.getPointer(options.e);
    if (!pointer) return;

    switch (currentTool) {
      case 'text':
        const text = new Textbox('Click to edit text', {
          left: pointer.x,
          top: pointer.y,
          fontFamily: textFormatting.fontFamily,
          fontSize: textFormatting.fontSize,
          fill: textFormatting.color,
          fontWeight: textFormatting.fontWeight,
          fontStyle: textFormatting.fontStyle,
          underline: textFormatting.textDecoration === 'underline',
          width: 200,
          selectable: true,
          evented: true,
        });
        canvas.add(text);
        canvas.renderAll();
        break;

      case 'textbox':
        const textBox = new Rect({
          left: pointer.x,
          top: pointer.y,
          width: 150,
          height: 40,
          fill: 'transparent',
          stroke: textFormatting.color,
          strokeWidth: 2,
          selectable: true,
          evented: true,
        });
        canvas.add(textBox);
        
        const textInBox = new Textbox('Text Box', {
          left: pointer.x + 10,
          top: pointer.y + 10,
          fontFamily: textFormatting.fontFamily,
          fontSize: textFormatting.fontSize,
          fill: textFormatting.color,
          fontWeight: textFormatting.fontWeight,
          fontStyle: textFormatting.fontStyle,
          underline: textFormatting.textDecoration === 'underline',
          width: 130,
          selectable: true,
          evented: true,
        });
        canvas.add(textInBox);
        canvas.renderAll();
        break;

      case 'date':
        const currentDate = new Date().toLocaleDateString();
        const dateText = new Textbox(currentDate, {
          left: pointer.x,
          top: pointer.y,
          fontFamily: textFormatting.fontFamily,
          fontSize: textFormatting.fontSize,
          fill: textFormatting.color,
          fontWeight: textFormatting.fontWeight,
          fontStyle: textFormatting.fontStyle,
          underline: textFormatting.textDecoration === 'underline',
          width: 120,
          selectable: true,
          evented: true,
        });
        canvas.add(dateText);
        canvas.renderAll();
        break;

      case 'signature':
        setActiveCanvas({ canvas, pageIndex });
        setSignatureDialogOpen(true);
        break;
    }
  };

  const handleAddSignature = (signatureDataUrl: string) => {
    if (!activeCanvas) return;

    FabricImage.fromURL(signatureDataUrl, {}, (img) => {
      img.set({
        left: activeCanvas.canvas.width! / 2 - 100,
        top: activeCanvas.canvas.height! / 2 - 50,
        scaleX: 0.5,
        scaleY: 0.5,
        selectable: true,
        evented: true,
      });
      
      activeCanvas.canvas.add(img);
      activeCanvas.canvas.renderAll();
      setSignatureDialogOpen(false);
    });
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  return (
    <div className="h-full flex flex-col bg-slate-100">
      {/* Zoom controls */}
      <div className="bg-white border-b border-slate-200 p-3 flex items-center justify-end space-x-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleZoomOut}
          disabled={scale <= 0.5}
          className="border-slate-300"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium text-slate-700 min-w-[60px] text-center">
          {Math.round(scale * 100)}%
        </span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleZoomIn}
          disabled={scale >= 3}
          className="border-slate-300"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {/* PDF viewer area */}
      <div className="flex-1 overflow-auto p-8 flex justify-center">
        {isLoading ? (
          <div className="flex items-center justify-center w-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div ref={containerRef} className="pdf-container"></div>
        )}
      </div>

      <SignatureDialog 
        open={signatureDialogOpen} 
        onOpenChange={setSignatureDialogOpen} 
        onAddSignature={handleAddSignature}
      />
    </div>
  );
};
