
import React, { useState } from 'react';
import { SignatureCanvas } from './SignatureCanvas';
import { SavedSignatures } from './SavedSignatures';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function SignaturesTab() {
  const [activeSignatureTab, setActiveSignatureTab] = useState('saved');
  
  return (
    <div className="p-3 sm:p-6">
      <Tabs value={activeSignatureTab} onValueChange={setActiveSignatureTab} className="w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
          <TabsList className="bg-secondary-100">
            <TabsTrigger value="saved">Saved Signatures</TabsTrigger>
            <TabsTrigger value="create">Create Signature</TabsTrigger>
          </TabsList>
          
          <Button 
            onClick={() => setActiveSignatureTab('create')}
            variant={activeSignatureTab === 'saved' ? 'default' : 'outline'}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            {activeSignatureTab === 'saved' ? 'Create New' : 'Save Signature'}
          </Button>
        </div>
        
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
