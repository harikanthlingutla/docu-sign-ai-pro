
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Copy, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Saved Signatures</CardTitle>
          <CardDescription>Manage your saved signatures or create a new one</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demoSignatures.map((signature) => (
              <Card key={signature.id} className="overflow-hidden">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-sm">{signature.name}</h3>
                    <span className="text-xs text-muted-foreground">Created: {signature.dateCreated}</span>
                  </div>
                  <div className="border rounded-md h-20 flex items-center justify-center overflow-hidden">
                    <img 
                      src={signature.previewUrl} 
                      alt={signature.name}
                      className="max-w-full max-h-full object-contain" 
                    />
                  </div>
                </div>
                <CardFooter className="p-2 bg-secondary-50 flex justify-between">
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
        </CardContent>
      </Card>
    </div>
  );
}
