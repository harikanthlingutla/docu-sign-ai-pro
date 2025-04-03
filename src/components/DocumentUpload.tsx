
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, File, X, Check } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
}

export function DocumentUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;
    
    processFiles(selectedFiles);
  };

  const processFiles = (selectedFiles: FileList) => {
    const newFiles: UploadedFile[] = Array.from(selectedFiles).map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0
    }));
    
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
    
    // Simulate upload progress
    newFiles.forEach(newFile => {
      const uploadInterval = setInterval(() => {
        setFiles(prevFiles => 
          prevFiles.map(prevFile => 
            prevFile.id === newFile.id 
              ? { 
                  ...prevFile, 
                  progress: Math.min(prevFile.progress + 10, 100),
                  status: prevFile.progress + 10 >= 100 ? 'success' : 'uploading'
                }
              : prevFile
          )
        );
        
        if (newFile.progress + 10 >= 100) {
          clearInterval(uploadInterval);
        }
      }, 300);
    });
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    if (event.dataTransfer.files.length > 0) {
      processFiles(event.dataTransfer.files);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveFile = (id: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-primary bg-primary-100' : 'border-gray-300 hover:border-primary'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <div className="flex flex-col items-center">
          <Upload className="h-10 w-10 text-tertiary mb-2" />
          <h3 className="text-lg font-medium mb-1">Upload Documents</h3>
          <p className="text-tertiary text-sm mb-4">Drag and drop files here or click to browse</p>
          <p className="text-xs text-tertiary">Supported formats: PDF, DOCX, TXT</p>
          <input
            id="file-upload"
            type="file"
            multiple
            accept=".pdf,.docx,.doc,.txt"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <h4 className="font-medium">Uploaded Files</h4>
          <div className="space-y-3">
            {files.map((file) => (
              <div key={file.id} className="border rounded-lg p-3 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <File className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium text-sm truncate max-w-[200px] sm:max-w-xs">
                        {file.name}
                      </div>
                      <div className="text-xs text-tertiary">
                        {formatFileSize(file.size)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {file.status === 'success' ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : file.status === 'error' ? (
                      <div className="text-xs text-red-500">Failed</div>
                    ) : (
                      <div className="text-xs text-tertiary">{file.progress}%</div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile(file.id);
                      }}
                      className="text-tertiary hover:text-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {file.status === 'uploading' && (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full"
                      style={{ width: `${file.progress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
