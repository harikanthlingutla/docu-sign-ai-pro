import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Image, File, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgressIndicator } from '@/components/ui/progress-indicator';

interface UploadDropzoneProps {
  onFileSelect: (files: File[]) => void;
  className?: string;
}

export function UploadDropzone({ onFileSelect, className = "" }: UploadDropzoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            onFileSelect(acceptedFiles);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    multiple: true
  });

  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) return <FileText className="h-8 w-8" />;
    if (file.type.includes('image')) return <Image className="h-8 w-8" />;
    return <File className="h-8 w-8" />;
  };

  const uploadSteps = [
    { label: 'Uploading', completed: uploadProgress > 33, current: uploadProgress <= 33 && uploadProgress > 0 },
    { label: 'Processing', completed: uploadProgress > 66, current: uploadProgress > 33 && uploadProgress <= 66 },
    { label: 'Complete', completed: uploadProgress === 100, current: uploadProgress > 66 && uploadProgress < 100 }
  ];

  return (
    <div className={`w-full ${className}`}>
      <AnimatePresence mode="wait">
          <div
            key="dropzone"
            {...getRootProps()}
            <div
              className={`glass-card cursor-pointer p-12 text-center transition-all duration-300 ${
                isDragActive 
                  ? 'border-primary/50 bg-primary/5 scale-105' 
                  : 'hover:border-primary/30 hover:bg-white/15 dark:hover:bg-white/5'
              }`}
            >
          >
            <input {...getInputProps()} />
            
            <motion.div
              animate={{ 
                y: isDragActive ? -10 : 0,
                scale: isDragActive ? 1.1 : 1
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex flex-col items-center space-y-6"
            >
              <div className={`p-6 rounded-2xl transition-all duration-300 ${
                isDragActive 
                  ? 'bg-primary/20 text-primary' 
                  : 'glass-panel text-primary'
              }`}>
                <Upload className="h-12 w-12" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">
                  {isDragActive ? 'Drop files here' : 'Upload Documents'}
                </h3>
                <p className="text-muted-foreground max-w-md">
                  Drag and drop your PDFs, Word documents, or images here, or click to browse
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="status-success">PDF</span>
                <span className="status-success">DOCX</span>
                <span className="status-success">Images</span>
              </div>
              
              <Button className="btn-gradient">
                Choose Files
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="uploading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-12 text-center"
          >
            <div className="space-y-8">
              <ProgressIndicator steps={uploadSteps} className="justify-center" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}