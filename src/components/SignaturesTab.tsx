
import React, { useState } from 'react';
import { SignatureCanvas } from './SignatureCanvas';
import { SavedSignatures } from './SavedSignatures';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function SignaturesTab() {
  const [activeSignatureTab, setActiveSignatureTab] = useState('saved');
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Signatures</h1>
        <Button onClick={() => setActiveSignatureTab('create')}>
          <Plus className="h-4 w-4 mr-2" />
          Create New
        </Button>
      </div>
      
      <Tabs value={activeSignatureTab} onValueChange={setActiveSignatureTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="saved">Saved Signatures</TabsTrigger>
          <TabsTrigger value="create">Create Signature</TabsTrigger>
        </TabsList>
        
        <TabsContent value="saved">
          <SavedSignatures />
        </TabsContent>
        
        <TabsContent value="create">
          <SignatureCanvas />
        </TabsContent>
      </Tabs>
    </div>
  );
}
