
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Copy, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SavedSignature {
  id: string;
  name: string;
  dateCreated: string;
  previewUrl: string;
}

// Example saved signatures (in a real app, these would come from a database)
const demoSignatures: SavedSignature[] = [
  {
    id: 'sig1',
    name: 'Primary Signature',
    dateCreated: '2025-03-15',
    previewUrl: 'https://placehold.co/400x100/e2e8f0/1e293b?text=John+Doe&font=cursive'
  },
  {
    id: 'sig2',
    name: 'Professional Signature',
    dateCreated: '2025-04-02',
    previewUrl: 'https://placehold.co/400x100/dbeafe/1d4ed8?text=John+Doe&font=cursive'
  }
];

export function SavedSignatures() {
  const handleCopy = (id: string) => {
    toast.success('Signature copied to clipboard');
  };

  const handleDownload = (id: string) => {
    toast.success('Signature downloaded');
  };

  const handleDelete = (id: string) => {
    toast.success('Signature deleted');
  };

  return (
    <div className="space-y-6 overflow-x-auto">
      {/* Table for larger screens */}
      <div className="hidden md:block">
        <Card>
          <CardHeader>
            <CardTitle>Signature Library</CardTitle>
            <CardDescription>Your saved signatures for document signing</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Preview</TableHead>
                  <TableHead>Date Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demoSignatures.map((signature) => (
                  <TableRow key={signature.id}>
                    <TableCell className="font-medium">{signature.name}</TableCell>
                    <TableCell>
                      <div className="border rounded-md h-12 flex items-center justify-center overflow-hidden max-w-[200px]">
                        <img 
                          src={signature.previewUrl} 
                          alt={signature.name}
                          className="max-w-full max-h-full object-contain" 
                        />
                      </div>
                    </TableCell>
                    <TableCell>{signature.dateCreated}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleCopy(signature.id)} title="Copy">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDownload(signature.id)} title="Download">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(signature.id)} title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-tertiary">Signatures are securely stored with post-quantum encryption</p>
          </CardFooter>
        </Card>
      </div>
      
      {/* Card layout for all screen sizes, the only visible layout on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {demoSignatures.map((signature) => (
          <Card key={signature.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{signature.name}</CardTitle>
              <CardDescription>Created: {signature.dateCreated}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md h-20 flex items-center justify-center overflow-hidden">
                <img 
                  src={signature.previewUrl} 
                  alt={signature.name}
                  className="max-w-full max-h-full object-contain" 
                />
              </div>
            </CardContent>
            <CardFooter className="bg-secondary-100 justify-between py-2 flex-wrap gap-2">
              <Button variant="ghost" size="sm" onClick={() => handleCopy(signature.id)}>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDownload(signature.id)}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(signature.id)}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
