
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PDFViewer } from '@/components/pdf/PDFViewer';
import { ToolbarAnnotation } from '@/components/pdf/ToolbarAnnotation';
import { useIsMobile } from '@/hooks/use-mobile';
import { useResponsive } from '@/hooks/use-responsive';

const Editor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { isMdAndUp } = useResponsive();
  
  const [documentName, setDocumentName] = useState<string>('Document.pdf');
  const [documentPath, setDocumentPath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [currentTool, setCurrentTool] = useState<string>('select');
  
  // Get document path from query params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const path = queryParams.get('path');
    const name = queryParams.get('name');
    
    if (path) {
      setDocumentPath(path);
    }
    
    if (name) {
      setDocumentName(name);
    }
    
    // In a real app, we would validate the document access here
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simulate loading
  }, [location]);
  
  // Handle saving document
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // In a real app, this would:
      // 1. Get the canvas data from Fabric.js
      // 2. Use pdf-lib to merge annotations with the original PDF
      // 3. Upload to Supabase storage
      
      // Simulate saving delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Document saved successfully');
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error('Failed to save document. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangeTool = (tool: string) => {
    setCurrentTool(tool);
  };
  
  // Show mobile warning if on mobile
  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6 text-center bg-secondary-100">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold mb-4">Desktop Experience Recommended</h1>
          <p className="mb-6 text-tertiary">
            The PDF editor works best on larger screens. Please switch to a desktop device for the full editing experience.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-secondary-100">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-tertiary">Loading document...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-secondary-100">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <h1 className="text-lg font-bold truncate max-w-[200px] sm:max-w-xs">{documentName}</h1>
        </div>
        
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Tools */}
        <div className="w-16 border-r border-gray-200 bg-white">
          <ToolbarAnnotation 
            currentTool={currentTool} 
            onChangeTool={handleChangeTool} 
          />
        </div>
        
        {/* Main PDF Viewer */}
        <div className="flex-1 overflow-hidden">
          <PDFViewer 
            documentPath={documentPath || ""}
            currentTool={currentTool}
          />
        </div>
        
        {/* Right Sidebar - Properties (conditionally rendered on larger screens) */}
        {isMdAndUp && (
          <div className="w-64 border-l border-gray-200 bg-white p-4">
            <Card>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Properties</h3>
                <p className="text-sm text-tertiary mb-4">
                  Configure your selected tool settings.
                </p>
                
                <Tabs defaultValue="appearance">
                  <TabsList className="w-full">
                    <TabsTrigger value="appearance" className="flex-1">Style</TabsTrigger>
                    <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
                  </TabsList>
                  <TabsContent value="appearance" className="pt-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-tertiary block mb-1">Color</label>
                        <div className="flex space-x-2">
                          {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'].map(color => (
                            <TooltipProvider key={color}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button 
                                    className="w-6 h-6 rounded-full border border-gray-300" 
                                    style={{ backgroundColor: color }}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  {color}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs text-tertiary block mb-1">Thickness</label>
                        <div className="flex space-x-2">
                          {[1, 2, 3, 4, 5].map(size => (
                            <TooltipProvider key={size}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button 
                                    className="w-6 h-6 rounded-md border border-gray-300 flex items-center justify-center"
                                  >
                                    <div 
                                      className="rounded-full bg-black" 
                                      style={{ width: size * 2, height: size * 2 }}
                                    />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {size}px
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="settings" className="pt-4">
                    <div className="space-y-3">
                      <p className="text-sm text-tertiary">
                        Tool-specific settings will appear here.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
