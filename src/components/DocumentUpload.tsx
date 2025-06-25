
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface UploadedFile {
  file: File;
  id: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
}

export function DocumentUpload() {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'uploading' as const,
      progress: 0,
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate upload process
    newFiles.forEach(uploadedFile => {
      simulateUpload(uploadedFile.id);
    });
  }, []);

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setUploadedFiles(prev => 
        prev.map(file => {
          if (file.id === fileId) {
            const newProgress = Math.min(file.progress + Math.random() * 30, 100);
            
            if (newProgress >= 100) {
              clearInterval(interval);
              setTimeout(() => {
                // Open document in editor after successful upload
                openInEditor(file.file.name, fileId);
              }, 500);
              
              return {
                ...file,
                progress: 100,
                status: 'success' as const,
              };
            }
            
            return { ...file, progress: newProgress };
          }
          return file;
        })
      );
    }, 200);
  };

  const openInEditor = (fileName: string, fileId: string) => {
    toast.success(`${fileName} uploaded successfully!`);
    navigate(`/editor?document=${fileId}&name=${encodeURIComponent(fileName)}`);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div className="space-y-6">
      <Card className="professional-card p-8">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? 'border-primary bg-primary/5 scale-105'
              : 'border-slate-300 hover:border-primary hover:bg-slate-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className={`p-4 rounded-full ${isDragActive ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'} transition-colors duration-300`}>
              <Upload className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {isDragActive ? 'Drop your documents here' : 'Upload Documents'}
              </h3>
              <p className="text-slate-600 mb-4">
                Drag and drop your PDF or Word documents, or click to browse
              </p>
              <Button variant="outline" className="font-medium">
                Choose Files
              </Button>
            </div>
            <p className="text-sm text-slate-500">
              Supports PDF, DOC, DOCX files up to 10MB
            </p>
          </div>
        </div>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card className="professional-card p-6">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">Uploaded Documents</h4>
          <div className="space-y-3">
            {uploadedFiles.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <FileText className="h-5 w-5 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {uploadedFile.file.name}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadedFile.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">
                        {Math.round(uploadedFile.progress)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {uploadedFile.status === 'success' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {uploadedFile.status === 'error' && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(uploadedFile.id)}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
