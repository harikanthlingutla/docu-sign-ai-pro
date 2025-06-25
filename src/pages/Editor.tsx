
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Save, Download, Share } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PDFViewer } from '@/components/pdf/PDFViewer';
import { ProfessionalToolbar } from '@/components/pdf/ProfessionalToolbar';
import { SitaChat } from '@/components/SitaChat';
import { useIsMobile } from '@/hooks/use-mobile';

const Editor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const [documentName, setDocumentName] = useState<string>('Document.pdf');
  const [documentPath, setDocumentPath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [currentTool, setCurrentTool] = useState<string>('select');
  
  // Text formatting states
  const [selectedColor, setSelectedColor] = useState<string>('#000000');
  const [selectedFont, setSelectedFont] = useState<string>('Arial, sans-serif');
  const [selectedSize, setSelectedSize] = useState<number>(14);
  const [textStyle, setTextStyle] = useState({
    bold: false,
    italic: false,
    underline: false,
  });
  
  // Get document info from query params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const document = queryParams.get('document');
    const name = queryParams.get('name');
    
    if (document) {
      setDocumentPath(document);
    }
    
    if (name) {
      setDocumentName(decodeURIComponent(name));
    }
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [location]);
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
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

  const handleTextStyleChange = (style: { bold?: boolean; italic?: boolean; underline?: boolean }) => {
    setTextStyle(prev => ({ ...prev, ...style }));
  };

  const handleDownload = () => {
    toast.success('Document downloaded successfully');
  };

  const handleShare = () => {
    toast.success('Share link copied to clipboard');
  };
  
  // Show mobile warning
  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6 text-center bg-slate-50">
        <Card className="professional-card p-8 max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-slate-900">Desktop Experience Required</h1>
          <p className="mb-6 text-slate-600">
            The professional document editor works best on larger screens. Please switch to a desktop or tablet device for the full editing experience.
          </p>
          <Button onClick={() => navigate('/dashboard')} className="professional-button">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-slate-600 font-medium">Loading document...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Professional Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')} 
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-slate-300"></div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900 truncate max-w-[300px]">
                {documentName}
              </h1>
              <p className="text-sm text-slate-500">Professional Document Editor</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              onClick={handleShare}
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDownload}
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="professional-button"
            >
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
        </div>
      </div>
      
      {/* Professional Toolbar */}
      <ProfessionalToolbar
        currentTool={currentTool}
        onChangeTool={handleChangeTool}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        selectedFont={selectedFont}
        onFontChange={setSelectedFont}
        selectedSize={selectedSize}
        onSizeChange={setSelectedSize}
        textStyle={textStyle}
        onTextStyleChange={handleTextStyleChange}
      />
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* PDF Editor */}
        <div className="flex-1 overflow-hidden">
          <PDFViewer 
            documentPath={documentPath || ""}
            currentTool={currentTool}
            textFormatting={{
              color: selectedColor,
              fontFamily: selectedFont,
              fontSize: selectedSize,
              fontWeight: textStyle.bold ? 'bold' : 'normal',
              fontStyle: textStyle.italic ? 'italic' : 'normal',
              textDecoration: textStyle.underline ? 'underline' : 'none',
            }}
          />
        </div>
        
        {/* Sita Chat Sidebar */}
        <div className="w-80 border-l border-slate-200">
          <SitaChat />
        </div>
      </div>
    </div>
  );
};

export default Editor;
