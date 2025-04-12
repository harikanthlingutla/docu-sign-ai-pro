import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DocumentUpload } from '@/components/DocumentUpload';
import { SignaturesTab } from '@/components/SignaturesTab';
import { ChatInterface } from '@/components/ChatInterface';
import { FileText, MessageSquare, Pencil, Shield, User, LogOut } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('documents');

  return (
    <div className="min-h-screen bg-secondary-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r hidden md:block">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M10 13.5V10h-7v3.5a1.5 1.5 0 0 0 3 0V12a1 1 0 0 1 2 0v1.5a1.5 1.5 0 0 0 3 0Z" />
                <path d="M10 13.5V10h7v3.5a1.5 1.5 0 0 1-3 0V12a1 1 0 0 0-2 0v1.5a1.5 1.5 0 0 1-3 0Z" />
                <path d="M21 19H3" />
                <path d="M12 2v6" />
              </svg>
            </div>
            <span className="text-secondary font-display font-bold text-xl">SignThatDoc</span>
          </div>
        </div>
        
        <div className="py-4">
          <button
            className={`w-full flex items-center space-x-3 px-4 py-3 text-left ${
              activeTab === 'documents'
                ? 'bg-primary-100 text-primary font-medium'
                : 'text-secondary hover:bg-secondary-100'
            }`}
            onClick={() => setActiveTab('documents')}
          >
            <FileText className="h-5 w-5" />
            <span>Documents</span>
          </button>
          
          <button
            className={`w-full flex items-center space-x-3 px-4 py-3 text-left ${
              activeTab === 'signatures'
                ? 'bg-primary-100 text-primary font-medium'
                : 'text-secondary hover:bg-secondary-100'
            }`}
            onClick={() => setActiveTab('signatures')}
          >
            <Pencil className="h-5 w-5" />
            <span>Signatures</span>
          </button>
          
          <button
            className={`w-full flex items-center space-x-3 px-4 py-3 text-left ${
              activeTab === 'assistant'
                ? 'bg-primary-100 text-primary font-medium'
                : 'text-secondary hover:bg-secondary-100'
            }`}
            onClick={() => setActiveTab('assistant')}
          >
            <MessageSquare className="h-5 w-5" />
            <span>AI Assistant</span>
          </button>
          
          <button
            className={`w-full flex items-center space-x-3 px-4 py-3 text-left ${
              activeTab === 'security'
                ? 'bg-primary-100 text-primary font-medium'
                : 'text-secondary hover:bg-secondary-100'
            }`}
            onClick={() => setActiveTab('security')}
          >
            <Shield className="h-5 w-5" />
            <span>Security Keys</span>
          </button>
        </div>
        
        <div className="absolute bottom-0 w-64 border-t">
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-secondary-200 flex items-center justify-center">
                <User className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <div className="font-medium">John Doe</div>
                <div className="text-sm text-tertiary">john@example.com</div>
              </div>
            </div>
            <Button variant="outline" className="w-full flex items-center justify-center">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden w-full fixed top-0 z-50 bg-white border-b">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M10 13.5V10h-7v3.5a1.5 1.5 0 0 0 3 0V12a1 1 0 0 1 2 0v1.5a1.5 1.5 0 0 0 3 0Z" />
                <path d="M10 13.5V10h7v3.5a1.5 1.5 0 0 1-3 0V12a1 1 0 0 0-2 0v1.5a1.5 1.5 0 0 1-3 0Z" />
                <path d="M21 19H3" />
                <path d="M12 2v6" />
              </svg>
            </div>
            <span className="text-secondary font-display font-bold text-xl">SignThatDoc</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <div className="h-8 w-8 rounded-full bg-secondary-200 flex items-center justify-center">
              <User className="h-4 w-4 text-secondary" />
            </div>
          </div>
        </div>
        
        <div className="flex border-t">
          <button
            className={`flex-1 flex flex-col items-center py-2 ${
              activeTab === 'documents'
                ? 'text-primary'
                : 'text-tertiary'
            }`}
            onClick={() => setActiveTab('documents')}
          >
            <FileText className="h-5 w-5" />
            <span className="text-xs mt-1">Documents</span>
          </button>
          
          <button
            className={`flex-1 flex flex-col items-center py-2 ${
              activeTab === 'signatures'
                ? 'text-primary'
                : 'text-tertiary'
            }`}
            onClick={() => setActiveTab('signatures')}
          >
            <Pencil className="h-5 w-5" />
            <span className="text-xs mt-1">Signatures</span>
          </button>
          
          <button
            className={`flex-1 flex flex-col items-center py-2 ${
              activeTab === 'assistant'
                ? 'text-primary'
                : 'text-tertiary'
            }`}
            onClick={() => setActiveTab('assistant')}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs mt-1">Assistant</span>
          </button>
          
          <button
            className={`flex-1 flex flex-col items-center py-2 ${
              activeTab === 'security'
                ? 'text-primary'
                : 'text-tertiary'
            }`}
            onClick={() => setActiveTab('security')}
          >
            <Shield className="h-5 w-5" />
            <span className="text-xs mt-1">Security</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 md:p-8 p-4 md:pt-8 pt-28">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'documents' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Documents</h1>
                <Button>Upload Document</Button>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <DocumentUpload />
              </div>
            </div>
          )}
          
          {activeTab === 'signatures' && (
            <SignaturesTab />
          )}
          
          {activeTab === 'assistant' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">AI Document Assistant</h1>
              </div>
              <div className="bg-white rounded-lg shadow-sm h-[600px]">
                <ChatInterface />
              </div>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Security Keys</h1>
                <Button>Generate New Key</Button>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Quantum-Resistant Cryptographic Keys</h2>
                <div className="space-y-6">
                  <div className="bg-secondary-100 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">CRYSTALS-Dilithium2 Public Key</h3>
                      <Button variant="outline" size="sm">Copy</Button>
                    </div>
                    <div className="bg-white p-3 rounded border border-secondary-200 font-mono text-xs overflow-x-auto">
                      dil2_pk_0x98a2f5ff937d41c5a7d872f51d34f9cf87c0adabba36435ca5b01a5cacbed3b2...
                    </div>
                    <p className="text-xs text-tertiary mt-2">
                      This is your quantum-resistant public key used for document verification.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">About Post-Quantum Security</h3>
                    <p className="text-sm text-tertiary">
                      Your documents are secured using NIST-approved post-quantum cryptography standards. 
                      CRYSTALS-Dilithium2 is used for digital signatures, protecting your documents against 
                      future quantum computing attacks. Your private key never leaves your device.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
