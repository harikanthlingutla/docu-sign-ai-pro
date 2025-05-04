
import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Canvas } from 'fabric';

interface SignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSignature: (signatureDataUrl: string) => void;
}

export const SignatureDialog: React.FC<SignatureDialogProps> = ({
  open,
  onOpenChange,
  onAddSignature,
}) => {
  const [activeTab, setActiveTab] = useState<string>('draw');
  const [typedName, setTypedName] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);

  // Initialize drawing canvas when the dialog opens
  useEffect(() => {
    if (!open || !canvasRef.current) return;

    // If we've already initialized the canvas, we don't need to do it again
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.clear();
      return;
    }

    const canvas = new Canvas(canvasRef.current, {
      isDrawingMode: true,
      width: 400,
      height: 200,
      backgroundColor: '#ffffff',
    });

    // Set up the brush
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = '#000000';
      canvas.freeDrawingBrush.width = 2;
    }

    fabricCanvasRef.current = canvas;

    return () => {
      // This cleanup function will be called when the component unmounts
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [open]);

  const handleClear = () => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.clear();
      fabricCanvasRef.current.backgroundColor = '#ffffff';
      fabricCanvasRef.current.renderAll();
    }
    setTypedName('');
  };

  const handleSave = () => {
    if (activeTab === 'draw' && fabricCanvasRef.current) {
      const dataUrl = fabricCanvasRef.current.toDataURL({
        format: 'png',
        quality: 1,
      });
      onAddSignature(dataUrl);
    } else if (activeTab === 'type' && typedName) {
      // Create a temporary canvas for the typed signature
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 400;
      tempCanvas.height = 100;
      const ctx = tempCanvas.getContext('2d');
      
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        ctx.font = 'italic 36px "Dancing Script", cursive';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(typedName, tempCanvas.width / 2, tempCanvas.height / 2);
        
        const dataUrl = tempCanvas.toDataURL('image/png');
        onAddSignature(dataUrl);
      }
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Your Signature</DialogTitle>
          <DialogDescription>
            Draw your signature or type your name to add a signature to the document.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="draw" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="draw">Draw</TabsTrigger>
            <TabsTrigger value="type">Type</TabsTrigger>
          </TabsList>
          
          <TabsContent value="draw" className="mt-4">
            <div className="border rounded-md p-1 bg-white">
              <canvas ref={canvasRef} className="w-full touch-none" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Use your mouse or touch screen to draw your signature above
            </p>
          </TabsContent>
          
          <TabsContent value="type" className="mt-4">
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="typed-signature" className="text-sm font-medium block mb-1">
                  Type your name
                </label>
                <input
                  id="typed-signature"
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div className="border rounded-md p-4 h-20 flex items-center justify-center bg-white">
                <p className="italic text-xl font-signature">{typedName}</p>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Your typed name will be converted to a signature style font
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleClear}>Clear</Button>
          <Button 
            onClick={handleSave} 
            disabled={(activeTab === 'draw' && !fabricCanvasRef.current) || 
                    (activeTab === 'type' && !typedName)}
          >
            Add Signature
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
