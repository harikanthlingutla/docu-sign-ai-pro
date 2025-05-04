
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Edit, Pen } from 'lucide-react';
import { toast } from 'sonner';

export const DocumentUpload = () => {
  const navigate = useNavigate();
  const [uploads, setUploads] = useState([
    { id: 1, name: 'Contract.pdf', date: '2023-10-15', size: '1.2 MB' },
    { id: 2, name: 'Agreement.pdf', date: '2023-09-22', size: '548 KB' },
    { id: 3, name: 'NDA.pdf', date: '2023-08-05', size: '750 KB' },
  ]);

  const handleUpload = () => {
    toast.success('Document uploaded successfully');
  };

  const handleEditDocument = (documentId: number, documentName: string) => {
    // In a real app, this would include the path to the document in Supabase storage
    navigate(`/editor?id=${documentId}&name=${documentName}`);
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">My Documents</h3>
            <p className="text-sm text-tertiary">Upload and manage your documents</p>
          </div>
        </div>
        <Button onClick={handleUpload}>Upload Document</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left">
              <th className="py-3 px-2 sm:px-4 font-medium text-sm text-tertiary">File Name</th>
              <th className="py-3 px-2 sm:px-4 font-medium text-sm text-tertiary hidden sm:table-cell">Date</th>
              <th className="py-3 px-2 sm:px-4 font-medium text-sm text-tertiary hidden sm:table-cell">Size</th>
              <th className="py-3 px-2 sm:px-4 font-medium text-sm text-tertiary text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map((doc) => (
              <tr key={doc.id} className="border-b hover:bg-secondary-100">
                <td className="py-3 px-2 sm:px-4 font-medium">{doc.name}</td>
                <td className="py-3 px-2 sm:px-4 text-tertiary hidden sm:table-cell">{doc.date}</td>
                <td className="py-3 px-2 sm:px-4 text-tertiary hidden sm:table-cell">{doc.size}</td>
                <td className="py-3 px-2 sm:px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditDocument(doc.id, doc.name)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/editor?id=${doc.id}&name=${doc.name}&view=true`)}
                    >
                      View
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
