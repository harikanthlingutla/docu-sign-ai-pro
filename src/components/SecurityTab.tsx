
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Copy, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export function SecurityTab() {
  const handleCopy = () => {
    // Simulate copying to clipboard
    toast.success('Public key copied to clipboard');
  };

  const handleGenerateKey = () => {
    // Simulate key generation
    toast.success('New key generated successfully');
  };

  return (
    <div className="p-3 sm:p-6">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h3 className="text-lg font-semibold">Quantum-Resistant Cryptographic Keys</h3>
          <Button variant="default" onClick={handleGenerateKey} className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate New Key
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border border-secondary-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">CRYSTALS-Dilithium2 Public Key</CardTitle>
              <CardDescription>Used for document verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-xs p-3 bg-secondary-100 rounded border border-secondary-200 overflow-x-auto">
                <pre className="whitespace-pre-wrap break-all">dil2_pk_0x98a2f5ff937d41c5a7d872f51d34f9cf87c0adabba36435ca5b01a5cacbed3b2389d0fd525ed13a32548c9d5c18c52bdd1585adc4a461f6e8baa64aa7d42e32</pre>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button variant="outline" size="sm" onClick={handleCopy} className="w-full sm:w-auto">
                <Copy className="h-3 w-3 mr-2" />
                Copy Public Key
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border border-secondary-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">CRYSTALS-Kyber Security</CardTitle>
              <CardDescription>Quantum-resistant key encapsulation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-secondary-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Active Protection</p>
                  <p className="text-sm text-tertiary">All documents are encrypted with quantum-resistant algorithms</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <p className="text-xs text-tertiary">Last key rotation: 2025-04-20</p>
            </CardFooter>
          </Card>
        </div>
        
        <Card className="border border-secondary-200">
          <CardHeader>
            <CardTitle>Security Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">About Post-Quantum Security</h4>
              <p className="text-sm text-tertiary">
                Your documents are secured using NIST-approved post-quantum cryptography standards. 
                CRYSTALS-Dilithium2 is used for digital signatures, protecting your documents against 
                future quantum computing attacks. Your private key never leaves your device.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-secondary-100 rounded-md">
                <h5 className="font-medium mb-1">Signature Algorithm</h5>
                <p className="text-xs text-tertiary">CRYSTALS-Dilithium2</p>
              </div>
              <div className="p-4 bg-secondary-100 rounded-md">
                <h5 className="font-medium mb-1">Encryption Scheme</h5>
                <p className="text-xs text-tertiary">CRYSTALS-Kyber512</p>
              </div>
              <div className="p-4 bg-secondary-100 rounded-md">
                <h5 className="font-medium mb-1">Hash Function</h5>
                <p className="text-xs text-tertiary">SHA3-256</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
